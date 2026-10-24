import type {RequestHandler} from 'express'; import jwt from 'jsonwebtoken'; import {env} from '../config/env.js'; import {AppError} from '../lib/errors.js';
declare global{namespace Express{interface Request{admin?:{id:string;role:string}}}}
export const requireAdmin:RequestHandler=(req,_res,next)=>{const token=req.cookies?.modea_admin; if(!token) return next(new AppError(401,'UNAUTHORIZED','Authentication required')); try{req.admin=jwt.verify(token,env.JWT_SECRET) as {id:string;role:string}; next()}catch{next(new AppError(401,'UNAUTHORIZED','Authentication required'))}};
