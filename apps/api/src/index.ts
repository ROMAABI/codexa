import { createApp } from './app';
import { connectDB } from './database/connection';
import { ENV } from './config/env';

async function bootstrap() {
  await connectDB();
  const app = createApp();

  app.listen(ENV.PORT, () => {
    console.log(`[Codexa API] Server running on http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`);
  });
}

export * from './app';
export * from './database/connection';
export * from './modules/execution/execution.service';
export * from './modules/execution/sandbox.runner';

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('[Codexa API] Startup failed:', err);
    process.exit(1);
  });
}
