'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Star, Sparkles, Calendar } from 'lucide-react';
import { Game } from '../lib/types';
import { useI18n } from '../context/I18nContext';
import { generateHoroscope, getLuckyGameIndex, getTodayKey, HoroscopeContent } from '../data/horoscope';

interface DailyHoroscopeProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

export default function DailyHoroscope({ isOpen, onClose, games }: DailyHoroscopeProps) {
  const { locale } = useI18n();
  const [step, setStep] = useState<'drawing' | 'result'>('drawing');
  const [horoscope, setHoroscope] = useState<HoroscopeContent | null>(null);
  const [luckyGame, setLuckyGame] = useState<Game | null>(null);

  const drawHoroscope = useCallback(() => {
    setStep('drawing');
    setTimeout(() => {
      const result = generateHoroscope();
      const gameIdx = getLuckyGameIndex(games.length);
      setHoroscope(result);
      setLuckyGame(games[gameIdx] || games[0]);
      setStep('result');
      try {
        localStorage.setItem('daily_horoscope_date', getTodayKey());
      } catch {}
    }, 1200);
  }, [games]);

  useEffect(() => {
    if (isOpen) {
      try {
        const savedDate = localStorage.getItem('daily_horoscope_date');
        if (savedDate === getTodayKey()) {
          const result = generateHoroscope();
          const gameIdx = getLuckyGameIndex(games.length);
          setHoroscope(result);
          setLuckyGame(games[gameIdx] || games[0]);
          setStep('result');
        } else {
          drawHoroscope();
        }
      } catch {
        drawHoroscope();
      }
    }
  }, [isOpen, games, drawHoroscope]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-dark-900 rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[90vh]">
            {step === 'drawing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-16 text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-7xl mb-6"
                >
                  🎴
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {locale === 'zh' ? '正在抽取今日运势...' : 'Drawing your daily fortune...'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {locale === 'zh' ? '今日好运即将揭晓' : 'Today luck is about to be revealed'}
                </p>
              </motion.div>
            )}

            {step === 'result' && horoscope && luckyGame && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="px-6 pt-6 pb-8"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-orange-300" />
                    <span className="text-xs font-medium text-orange-300">
                      {locale === 'zh' ? '今日游戏运势' : 'Daily Game Horoscope'}
                    </span>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                    className="text-5xl mb-3"
                  >
                    {horoscope.luckyStars >= 5 ? '🌟' : horoscope.luckyStars >= 4 ? '✨' : '⭐'}
                  </motion.div>

                  <div className="flex items-center justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            i < horoscope.luckyStars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-600'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-white/80 text-sm italic">
                    &ldquo;{locale === 'zh' ? horoscope.fortuneZh : horoscope.fortuneEn}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <div className="text-emerald-400 text-xs font-bold mb-2">
                      {locale === 'zh' ? '✅ 宜' : '✅ Good'}
                    </div>
                    <div className="text-white text-sm font-medium">
                      {locale === 'zh' ? horoscope.goodZh : horoscope.goodEn}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20"
                  >
                    <div className="text-rose-400 text-xs font-bold mb-2">
                      {locale === 'zh' ? '❌ 忌' : '❌ Avoid'}
                    </div>
                    <div className="text-white text-sm font-medium">
                      {locale === 'zh' ? horoscope.badZh : horoscope.badEn}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">
                      {locale === 'zh' ? '今日幸运游戏' : "Today's Lucky Game"}
                    </h3>
                    <span className="text-xs text-amber-400/70 ml-auto">
                      {locale === 'zh'
                        ? `幸运类型：${horoscope.luckyGenreZh}`
                        : `Genre: ${horoscope.luckyGenreEn}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={luckyGame.icon}
                        alt={locale === 'zh' ? luckyGame.name : luckyGame.nameEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-base truncate">
                        {locale === 'zh' ? luckyGame.name : luckyGame.nameEn}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3.5 h-3.5 fill-primary-400 text-primary-400" />
                        <span className="text-xs text-gray-300">{luckyGame.rating}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-400 truncate">
                          {locale === 'zh' ? luckyGame.genre : luckyGame.genreEn}
                        </span>
                      </div>
                    </div>
                    <a
                      href={luckyGame.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-4 py-2.5 rounded-xl gold-gradient-bg text-dark-900 font-bold text-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>{locale === 'zh' ? '下载' : 'Play'}</span>
                    </a>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center text-gray-500 text-xs"
                >
                  {locale === 'zh'
                    ? '明天再来抽新签哦～'
                    : 'Come back tomorrow for a new fortune!'}
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
