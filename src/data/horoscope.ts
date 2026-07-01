export interface HoroscopeContent {
  luckyStars: number;
  goodZh: string;
  goodEn: string;
  badZh: string;
  badEn: string;
  fortuneZh: string;
  fortuneEn: string;
  luckyGenreZh: string;
  luckyGenreEn: string;
}

const goodItems = [
  { zh: '五排开黑', en: '5v5 Team Up' },
  { zh: '单排上分', en: 'Solo Rank Up' },
  { zh: '抽卡抽卡', en: 'Gacha Summon' },
  { zh: '养女儿', en: 'Raise Waifu' },
  { zh: '探索新大陆', en: 'Explore New Lands' },
  { zh: '公会团战', en: 'Guild Battle' },
  { zh: '刷副本', en: 'Dungeon Farming' },
  { zh: '打排位', en: 'Ranked Match' },
  { zh: '收集图鉴', en: 'Collection Log' },
  { zh: '休闲挂机', en: 'Idle AFK' },
];

const badItems = [
  { zh: '连跪还玩', en: 'Playing on Losing Streak' },
  { zh: '熬夜肝活动', en: 'Staying Up Late' },
  { zh: '冲动氪金', en: 'Impulsive Spending' },
  { zh: '单排掉星', en: 'Solo Deranking' },
  { zh: '抽卡上头', en: 'Gacha Addiction' },
  { zh: '和队友吵架', en: 'Arguing with Teammates' },
  { zh: '快速上分', en: 'Rushing Rank' },
  { zh: '凌晨抽卡', en: 'Late Night Gacha' },
];

const fortuneItems = [
  { zh: '今日手气爆棚，SSR 在向你招手！', en: 'Lucky day! SSR is calling your name!' },
  { zh: '稳扎稳打，胜利在望', en: 'Steady progress, victory is near' },
  { zh: '适合佛系游玩，开心最重要', en: 'Chill mode on, happiness is priority' },
  { zh: '你的操作今天格外丝滑', en: 'Your skills are extra smooth today' },
  { zh: '组队有惊喜，快叫上朋友吧', en: 'Team surprises await, call your friends!' },
  { zh: '今日欧气满满，试试抽卡？', en: 'Feeling lucky? Try your gacha luck!' },
  { zh: '小心连败，见好就收', en: 'Beware losing streaks, know when to stop' },
  { zh: '新游戏新开始，冒险愉快！', en: 'New game new start, enjoy the adventure!' },
  { zh: '今天适合玩点轻松的', en: 'Perfect day for some casual games' },
  { zh: '你的本命英雄今天超猛', en: 'Your main hero is OP today' },
];

const genres = [
  { zh: 'MOBA', en: 'MOBA' },
  { zh: 'RPG', en: 'RPG' },
  { zh: '策略', en: 'Strategy' },
  { zh: '休闲', en: 'Casual' },
  { zh: '放置', en: 'Idle' },
  { zh: '动作', en: 'Action' },
  { zh: '音游', en: 'Rhythm' },
  { zh: 'MMO', en: 'MMO' },
  { zh: '卡牌', en: 'Card' },
  { zh: '经营', en: 'Simulation' },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function getDateSeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function generateHoroscope(): HoroscopeContent {
  const seed = getDateSeed();
  const random = seededRandom(seed);

  const luckyStars = 3 + Math.floor(random() * 3);
  const goodItem = goodItems[Math.floor(random() * goodItems.length)];
  const badItem = badItems[Math.floor(random() * badItems.length)];
  const fortuneItem = fortuneItems[Math.floor(random() * fortuneItems.length)];
  const genre = genres[Math.floor(random() * genres.length)];

  return {
    luckyStars,
    goodZh: goodItem.zh,
    goodEn: goodItem.en,
    badZh: badItem.zh,
    badEn: badItem.en,
    fortuneZh: fortuneItem.zh,
    fortuneEn: fortuneItem.en,
    luckyGenreZh: genre.zh,
    luckyGenreEn: genre.en,
  };
}

export function getLuckyGameIndex(totalGames: number): number {
  const seed = getDateSeed();
  const random = seededRandom(seed + 9999);
  return Math.floor(random() * totalGames);
}

export function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
