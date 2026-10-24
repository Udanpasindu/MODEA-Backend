import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
export const requireAdmin = (req, _res, next) => { const token = req.cookies?.modea_admin; if (!token)
    return next(new AppError(401, 'UNAUTHORIZED', 'Authentication required')); try {
    req.admin = jwt.verify(token, env.JWT_SECRET);
    next();
}
catch {
    next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
} };
