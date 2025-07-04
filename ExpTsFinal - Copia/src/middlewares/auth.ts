import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.uid) {
    return res.redirect('/users'); 
  }
  next();
}