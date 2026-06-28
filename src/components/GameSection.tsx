'use client';

import Link from 'next/link';
import { ChevronRight, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { Game } from '../lib/types';
import GameCard from './GameCard';

interface GameSectionProps {
  title: string;
  subtitle?: string;
  games: Game[];
  viewAllHref?: string;
  variant?: 'hot' | 'new';
}

export default function GameSection({ title, subtitle, games, viewAllHref, variant = 'hot' }: GameSectionProps) {
  const { t } = useI18n();

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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              variant === 'hot' ? 'bg-accent-orange/20 text-accent-orange' : 'bg-accent-cyan/20 text-accent-cyan'
            }`}>
              {variant === 'hot' ? <Flame className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors group"
            >
              {t.home.view_all}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
