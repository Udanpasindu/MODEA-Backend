import { Router, type ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import { env } from '../src/config/env.js';

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

const handler = Router();

handler.use(async (req, _res, next) => {
  if (req.path === '/' || req.path === '/api/v1/health') {
    next();
    return;
  }

  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

handler.use(app);

const serverlessErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Serverless request failed', error);
  res.status(500).json({
    error: {
      code: 'DATABASE_CONNECTION_ERROR',
      message: 'The API could not connect to its database',
    },
  });
};

handler.use(serverlessErrorHandler);

export default handler;
