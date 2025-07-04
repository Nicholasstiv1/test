import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gameService = {
  // Salvar score do usuário
  saveScore: async (userId: number, score: number) => {
    return await prisma.gameSession.create({
      data: {
        userId,
        score,
      },
    });
  },

  // Buscar top scores de um usuário específico
  getUserTopScores: async (userId: number, limit: number = 10) => {
    return await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  },

  // Buscar leaderboard geral
  getLeaderboard: async (limit: number = 10) => {
    return await prisma.gameSession.findMany({
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  },

  // Buscar todas as sessões de um usuário
  getUserSessions: async (userId: number) => {
    return await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' },
    });
  },

  // Buscar estatísticas do usuário
  getUserStats: async (userId: number) => {
    const stats = await prisma.gameSession.aggregate({
      where: { userId },
      _count: {
        id: true,
      },
      _max: {
        score: true,
      },
      _avg: {
        score: true,
      },
    });

    return {
      totalGames: stats._count.id,
      bestScore: stats._max.score || 0,
      averageScore: Math.round(stats._avg.score || 0),
    };
  },
};