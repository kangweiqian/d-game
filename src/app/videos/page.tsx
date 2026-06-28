'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import GameRecommend from '../../components/GameRecommend';
import AIRecommend from '../../components/AIRecommend';
import BottomNav from '../../components/BottomNav';
import { getHotGames } from '../../data/games';
import { useI18n } from '../../context/I18nContext';

export default function VideosPage() {
  const { locale } = useI18n();
  const hotGames = getHotGames();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => setAiOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500/10 via-dark-600/50 to-dark-700/50 border border-white/10 hover:border-primary-500/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-dark-900" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">
              {locale === 'zh' ? '✨ AI 智能找游戏' : '✨ AI Game Finder'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {locale === 'zh' ? '告诉我你喜欢的类型，帮你精准推荐' : 'Tell me what you like, I will find the best games'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center text-gray-400 group-hover:text-primary-400 transition-colors">
            <Search className="w-4 h-4" />
          </div>
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <GameRecommend games={hotGames} />
      </div>
      <BottomNav />

      <AIRecommend
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
}
