import type { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env.js';

let connectionPromise: Promise<typeof mongoose> | undefined;

async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  connectionPromise ??= mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10_000,
  });

  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}

export const ensureDatabaseConnection: RequestHandler = async (req, _res, next) => {
  const pathname = req.originalUrl.split('?')[0] ?? '';
  const isDatabaseRoute = pathname.startsWith('/api/v1/')
    && pathname !== '/api/v1/health';

  if (!isDatabaseRoute) {
    next();
    return;
  }

  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
};
