import mongoose from 'mongoose';
import { SubmissionModel, ISubmission } from '../../database/models/Submission';
import { ChallengeModel } from '../../database/models/Challenge';
import { executionQueue } from './execution.queue';
import { SandboxRunner } from './sandbox.runner';
import { SkillService } from '../skills/skill.service';
import { UserModel } from '../../database/models/User';
import { SYSTEM_DEFAULTS } from '@codexa/shared';

export class ExecutionService {
  /**
   * Run Code: Ephemeral execution against public test cases ONLY.
   * Does NOT persist a submission, does NOT award XP, and does NOT generate skill evidence.
   */
  static async runCode(userId: string, challengeId: string, code: string) {
    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) {
      throw new Error('Coding challenge not found');
    }

    const publicTestCases = challenge.testCases
      .filter((tc: any) => !tc.hidden)
      .map((tc: any) => ({
        id: tc._id.toString(),
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.description,
      }));

    const result = await SandboxRunner.execute({
      code,
      language: challenge.language,
      testCases: publicTestCases,
      timeoutMs: SYSTEM_DEFAULTS.EXECUTION_TIMEOUT_MS,
    });

    return {
      status: result.status,
      results: result.results,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      executionTimeMs: result.executionTimeMs,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    };
  }

  /**
   * Submit Code: Official submission executed against ALL test cases (public + hidden).
   * Creates official Submission record, calculates score, and updates Skill Evidence.
   */
  static async submitCode(userId: string, challengeId: string, code: string): Promise<ISubmission> {
    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) {
      throw new Error('Coding challenge not found');
    }

    // Create submission record in QUEUED status
    const submission = await SubmissionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      challengeId: challenge._id,
      code,
      status: 'QUEUED',
      passedCount: 0,
      totalCount: challenge.testCases.length,
      executionTimeMs: 0,
    });

    // Enqueue background execution job
    try {
      await executionQueue.add('execute-challenge', {
        submissionId: submission._id.toString(),
        userId,
        challengeId: challenge._id.toString(),
        code,
        language: challenge.language,
      });
    } catch (queueErr) {
      console.warn('[Queue] Redis enqueue failed, executing directly in sandbox fallback:', queueErr);
      // Fallback synchronous execution if queue connection is unavailable
      return await this.processSubmissionJob(submission._id.toString());
    }

    return submission;
  }

  static async processSubmissionJob(submissionId: string): Promise<ISubmission> {
    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const challenge = await ChallengeModel.findById(submission.challengeId);
    if (!challenge) {
      throw new Error(`Challenge ${submission.challengeId} not found`);
    }

    submission.status = 'RUNNING';
    await submission.save();

    const formattedTestCases = challenge.testCases.map((tc: any) => ({
      id: tc._id.toString(),
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      description: tc.description,
    }));

    const result = await SandboxRunner.execute({
      code: submission.code,
      language: challenge.language,
      testCases: formattedTestCases,
      timeoutMs: SYSTEM_DEFAULTS.EXECUTION_TIMEOUT_MS,
    });

    submission.status = result.status;
    submission.results = result.results;
    submission.passedCount = result.passedCount;
    submission.totalCount = result.totalCount;
    submission.executionTimeMs = result.executionTimeMs;
    submission.stdout = result.stdout;
    submission.stderr = result.stderr;
    submission.error = result.error;
    await submission.save();

    const passed = result.status === 'PASSED';
    const score = result.totalCount > 0 ? Math.round((result.passedCount / result.totalCount) * 100) : 0;

    // Update Skill Evidence for all affected skills
    if (challenge.skills && challenge.skills.length > 0) {
      for (const s of challenge.skills) {
        await SkillService.recordEvidence({
          userId: submission.userId.toString(),
          skillSlug: s.skillId,
          sourceType: 'CHALLENGE',
          sourceId: challenge._id.toString(),
          score,
          passed,
          mistakeTopic: !passed ? challenge.title : undefined,
        });
      }
    }

    if (passed) {
      await UserModel.findByIdAndUpdate(submission.userId, {
        $inc: { xp: SYSTEM_DEFAULTS.XP_PER_CHALLENGE_PASS },
      });
    }

    return submission;
  }

  static maskHiddenTestResults(submissionObj: any, hiddenIds: Set<string>) {
    if (!submissionObj || !submissionObj.results) return submissionObj;
    const sanitizedResults = submissionObj.results.map((r: any) => {
      if (hiddenIds.has(r.testCaseId?.toString())) {
        return {
          testCaseId: r.testCaseId,
          description: 'Hidden Test Case',
          passed: r.passed,
          expectedOutput: '[HIDDEN]',
          actualOutput: r.passed ? '[PASSED]' : '[FAILED - Output Withheld]',
          errorMessage: r.errorMessage ? 'Hidden test case assertion failed' : undefined,
          durationMs: r.durationMs,
        };
      }
      return r;
    });
    return {
      ...submissionObj,
      results: sanitizedResults,
    };
  }

  static async getSubmission(userId: string, submissionId: string) {
    const submission = await SubmissionModel.findOne({
      _id: new mongoose.Types.ObjectId(submissionId),
      userId: new mongoose.Types.ObjectId(userId), // Enforce student isolation
    }).lean();

    if (!submission) return null;

    const challenge = await ChallengeModel.findById(submission.challengeId);
    if (!challenge) return submission;

    const hiddenIds = new Set(
      challenge.testCases.filter((tc: any) => tc.hidden).map((tc: any) => tc._id.toString())
    );

    return this.maskHiddenTestResults(submission, hiddenIds);
  }

  static async getChallengeSubmissions(userId: string, challengeId: string) {
    const submissions = await SubmissionModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      challengeId: new mongoose.Types.ObjectId(challengeId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) return submissions;

    const hiddenIds = new Set(
      challenge.testCases.filter((tc: any) => tc.hidden).map((tc: any) => tc._id.toString())
    );

    return submissions.map((sub: any) => this.maskHiddenTestResults(sub, hiddenIds));
  }
}
