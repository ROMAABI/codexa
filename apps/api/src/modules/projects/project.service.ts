import mongoose from 'mongoose';
import {
  ProjectFile,
  ProjectWorkspaceDTO,
  ProjectRunRequest,
  ProjectRunResponse,
  ProjectSubmissionRequest,
  ProjectSubmissionResponse,
  TerminalExecRequest,
  TerminalExecResponse,
  ProgrammingLanguage,
} from '@codexa/shared';
import { ProjectModel, IProject } from '../../database/models/Project';
import { ProjectWorkspaceModel, IProjectWorkspace } from '../../database/models/ProjectWorkspace';
import { ProjectSubmissionModel } from '../../database/models/ProjectSubmission';
import { UserModel } from '../../database/models/User';
import { SandboxRunner } from '../execution/sandbox.runner';
import { SkillService } from '../skills/skill.service';

export class ProjectService {
  /**
   * Helper to format a ProjectWorkspace and Project into a clean client DTO
   */
  private static formatWorkspaceDTO(project: IProject, workspace: IProjectWorkspace): ProjectWorkspaceDTO {
    return {
      projectId: project._id.toString(),
      slug: project.slug,
      title: project.title,
      description: project.description,
      language: (project.language || 'javascript') as ProgrammingLanguage,
      template: project.template,
      entryFile: project.entryFile || 'server.js',
      runCommand: project.runCommand || 'node server.js',
      testCommand: project.testCommand || 'node test.js',
      previewType: project.previewType || 'web',
      previewPort: project.previewPort || 5000,
      files: workspace.files.map((f) => ({
        path: f.path,
        content: f.content,
        isBinary: f.isBinary,
      })),
      activeMilestone: workspace.activeMilestone || 1,
      activeFilePath: workspace.activeFilePath || project.entryFile || 'server.js',
      openFiles: workspace.openFiles && workspace.openFiles.length > 0
        ? workspace.openFiles
        : [workspace.activeFilePath || project.entryFile || 'server.js'],
      checkpoints: workspace.checkpoints?.map((cp: any) => ({
        id: cp._id ? cp._id.toString() : String(cp.milestone),
        milestone: cp.milestone,
        savedAt: cp.savedAt ? cp.savedAt.toISOString() : new Date().toISOString(),
        commitMessage: cp.commitMessage,
        fileCount: cp.files?.length || 0,
      })),
      lastSavedAt: workspace.lastSavedAt ? workspace.lastSavedAt.toISOString() : undefined,
      milestones: project.milestones.map((m) => ({
        title: m.title,
        description: m.description,
        order: m.order,
        requiredFiles: m.requiredFiles,
      })),
      skillsDemonstrated: project.skillsDemonstrated || [],
    };
  }

  /**
   * Loads or creates a persistent workspace for a user and project
   */
  static async getOrCreateWorkspace(userId: string, projectSlug: string): Promise<ProjectWorkspaceDTO> {
    const project = await ProjectModel.findOne({ slug: projectSlug });
    if (!project) {
      throw new Error(`Project '${projectSlug}' not found.`);
    }

    const uId = new mongoose.Types.ObjectId(userId);
    let workspace = await ProjectWorkspaceModel.findOne({
      userId: uId,
      projectSlug,
    });

    if (!workspace) {
      const initialFiles = project.starterFiles && project.starterFiles.length > 0
        ? project.starterFiles.map((sf) => ({ path: sf.path, content: sf.content, isBinary: sf.isBinary }))
        : [{ path: project.entryFile || 'server.js', content: '// Starter code\n', isBinary: false }];

      const defaultEntry = project.entryFile || initialFiles[0]?.path || 'server.js';

      workspace = await ProjectWorkspaceModel.create({
        userId: uId,
        projectId: project._id,
        projectSlug: project.slug,
        files: initialFiles,
        activeMilestone: 1,
        activeFilePath: defaultEntry,
        openFiles: [defaultEntry],
        checkpoints: [
          {
            milestone: 1,
            savedAt: new Date(),
            commitMessage: 'Initial project setup from starter template',
            files: initialFiles,
          },
        ],
        lastSavedAt: new Date(),
      });
    }

    return this.formatWorkspaceDTO(project, workspace);
  }

  /**
   * Saves workspace files, active file, and open tabs
   */
  static async saveWorkspace(
    userId: string,
    projectSlug: string,
    data: {
      files?: ProjectFile[];
      activeMilestone?: number;
      activeFilePath?: string;
      openFiles?: string[];
      checkpointMessage?: string;
    }
  ): Promise<ProjectWorkspaceDTO> {
    const project = await ProjectModel.findOne({ slug: projectSlug });
    if (!project) {
      throw new Error(`Project '${projectSlug}' not found.`);
    }

    const uId = new mongoose.Types.ObjectId(userId);
    let workspace = await ProjectWorkspaceModel.findOne({
      userId: uId,
      projectSlug,
    });

    if (!workspace) {
      workspace = new ProjectWorkspaceModel({
        userId: uId,
        projectId: project._id,
        projectSlug,
        files: [],
        activeMilestone: 1,
        activeFilePath: project.entryFile || 'server.js',
        openFiles: [project.entryFile || 'server.js'],
        checkpoints: [],
      });
    }

    if (data.files && Array.isArray(data.files)) {
      workspace.files = data.files.map((f) => ({
        path: f.path,
        content: f.content || '',
        isBinary: Boolean(f.isBinary),
      }));
    }

    if (data.activeMilestone !== undefined) {
      workspace.activeMilestone = data.activeMilestone;
    }

    if (data.activeFilePath) {
      workspace.activeFilePath = data.activeFilePath;
    }

    if (data.openFiles && Array.isArray(data.openFiles)) {
      workspace.openFiles = data.openFiles;
    }

    workspace.lastSavedAt = new Date();

    if (data.checkpointMessage) {
      workspace.checkpoints.push({
        milestone: workspace.activeMilestone,
        savedAt: new Date(),
        commitMessage: data.checkpointMessage,
        files: workspace.files,
      });
    }

    await workspace.save();
    return this.formatWorkspaceDTO(project, workspace);
  }

  /**
   * Executes multi-file project inside bubblewrap sandbox
   */
  static async runProject(
    userId: string,
    projectSlug: string,
    runReq: ProjectRunRequest
  ): Promise<ProjectRunResponse> {
    const project = await ProjectModel.findOne({ slug: projectSlug });
    const language = runReq.language || (project?.language as ProgrammingLanguage) || 'javascript';
    const entryFile = runReq.entryFile || project?.entryFile || 'server.js';
    const command = runReq.command || project?.runCommand;

    const result = await SandboxRunner.executeMultiFileProject({
      files: runReq.files,
      entryFile,
      command,
      language,
      timeoutMs: 10000,
    });

    // Update lastRunAt on workspace
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        await ProjectWorkspaceModel.updateOne(
          { userId: new mongoose.Types.ObjectId(userId), projectSlug },
          { $set: { lastRunAt: new Date() } }
        );
      }
    } catch {}

    return {
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      executionTimeMs: result.executionTimeMs,
    };
  }

  /**
   * Evaluates milestone submission against server-side hidden test suite
   */
  static async submitMilestone(
    userId: string,
    projectSlug: string,
    submissionReq: ProjectSubmissionRequest
  ): Promise<ProjectSubmissionResponse> {
    const project = await ProjectModel.findOne({ slug: projectSlug });
    if (!project) {
      throw new Error(`Project '${projectSlug}' not found.`);
    }

    const milestone = project.milestones.find((m) => m.order === submissionReq.milestoneOrder);
    if (!milestone) {
      throw new Error(`Milestone ${submissionReq.milestoneOrder} not found for project '${projectSlug}'.`);
    }

    // Execute evaluation in isolated bubblewrap sandbox
    const evalResult = await SandboxRunner.executeProjectEvaluation({
      files: submissionReq.files,
      milestoneOrder: submissionReq.milestoneOrder,
      testCases: milestone.testCases?.map((tc) => ({
        testName: tc.testName,
        hint: tc.hint,
      })),
      verificationScript: milestone.verificationScript,
      language: project.language,
      timeoutMs: 12000,
    });

    let xpAwarded = 0;
    const uId = new mongoose.Types.ObjectId(userId);

    if (evalResult.passed) {
      xpAwarded = 50; // Milestone completion XP
      try {
        await UserModel.findByIdAndUpdate(uId, {
          $inc: { xp: xpAwarded },
          $set: { lastActiveDate: new Date().toISOString().split('T')[0] },
        });
      } catch (err) {
        console.warn('Could not award user XP:', err);
      }

      // Update workspace milestone and create checkpoint
      try {
        const nextMilestone = Math.min(
          milestone.order + 1,
          project.milestones.length
        );

        await ProjectWorkspaceModel.updateOne(
          { userId: uId, projectSlug },
          {
            $set: {
              activeMilestone: nextMilestone,
              lastSavedAt: new Date(),
            },
            $push: {
              checkpoints: {
                milestone: milestone.order,
                savedAt: new Date(),
                commitMessage: `Milestone ${milestone.order} passed (${evalResult.score}% score)`,
                files: submissionReq.files,
              },
            },
          }
        );
        // Record calibrated skill evidence for demonstrated project skills
        if (project.skillsDemonstrated && Array.isArray(project.skillsDemonstrated)) {
          for (const sSlug of project.skillsDemonstrated) {
            try {
              await SkillService.recordEvidence({
                userId,
                skillSlug: sSlug,
                sourceType: 'PROJECT',
                sourceId: project.slug,
                score: evalResult.score || 100,
                passed: evalResult.passed,
              });
            } catch (err) {
              console.warn('Could not record skill evidence for project milestone:', err);
            }
          }
        }
      } catch (err) {
        console.warn('Could not update workspace after submission:', err);
      }
    }

    // Record submission history
    let submissionDoc;
    try {
      submissionDoc = await ProjectSubmissionModel.create({
        userId: uId,
        projectId: project._id,
        projectSlug,
        milestoneOrder: submissionReq.milestoneOrder,
        filesSnapshot: submissionReq.files,
        status: evalResult.status,
        score: evalResult.score,
        passedCount: evalResult.passedCount,
        totalCount: evalResult.totalCount,
        testResults: evalResult.testResults,
        stdout: evalResult.stdout,
        stderr: evalResult.stderr,
        executionTimeMs: evalResult.executionTimeMs,
        feedback: evalResult.passed
          ? `Great work! All ${evalResult.passedCount} tests passed for Milestone ${milestone.order}.`
          : `Milestone ${milestone.order} incomplete: ${evalResult.passedCount} of ${evalResult.totalCount} tests passed. Review hints and try again.`,
      });
    } catch (err) {
      console.warn('Could not save project submission record:', err);
    }

    return {
      submissionId: submissionDoc?._id.toString() || String(Date.now()),
      milestoneOrder: submissionReq.milestoneOrder,
      status: evalResult.status,
      passed: evalResult.passed,
      score: evalResult.score,
      passedCount: evalResult.passedCount,
      totalCount: evalResult.totalCount,
      testResults: evalResult.testResults,
      stdout: evalResult.stdout,
      stderr: evalResult.stderr,
      executionTimeMs: evalResult.executionTimeMs,
      xpAwarded,
      feedback: evalResult.passed
        ? `Great job! Milestone ${milestone.order} verified successfully (+${xpAwarded} XP).`
        : `Milestone ${milestone.order} validation failed. ${evalResult.passedCount}/${evalResult.totalCount} tests passed.`,
    };
  }

  /**
   * Executes an interactive terminal command in the project sandbox
   */
  static async execTerminal(
    userId: string,
    projectSlug: string,
    termReq: TerminalExecRequest
  ): Promise<TerminalExecResponse> {
    const project = await ProjectModel.findOne({ slug: projectSlug });
    const language = termReq.language || (project?.language as ProgrammingLanguage) || 'javascript';

    const result = await SandboxRunner.executeTerminal({
      files: termReq.files,
      command: termReq.command,
      language,
      timeoutMs: 10000,
    });

    // If files were created or modified via terminal (e.g. npm install creating package.json or touch/rm), sync to workspace
    if (result.updatedFiles && result.updatedFiles.length > 0) {
      try {
        if (mongoose.Types.ObjectId.isValid(userId)) {
          await ProjectWorkspaceModel.updateOne(
            { userId: new mongoose.Types.ObjectId(userId), projectSlug },
            { $set: { files: result.updatedFiles, lastSavedAt: new Date() } }
          );
        }
      } catch (err) {
        console.warn('Could not auto-save updated workspace files from terminal:', err);
      }
    }

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      updatedFiles: result.updatedFiles,
    };
  }

  /**
   * Resets workspace files to starter files
   */
  static async resetWorkspace(userId: string, projectSlug: string): Promise<ProjectWorkspaceDTO> {
    const project = await ProjectModel.findOne({ slug: projectSlug });
    if (!project) {
      throw new Error(`Project '${projectSlug}' not found.`);
    }

    const uId = new mongoose.Types.ObjectId(userId);
    const initialFiles = project.starterFiles && project.starterFiles.length > 0
      ? project.starterFiles.map((sf) => ({ path: sf.path, content: sf.content, isBinary: sf.isBinary }))
      : [{ path: project.entryFile || 'server.js', content: '// Starter code\n', isBinary: false }];

    const defaultEntry = project.entryFile || initialFiles[0]?.path || 'server.js';

    let workspace = await ProjectWorkspaceModel.findOne({ userId: uId, projectSlug });
    if (!workspace) {
      workspace = new ProjectWorkspaceModel({
        userId: uId,
        projectId: project._id,
        projectSlug,
      });
    }

    workspace.files = initialFiles;
    workspace.activeFilePath = defaultEntry;
    workspace.openFiles = [defaultEntry];
    workspace.lastSavedAt = new Date();
    workspace.checkpoints.push({
      milestone: workspace.activeMilestone || 1,
      savedAt: new Date(),
      commitMessage: 'Workspace reset to starter template',
      files: initialFiles,
    });

    await workspace.save();
    return this.formatWorkspaceDTO(project, workspace);
  }
}
