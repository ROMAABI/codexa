import { Worker, Job } from 'bullmq';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codexa';
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

import { ExecutionService } from '@codexa/api';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('[Executor Worker] Connected to MongoDB');

  const worker = new Worker(
    'code-execution-queue',
    async (job: Job) => {
      console.log(`[Executor Worker] Processing job ${job.id}: submission ${job.data.submissionId}`);
      try {
        const result = await ExecutionService.processSubmissionJob(job.data.submissionId);
        console.log(`[Executor Worker] Job ${job.id} completed: ${result.status}`);
        return result;
      } catch (err: any) {
        console.error(`[Executor Worker] Job ${job.id} failed:`, err);
        throw err;
      }
    },
    {
      connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        maxRetriesPerRequest: null,
      },
      concurrency: 3,
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[Executor Worker] Job ${job?.id} failed with error:`, err);
  });

  console.log('[Executor Worker] Code Execution Worker ready and waiting for jobs.');
}

main().catch((err) => {
  console.error('[Executor Worker] Fatal error:', err);
  process.exit(1);
});
