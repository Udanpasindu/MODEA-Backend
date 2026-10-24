import express, { type RequestHandler } from 'express';
import cors from 'cors';
import helmetPackage from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';
import { errors, notFound } from './middleware/error.js';
import { rejectUnsafeMongoKeys } from './middleware/sanitize.js';

// Helmet is callable at runtime, but some NodeNext environments interpret
// its CommonJS declaration as a non-callable module namespace.
const helmet = helmetPackage as unknown as (options?: {
  crossOriginResourcePolicy?: { policy: 'cross-origin' };
}) => RequestHandler;

export const app = express();

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(rejectUnsafeMongoKeys);
app.get('/', (_req, res) => res.json({
  data: {
    service: 'MODEA API',
    status: 'ok',
    health: '/api/v1/health',
  },
}));
app.use('/api/v1', publicRouter);
app.use('/api/v1/admin', adminRouter);
app.use(notFound);
app.use(errors);
