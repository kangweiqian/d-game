'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Download, Play } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { games } from '../../data/games';
import { Game } from '../../lib/types';
import BottomNav from '../../components/BottomNav';

const filterTabs = [
  { key: 'all', labelZh: '全部', labelEn: 'All' },
  { key: 'wuxia', labelZh: '武侠', labelEn: 'Wuxia' },
  { key: 'xianxia', labelZh: '仙侠', labelEn: 'Xianxia' },
  { key: 'casual', labelZh: '休闲', labelEn: 'Casual' },
  { key: 'strategy', labelZh: '策略', labelEn: 'Strategy' },
  { key: 'action', labelZh: '动作', labelEn: 'Action' },
  { key: 'idle', labelZh: '放置', labelEn: 'Idle' },
] as const;

function filterGames(activeFilter: string): Game[] {
  if (activeFilter === 'all') return [...games];

  const tagMap: Record<string, string[]> = {
    wuxia: ['武侠'],
    xianxia: ['仙侠', '修仙'],
    casual: ['休闲', '消除', '派对', '泡泡'],
    strategy: ['策略', '塔防'],
    action: ['动作', '射击', '竞速'],
    idle: ['放置'],
  };

  const matchTags = tagMap[activeFilter] || [];
  return games.filter(g =>
    matchTags.some(t =>
      g.genre.includes(t) || g.tags.some(tag => tag.includes(t))
    )
  );
}

function sortGames(games: Game[]): Game[] {
  return [...games].sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0) || b.rating - a.rating);
}

export default function RankingsPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = filterGames(activeFilter);
  const ranked = sortGames(filtered);

  return (
    <div className="min-h-screen">
      <main className="pt-[calc(env(safe-area-inset-top)+16px)] pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pt-4 md:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="14" width="5" height="7" rx="1" fill="#ffffff" />
                  <rect x="9.5" y="8" width="5" height="13" rx="1" fill="rgba(255,255,255,0.7)" />
                  <rect x="16" y="11" width="5" height="10" rx="1" fill="rgba(255,255,255,0.5)" />
                  <circle cx="5.5" cy="10" r="2.5" fill="#FDE68A" />
                  <circle cx="12" cy="4.5" r="2.5" fill="#FDE68A" />
                  <circle cx="18.5" cy="7" r="2.5" fill="#FDE68A" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">
                  {locale === 'zh' ? '游戏排行榜' : 'Game Rankings'}
                </h1>
                <p className="text-gray-400">
                  {locale === 'zh' ? '发现最受欢迎的手游' : 'Discover the most popular mobile games'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 snap-start ${
                    activeFilter === tab.key
                      ? 'text-primary-400 border border-primary-500/30 bg-transparent'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 glass-card'
                  }`}
                >
                  {locale === 'zh' ? tab.labelZh : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">
                {locale === 'zh' ? '排名' : 'Rank'}
              </div>
              <div className="col-span-5">
                {locale === 'zh' ? '游戏' : 'Game'}
              </div>
              <div className="col-span-2">
                {locale === 'zh' ? '类型' : 'Genre'}
              </div>
              <div className="col-span-2">
                {locale === 'zh' ? '下载' : 'Downloads'}
              </div>
              <div className="col-span-2">
                {locale === 'zh' ? '评分' : 'Rating'}
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {ranked.map((game, index) => (
                <div
                  key={game.id}
                  className="flex items-center gap-4 px-4 md:px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                    <span className={
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-amber-500' :
                      'text-gray-500'
                    }>
                      {index + 1}
                    </span>
                  </div>

                  <img
                    src={game.cover}
                    alt={locale === 'zh' ? game.name : game.nameEn}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors truncate text-sm md:text-base">
                        {locale === 'zh' ? game.name : game.nameEn}
                      </h3>
                      {game.isNew && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-dark-600/50 text-gray-300 border border-white/5">
                        {locale === 'zh' ? game.genre : game.genreEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                      <Download className="w-3 h-3 shrink-0" />
                      <span className="text-xs whitespace-nowrap">{locale === 'zh' ? game.downloads : game.downloadsEn}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 fill-primary-400 text-primary-400" />
                    <span className="font-bold text-white text-sm">{game.rating}</span>
                  </div>

                  <button
                    onClick={() => router.push(`/game/${game.id}`)}
                    className="px-4 py-2.5 rounded-xl gold-gradient-bg text-dark-900 text-sm font-semibold shrink-0 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {locale === 'zh' ? '玩一玩' : 'Play'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
