'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, Shuffle, Play, Star } from 'lucide-react';
import { Game } from '@/lib/types';
import { useI18n } from '@/context/I18nContext';

interface RandomGameDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

export default function RandomGameDrawer({ isOpen, onClose, games }: RandomGameDrawerProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomGame = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * games.length);
      setCurrentGame(games[randomIndex]);
      setIsAnimating(false);
    }, 300);
  }, [games]);

  useEffect(() => {
    if (isOpen && games.length > 0) {
      getRandomGame();
    }
  }, [isOpen, games, getRandomGame]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 抽屉内容 */}
      <div className="relative w-full max-w-lg bg-dark-900 rounded-t-3xl overflow-hidden animate-slide-up">
        {/* 顶部把手 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 标题 */}
        <div className="text-center pt-2 pb-4">
          <h2 className="text-lg font-bold text-white">
            {locale === 'zh' ? '🎲 抽一款小游戏' : '🎲 Random Game Pick'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {locale === 'zh' ? '不知道玩什么？试试手气吧！' : "Don't know what to play? Try your luck!"}
          </p>
        </div>

        {/* 游戏展示区 */}
        <div className="px-4 pb-4">
          {currentGame && (
            <div
              className={`rounded-2xl overflow-hidden bg-dark-800 transition-all duration-300 ${
                isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* 游戏封面 */}
              <div className="relative w-full aspect-video">
                <img
                  src={currentGame.cover}
                  alt={locale === 'zh' ? currentGame.name : currentGame.nameEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
              </div>

              {/* 游戏信息 */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white">
                      {locale === 'zh' ? currentGame.name : currentGame.nameEn}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-500/20 text-primary-400">
                        {locale === 'zh' ? currentGame.genre : currentGame.genreEn}
                      </span>
                      {(locale === 'zh' ? currentGame.tags : currentGame.tagsEn)
                        .slice(0, 2)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* 评分和下载 */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary-400 text-primary-400" />
                    <span className="text-sm font-bold text-white">{currentGame.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {locale === 'zh'
                      ? `${currentGame.downloads} 下载`
                      : `${currentGame.downloadsEn} downloads`}
                  </span>
                </div>

                {/* 简介 */}
                <p className="text-xs text-gray-400 mt-3 line-clamp-2">
                  {locale === 'zh' ? currentGame.description : currentGame.descriptionEn}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3 px-4 pb-8 pt-2">
          <button
            onClick={getRandomGame}
            disabled={isAnimating}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-dark-700 text-white text-sm font-bold hover:bg-dark-600 active:scale-98 transition-all border border-white/5"
          >
            <Shuffle className="w-4 h-4" />
            {locale === 'zh' ? '换一个' : 'Shuffle'}
          </button>
          <button
            onClick={() => {
              if (currentGame) {
                onClose();
                router.push(`/game/${currentGame.id}`);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl gold-gradient-bg text-dark-900 text-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4 fill-dark-900" />
            {locale === 'zh' ? '立即玩' : 'Play Now'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
