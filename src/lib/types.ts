export interface Game {
  id: string;
  name: string;
  nameEn: string;
  cover: string;
  icon: string;
  video?: string; // 游戏宣传视频
  screenshots: string[];
  developer: string;
  developerEn: string;
  publisher: string;
  publisherEn: string;
  genre: string;
  genreEn: string;
  rating: number;
  downloads: string;
  downloadsEn: string;
  description: string;
  descriptionEn: string;
  size: string;
  version: string;
  minAndroid?: string;
  price?: number;
  isHot?: boolean;
  isNew?: boolean;
  tags: string[];
  tagsEn: string[];
}

export interface RankingItem {
  gameId: string;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  rankChange?: number;
}

export interface Ranking {
  items: RankingItem[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  recommendedGames?: Game[];
}
