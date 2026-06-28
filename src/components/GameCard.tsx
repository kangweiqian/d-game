'use client';

import Link from 'next/link';
import { Star, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Game } from '../lib/types';
import { useI18n } from '../context/I18nContext';

interface GameCardProps {
  game: Game;
  rank?: number;
  trend?: 'up' | 'down' | 'stable';
  rankChange?: number;
  size?: 'small' | 'medium' | 'large';
}

export default function GameCard({ game, rank, trend, rankChange, size = 'medium' }: GameCardProps) {
  const { locale } = useI18n();
  const name = locale === 'zh' ? game.name : game.nameEn;
  const genre = locale === 'zh' ? game.genre : game.genreEn;
  const downloads = locale === 'zh' ? game.downloads : game.downloadsEn;

  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[3/4]',
    large: 'aspect-[16/9]',
  };

  return (
    <Link href={`/game/${game.id}`} className="block group">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative rounded-2xl overflow-hidden glass-card card-hover"
      >
        <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
          <img
            src={game.cover}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
          
          {rank && rank <= 3 && (
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-dark-900 font-bold text-sm glow-gold">
              {rank}
            </div>
          )}
          
          {rank && rank > 3 && (
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-dark-800/80 backdrop-blur flex items-center justify-center text-white font-bold text-sm border border-white/10">
              {rank}
            </div>
          )}

          {trend && (
            <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-500/20 text-green-400' :
              trend === 'down' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {rankChange !== undefined && <span>{rankChange}</span>}
            </div>
          )}

          {game.isNew && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent-pink/90 text-white text-xs font-bold">
              NEW
            </div>
          )}

          {game.isHot && !game.isNew && !trend && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent-orange/90 text-white text-xs font-bold">
              HOT
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1 mb-1">
              {name}
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{genre}</span>
              <div className="flex items-center gap-1 text-primary-400">
                <Star className="w-3 h-3 fill-primary-400" />
                <span>{game.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {size === 'large' && (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Download className="w-4 h-4" />
                <span>{downloads}</span>
              </div>
              <button className="px-4 py-1.5 rounded-full gold-gradient-bg text-dark-900 text-sm font-semibold">
                {locale === 'zh' ? '下载' : 'Download'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
