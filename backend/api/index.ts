import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import { env } from '../src/config/env.js';

let connectionPromise: Promise<typeof mongoose> | undefined;

async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  connectionPromise ??= mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
  });

  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const pathname = req.url?.split('?')[0];
  if (pathname !== '/' && pathname !== '/api/v1/health') {
    await connectDatabase();
  }
  app(req, res);
}
