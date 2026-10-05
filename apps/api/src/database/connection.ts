import mongoose from 'mongoose';
import { ENV } from '../config/env';

export async function connectDB(): Promise<void> {
  try {
    // Attempt primary connection with 4s timeout for Atlas resilience
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB] Connected to database: ${mongoose.connection.name}`);
  } catch (err: any) {
    // If primary Atlas connection fails (e.g. pending IP whitelist or offline), fallback to local MongoDB
    if (ENV.MONGODB_URI.includes('mongodb+srv://') || err.name === 'MongooseServerSelectionError') {
      console.warn(`[MongoDB] ⚠️ Could not connect to Atlas (${err.message.split('\n')[0]})`);
      console.warn(`[MongoDB] ⚠️ Make sure your IP or 0.0.0.0/0 is added in MongoDB Atlas -> Network Access.`);
      console.log(`[MongoDB] 🔄 Falling back to local MongoDB (mongodb://127.0.0.1:27017/codexa)...`);
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/codexa', {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`[MongoDB] ✓ Connected to local fallback database: ${mongoose.connection.name}`);
        return;
      } catch (fallbackErr: any) {
        console.error('[MongoDB] Local fallback also failed:', fallbackErr);
        throw fallbackErr;
      }
    }
    console.error('[MongoDB] Connection error:', err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
