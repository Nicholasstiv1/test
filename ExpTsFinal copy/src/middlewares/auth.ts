import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.uid) {
    // Se for uma requisição da API, retornar JSON
    if (req.path.startsWith('/api/')) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }
    
    // Se for a página principal, redirecionar para login
    if (req.path === '/') {
      return res.redirect('/users');
    }
    
    // Para outras páginas, redirecionar para login
    return res.redirect('/users'); 
  }
  next();
}