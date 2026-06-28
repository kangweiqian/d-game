'use client';

import Link from 'next/link';
import { Trophy, Sword, Gamepad2, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { Game } from '../lib/types';

interface RankingEntryProps {
  wuxiaGames: Game[];
  instantGames: Game[];
}

export default function RankingEntry({ wuxiaGames, instantGames }: RankingEntryProps) {
  const { t, locale } = useI18n();

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{t.home.ranking_entry_title}</h2>
              <p className="text-sm text-gray-500">{t.home.ranking_entry_subtitle}</p>
            </div>
          </div>
          <Link
            href="/rankings"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            {t.home.view_all}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Sword className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{t.home.wuxia_ranking}</h3>
                  <p className="text-xs text-gray-500">Top Wuxia Games</p>
                </div>
              </div>
              <Link
                href="/rankings?type=wuxia"
                className="text-xs text-primary-400 hover:text-primary-300"
              >
                {t.home.view_all} →
              </Link>
            </div>
            
            <div className="p-4 space-y-3">
              {wuxiaGames.slice(0, 5).map((game, index) => (
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className={`w-6 text-center font-bold text-sm ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-amber-600' :
                    'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <img
                    src={game.cover}
                    alt={locale === 'zh' ? game.name : game.nameEn}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                      {locale === 'zh' ? game.name : game.nameEn}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {locale === 'zh' ? game.genre : game.genreEn}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all">
                    <Play className="w-3 h-3" />
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{t.home.instant_ranking}</h3>
                  <p className="text-xs text-gray-500">Instant Play Games</p>
                </div>
              </div>
              <Link
                href="/rankings?type=instant"
                className="text-xs text-primary-400 hover:text-primary-300"
              >
                {t.home.view_all} →
              </Link>
            </div>
            
            <div className="p-4 space-y-3">
              {instantGames.slice(0, 5).map((game, index) => (
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className={`w-6 text-center font-bold text-sm ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-amber-600' :
                    'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <img
                    src={game.cover}
                    alt={locale === 'zh' ? game.name : game.nameEn}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                      {locale === 'zh' ? game.name : game.nameEn}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {locale === 'zh' ? game.downloads : game.downloadsEn}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 group-hover:bg-green-500/30 transition-all">
                    <Play className="w-3 h-3" />
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
