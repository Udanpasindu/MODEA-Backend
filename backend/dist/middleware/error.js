import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';
export const notFound = (_req, _res, next) => next(new AppError(404, 'NOT_FOUND', 'Resource not found'));
export const errors = (err, _req, res, _next) => { if (err instanceof ZodError)
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request', issues: err.flatten() } }); const known = err instanceof AppError; const status = known ? err.status : 500; res.status(status).json({ error: { code: known ? err.code : 'INTERNAL_ERROR', message: known ? err.message : 'An unexpected error occurred', ...(known && err.issues ? { issues: err.issues } : {}) } }); };
