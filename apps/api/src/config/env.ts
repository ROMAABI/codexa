import dotenv from 'dotenv';
import path from 'path';

// Load from current working directory or apps/api folder
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/codexa_test'
      : process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codexa',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'codexa-dev-secret-key-at-least-32-chars-long!',
  AI_PROVIDER: process.env.AI_PROVIDER || 'nvidia',
  NVIDIA_API_KEY: process.env.NVIDIA_API_KEY || '',
  NVIDIA_BASE_URL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  NVIDIA_MODEL: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
};
