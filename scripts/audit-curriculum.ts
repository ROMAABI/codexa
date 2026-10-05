import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../apps/api/src/database/connection';
import { CourseModel } from '../apps/api/src/database/models/Course';
import { ModuleModel } from '../apps/api/src/database/models/Module';
import { LessonModel } from '../apps/api/src/database/models/Lesson';
import { ActivityModel } from '../apps/api/src/database/models/Activity';
import { AssessmentModel } from '../apps/api/src/database/models/Assessment';
import { ChallengeModel } from '../apps/api/src/database/models/Challenge';
import { ProjectModel } from '../apps/api/src/database/models/Project';

interface CourseAuditReport {
  slug: string;
  title: string;
  domain: string;
  moduleCount: number;
  lessonCount: number;
  videos: number;
  notes: number;
  codePractices: number;
  assessments: number;
  projects: number;
  validLessons: number;
  invalidLessons: string[];
}

async function runAudit() {
  await connectDB();
  console.log('========================================================================================================');
  console.log('                        CODEXA 4-ACTIVITY LESSON CURRICULUM AUDIT REPORT                               ');
  console.log('========================================================================================================\n');

  const courses = await CourseModel.find().sort({ domain: 1, title: 1 });
  const reports: CourseAuditReport[] = [];

  let totalLessons = 0;
  let totalValidLessons = 0;

  for (const course of courses) {
    const modules = await ModuleModel.find({ courseId: course._id });
    const moduleIds = modules.map((m) => m._id);
    const lessons = await LessonModel.find({ moduleId: { $in: moduleIds } });
    const projects = await ProjectModel.find({ courseId: course._id });

    let videos = 0;
    let notes = 0;
    let codePractices = 0;
    let assessments = 0;
    let validLessons = 0;
    const invalidLessons: string[] = [];

    for (const lesson of lessons) {
      totalLessons++;
      const acts = await ActivityModel.find({ lessonId: lesson._id });
      const hasVideo = acts.some((a) => a.type === 'VIDEO');
      const hasNotes = acts.some((a) => a.type === 'NOTES' || a.type === 'ARTICLE');
      const hasPractice = acts.some((a) => a.type === 'CODING_CHALLENGE' || a.type === 'PRACTICE' || a.type === 'INTERACTIVE_EXERCISE' || a.type === 'CODE_EXAMPLE');
      const hasAssessment = acts.some((a) => a.type === 'QUIZ' || a.type === 'ASSESSMENT');

      if (hasVideo) videos++;
      if (hasNotes) notes++;
      if (hasPractice) codePractices++;
      if (hasAssessment) assessments++;

      if (hasVideo && hasNotes && hasPractice && hasAssessment && acts.length === 4) {
        validLessons++;
        totalValidLessons++;
      } else {
        invalidLessons.push(`${lesson.title} (${acts.length} acts)`);
      }
    }

    reports.push({
      slug: course.slug,
      title: course.title,
      domain: course.domain,
      moduleCount: modules.length,
      lessonCount: lessons.length,
      videos,
      notes,
      codePractices,
      assessments,
      projects: projects.length,
      validLessons,
      invalidLessons,
    });
  }

  // Display Table
  console.log(
    'Course Slug'.padEnd(28) +
      '| Mod | Les |  ① Video | ② Notes | ③ Practice | ④ Assess | Proj | 4-Step Compliance'
  );
  console.log('-'.repeat(105));

  for (const r of reports) {
    const compliance = r.invalidLessons.length === 0 ? '✓ 100% (4/4 Activities)' : `❌ ${r.invalidLessons.join(', ')}`;
    const row =
      `${r.slug.padEnd(28)}| ` +
      `${String(r.moduleCount).padStart(3)} | ` +
      `${String(r.lessonCount).padStart(3)} | ` +
      `${String(r.videos).padStart(8)} | ` +
      `${String(r.notes).padStart(7)} | ` +
      `${String(r.codePractices).padStart(10)} | ` +
      `${String(r.assessments).padStart(8)} | ` +
      `${String(r.projects).padStart(4)} | ` +
      `${compliance}`;
    console.log(row);
  }

  console.log('\n========================================================================================================');
  console.log(`TOTAL COURSES: ${courses.length} | TOTAL LESSONS: ${totalLessons} | 100% 4-ACTIVITY LESSONS: ${totalValidLessons}/${totalLessons}`);
  console.log('========================================================================================================\n');
  await disconnectDB();
}

runAudit().catch(console.error);
