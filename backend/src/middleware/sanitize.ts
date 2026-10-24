import type {RequestHandler} from 'express';
import {AppError} from '../lib/errors.js';

function containsUnsafeKey(value:unknown):boolean{
  if(!value||typeof value!=='object')return false;
  if(Array.isArray(value))return value.some(containsUnsafeKey);
  return Object.entries(value as Record<string,unknown>).some(([key,nested])=>key.startsWith('$')||key.includes('.')||containsUnsafeKey(nested));
}

/** Reject MongoDB operator/path injection without mutating Express 5 read-only request properties. */
export const rejectUnsafeMongoKeys:RequestHandler=(req,_res,next)=>{
  if(containsUnsafeKey(req.body)||containsUnsafeKey(req.query)||containsUnsafeKey(req.params)){
    return next(new AppError(400,'UNSAFE_INPUT','Request contains unsupported field names'));
  }
  next();
};
