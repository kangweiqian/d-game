import { Ranking } from '../lib/types';
import { getWuxiaGames, getInstantGames } from './games';

function createRanking(gameIds: string[]): Ranking {
  return {
    items: gameIds.map((gameId, index) => ({
      gameId,
      rank: index + 1,
      trend: index < 3 ? 'up' : index < 6 ? 'stable' : 'down',
      rankChange: Math.floor(Math.random() * 5) + 1,
    })),
  };
}

const wuxiaGameIds = getWuxiaGames().map(g => g.id);
const instantGameIds = getInstantGames().map(g => g.id);

export const rankings: Record<string, Ranking> = {
  'wuxia-hot': createRanking(wuxiaGameIds),
  'wuxia-rating': createRanking([...wuxiaGameIds].reverse()),
  'instant-hot': createRanking(instantGameIds),
  'instant-new': createRanking([...instantGameIds].reverse()),
};

export function getRanking(type: string, category: string): Ranking | undefined {
  return rankings[`${type}-${category}`];
}

export function getWuxiaRanking(category: string = 'hot'): Ranking | undefined {
  return getRanking('wuxia', category);
}

export function getInstantRanking(category: string = 'hot'): Ranking | undefined {
  return getRanking('instant', category);
}
