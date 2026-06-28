'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import VideoFeed from './VideoFeed';
import AIRecommend from './AIRecommend';
import { Game } from '../lib/types';

interface HeroProps {
  games: Game[];
}

export default function Hero({ games }: HeroProps) {
  const { t, locale } = useI18n();

  const stats = [
    { icon: Trophy, value: '500+', label: locale === 'zh' ? '精品游戏' : 'Quality Games', color: 'text-primary-400' },
    { icon: TrendingUp, value: '10M+', label: locale === 'zh' ? '活跃用户' : 'Active Users', color: 'text-green-400' },
    { icon: Zap, value: 'AI', label: locale === 'zh' ? '智能推荐' : 'Smart Recommend', color: 'text-accent-cyan' },
  ];

  return (
    <section className="relative min-h-[85vh] overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary-500/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent-purple/30 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-cyan/20 blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t.home.hero_title} <span className="text-gradient-animation">{t.home.hero_title_highlight}</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            {t.home.hero_subtitle}
          </p>
          
          <div className="flex items-center justify-center gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-2xl font-black text-white">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-transparent to-accent-purple/10 rounded-[2.5rem] blur-xl -z-10" />
            <VideoFeed games={games} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-[600px] md:h-[650px] relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-accent-purple/10 via-transparent to-primary-500/10 rounded-[2.5rem] blur-xl -z-10" />
            <AIRecommend
              isOpen={true}
              onClose={() => {}}
              mode="embedded"
              autoInit={true}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
