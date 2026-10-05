import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './connection';
import { UserModel } from './models/User';
import { CourseModel } from './models/Course';
import { ModuleModel } from './models/Module';
import { LessonModel } from './models/Lesson';
import { ActivityModel } from './models/Activity';
import { AssessmentModel } from './models/Assessment';
import { ChallengeModel } from './models/Challenge';
import { SkillModel } from './models/Skill';
import { ResourceModel } from './models/Resource';
import { ProjectModel } from './models/Project';
import { AuthService } from '../modules/auth/auth.service';

import { seedSkills } from './seeds/skills.seed';
import { seedResources } from './seeds/resources.seed';
import { seedWebDevelopmentCourses } from './seeds/courses/web-development.seed';
import { seedProgrammingLanguagesCourses } from './seeds/courses/programming-languages.seed';
import { seedDatabaseCourses } from './seeds/courses/databases.seed';
import { seedAiMlCourses } from './seeds/courses/ai-ml.seed';
import { seedDevopsSystemsCourses } from './seeds/courses/devops-systems.seed';
import { seedProjects } from './seeds/projects.seed';

export async function seedDatabase() {
  console.log('[Seed] Starting database seed for Codexa Multi-Course Universe (20 Courses)...');
  await connectDB();

  // Clear existing collections
  await Promise.all([
    UserModel.deleteMany({}),
    CourseModel.deleteMany({}),
    ModuleModel.deleteMany({}),
    LessonModel.deleteMany({}),
    ActivityModel.deleteMany({}),
    AssessmentModel.deleteMany({}),
    ChallengeModel.deleteMany({}),
    SkillModel.deleteMany({}),
    ResourceModel.deleteMany({}),
    ProjectModel.deleteMany({}),
  ]);

  console.log('[Seed] Cleared existing data.');

  // 1. Seed Technical Skills
  const skills = await seedSkills();
  console.log(`[Seed] Created ${skills.length} cross-domain skills.`);

  // 2. Seed Default Users (Alex & Admin)
  const adminPasswordHash = await AuthService.hashPassword('AdminPass123!');
  const studentPasswordHash = await AuthService.hashPassword('StudentPass123!');

  await UserModel.create({
    email: 'admin@codexa.dev',
    passwordHash: adminPasswordHash,
    name: 'Sarah Chen (Lead Instructor)',
    role: 'ADMIN',
    xp: 2500,
    streak: 15,
    preferences: {
      learningGoal: 'Platform Architecture & Course Review',
      experienceLevel: 'advanced',
      weeklyTargetHours: 10,
    },
  });

  await UserModel.create({
    email: 'alex@codexa.dev',
    passwordHash: studentPasswordHash,
    name: 'Alex Rivera',
    role: 'STUDENT',
    xp: 150,
    streak: 3,
    preferences: {
      learningGoal: 'Full Stack Web Developer Career Switch',
      experienceLevel: 'beginner',
      weeklyTargetHours: 8,
    },
  });

  console.log('[Seed] Created default users (admin@codexa.dev, alex@codexa.dev).');

  // 3. Seed Verified External Documentation & Real YouTube Resources
  const resourceMap = await seedResources();
  console.log(`[Seed] Created ${resourceMap.size} verified external documentation & YouTube resources.`);

  // 4. Seed All 20 Courses Across 5 Engineering Domains
  const webCourses = await seedWebDevelopmentCourses(resourceMap);
  const progCourses = await seedProgrammingLanguagesCourses(resourceMap);
  const dbCourses = await seedDatabaseCourses(resourceMap);
  const aiCourses = await seedAiMlCourses(resourceMap);
  const devopsCourses = await seedDevopsSystemsCourses(resourceMap);

  const allCourses = [...webCourses, ...progCourses, ...dbCourses, ...aiCourses, ...devopsCourses];
  const coursesMap = new Map<string, any>();
  allCourses.forEach((c) => coursesMap.set(c.slug, c));
  console.log(`[Seed] Created ${allCourses.length} complete technical courses across 5 domains!`);

  // 5. Seed Capstone Projects
  const projects = await seedProjects(coursesMap);
  console.log(`[Seed] Created ${projects.length} multi-file capstone projects.`);

  console.log('[Seed] Multi-Course database seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Error seeding database:', err);
      process.exit(1);
    });
}
