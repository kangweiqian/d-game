'use client';

import { useState } from 'react';
import { User, Globe } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import GameRecommend from '../components/GameRecommend';
import AIRecommend from '../components/AIRecommend';
import RandomGameDrawer from '../components/RandomGameDrawer';
import { useI18n } from '../context/I18nContext';
import { getHotGames } from '../data/games';

export default function DiscoverPage() {
  const { locale, toggleLocale } = useI18n();
  const hotGames = getHotGames();
  const [aiOpen, setAiOpen] = useState(false);
  const [randomOpen, setRandomOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 glass-card">
          <div className="flex items-center justify-between px-4 py-3 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="D-GAME Logo" className="h-7" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>{locale === 'zh' ? '中文' : 'EN'}</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center text-gray-400">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col pt-[calc(env(safe-area-inset-top)+3.5rem)] md:pt-0 overflow-hidden">
        <div className="flex-1 overflow-hidden pb-16">
          <GameRecommend
            games={hotGames}
            onAIRecommendClick={() => setAiOpen(true)}
            onRandomGameClick={() => setRandomOpen(true)}
          />
        </div>
      </main>

      <BottomNav />

      <AIRecommend
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />

      <RandomGameDrawer
        isOpen={randomOpen}
        onClose={() => setRandomOpen(false)}
        games={hotGames}
      />
    </div>
  );
}
