import { Queue } from 'bullmq';
import { ENV } from '../../config/env';

export interface CodeExecutionJobData {
  submissionId: string;
  userId: string;
  challengeId: string;
  code: string;
  language: string;
}

export const executionQueue = new Queue<CodeExecutionJobData>('code-execution-queue', {
  connection: {
    host: ENV.REDIS_HOST,
    port: ENV.REDIS_PORT,
    maxRetriesPerRequest: null,
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
