'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Navigation from '../../components/Navigation';
import GameCard from '../../components/GameCard';
import AIRecommend, { AIFloatingButton } from '../../components/AIRecommend';
import BottomNav from '../../components/BottomNav';
import { useI18n } from '../../context/I18nContext';
import { searchGames } from '../../data/games';

function SearchContent() {
  const searchParams = useSearchParams();
  const { t, locale } = useI18n();
  const [aiOpen, setAiOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<ReturnType<typeof searchGames>>([]);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q) {
      setResults(searchGames(q));
    } else {
      setResults([]);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setResults(searchGames(e.target.value));
    } else {
      setResults([]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={t.nav.search}
                autoFocus
                className="w-full pl-14 pr-12 py-4 bg-dark-700/50 border border-white/10 rounded-2xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="text-gray-400">
                {locale === 'zh' ? `找到 ${results.length} 个结果` : `${results.length} results found`}
                {` `}
                <span className="text-primary-400">&quot;{query}&quot;</span>
              </p>
            </motion.div>
          )}

          {results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {results.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </motion.div>
          ) : query ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-700/50 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t.search.no_result}</h3>
              <p className="text-gray-500">{t.search.try_keyword}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-700/50 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-500">
                {locale === 'zh' ? '输入关键词搜索你喜欢的游戏' : 'Enter keywords to search for games'}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <AIFloatingButton onClick={() => setAiOpen(true)} />
      <AIRecommend isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-800" />}>
      <SearchContent />
    </Suspense>
  );
}
