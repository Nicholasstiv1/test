import { Request, Response } from 'express';
import { gameService } from '../services/game.service';

export async function showGamePage(req: Request, res: Response) {
  if (!req.session.uid) {
    return res.redirect('/users');
  }

  // Buscar os top 10 scores do usuário logado
  const userScores = await gameService.getUserTopScores(req.session.uid, 10);
  
  res.render('game/index', { 
    title: 'Space Shooter - Jogo',
    userScores
  });
}

export async function saveScore(req: Request, res: Response) {
  if (!req.session.uid) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }

  const { score } = req.body;

  if (!score || typeof score !== 'number' || score < 0) {
    res.status(400).json({ error: 'Score inválido' });
    return;
  }

  try {
    const gameSession = await gameService.saveScore(req.session.uid, score);
    res.json({ 
      success: true, 
      message: 'Score salvo com sucesso!',
      gameSession 
    });
  } catch (error) {
    console.error('Erro ao salvar score:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const leaderboard = await gameService.getLeaderboard(10);
    res.json(leaderboard);
  } catch (error) {
    console.error('Erro ao buscar leaderboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getUserStats(req: Request, res: Response) {
  if (!req.session.uid) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }

  try {
    const stats = await gameService.getUserStats(req.session.uid);
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}