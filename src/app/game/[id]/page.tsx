'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Wallet, Star, ChevronRight, Share2, Heart, MessageSquare } from 'lucide-react';
import AIRecommend, { AIFloatingButton } from '../../../components/AIRecommend';
import BottomNav from '../../../components/BottomNav';
import { useI18n } from '../../../context/I18nContext';
import { getGameById } from '../../../data/games';
import { notFound } from 'next/navigation';

const reviews = [
  { id: 1, user: '玩家小明', userEn: 'GamerMing', avatar: '🎮', rating: 5, content: '这款游戏太好玩了！画面精美，玩法丰富，强烈推荐！', contentEn: 'This game is so fun! Beautiful graphics, rich gameplay, highly recommended!', date: '2026-06-20', likes: 128 },
  { id: 2, user: '游戏达人', userEn: 'ProGamer', avatar: '🎯', rating: 4, content: '整体不错，就是有点肝。希望能出更多活动。', contentEn: 'Overall good, just a bit grindy. Hope for more events.', date: '2026-06-18', likes: 56 },
  { id: 3, user: '休闲玩家', userEn: 'CasualPlayer', avatar: '🌸', rating: 5, content: '画风超喜欢，音乐也好听，每天都要玩一会儿~', contentEn: 'Love the art style, music is great too, play a little every day~', date: '2026-06-15', likes: 89 },
];

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const [aiOpen, setAiOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  const game = getGameById(params.id as string);
  
  if (!game) {
    notFound();
  }

  const name = locale === 'zh' ? game.name : game.nameEn;
  const description = locale === 'zh' ? game.description : game.descriptionEn;
  const genre = locale === 'zh' ? game.genre : game.genreEn;
  const downloads = locale === 'zh' ? game.downloads : game.downloadsEn;
  const developer = locale === 'zh' ? game.developer : game.developerEn;
  const publisher = locale === 'zh' ? game.publisher : game.publisherEn;
  const tags = locale === 'zh' ? game.tags : game.tagsEn;

  const infoItems = [
    { label: t.game.developer, value: developer },
    { label: t.game.publisher, value: publisher },
    { label: t.game.genre, value: genre },
    { label: t.game.size, value: game.size },
    { label: t.game.version, value: game.version },
    { label: t.game.downloads, value: downloads },
  ];

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-white/5">
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">返回</span>
              </button>
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-0">
        <div className="relative h-[30vh] md:h-[50vh] overflow-hidden">
          <img
            src={game.cover}
            alt={name}
            className="w-full h-full object-cover scale-110 blur-sm opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 pb-3 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={game.icon}
                    alt={name}
                    className="w-14 h-14 md:w-28 md:h-28 rounded-xl md:rounded-2xl object-cover border-2 md:border-4 border-dark-900 shadow-2xl"
                  />
                  <div className="flex-1 min-w-0 py-1">
                    <h1 className="text-base md:text-3xl font-bold text-white mb-1 line-clamp-1">
                      {name}
                    </h1>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-dark-700/80 text-gray-300 border border-white/10">
                        {genre}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-primary-400 text-primary-400" />
                        <span className="font-bold text-white text-xs">{game.rating}</span>
                      </div>
                      <span className="text-gray-400 text-xs line-clamp-1">{downloads}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg md:rounded-xl md:py-2 gold-gradient-bg text-dark-900 font-bold active:scale-95 transition-all text-sm">
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden md:inline">{t.game.download}</span>
                    <span className="md:hidden">{locale === 'zh' ? '下载' : 'Download'}</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg md:rounded-xl md:py-2 glass-card text-white font-semibold active:bg-white/20 transition-all text-sm">
                    <Wallet className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden md:inline">{t.game.recharge}</span>
                    <span className="md:hidden">{locale === 'zh' ? '充值' : 'Recharge'}</span>
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-1.5 md:p-2 rounded-lg md:rounded-xl glass-card transition-all ${
                      isLiked ? 'text-red-500' : 'text-gray-400 active:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-1.5 md:p-2 rounded-lg md:rounded-xl glass-card text-gray-400 active:text-white transition-all">
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 md:px-4 pt-3 pb-4 md:pt-10 md:pb-6">
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-3 md:space-y-6">
              {/* 游戏信息 - 手机上显示 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card rounded-xl md:rounded-2xl p-3 md:p-5"
              >
                <h2 className="text-sm md:text-base font-bold text-white mb-2 md:mb-3">{locale === 'zh' ? '游戏信息' : 'Game Info'}</h2>
                <div className="space-y-2">
                  {infoItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-white font-medium text-right truncate max-w-[60%]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* 评分 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card rounded-xl md:rounded-2xl p-3 md:p-5"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-black gold-gradient-text mb-0.5 md:mb-1">{game.rating}</div>
                  <div className="flex justify-center gap-0.5 md:gap-1 mb-1 md:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          i < Math.floor(game.rating)
                            ? 'fill-primary-400 text-primary-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {locale === 'zh' ? '基于10万+评价' : 'Based on 100K+ reviews'}
                  </p>
                </div>
              </motion.section>

              {/* 游戏截图 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-xl md:rounded-2xl p-3 md:p-5"
              >
                <h2 className="text-sm md:text-lg font-bold text-white mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                  <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-400" />
                  {t.game.screenshots}
                </h2>
                <div className="space-y-3 md:space-y-4">
                  <div className="relative rounded-lg md:rounded-xl overflow-hidden aspect-video">
                    <img
                      src={game.screenshots[activeScreenshot]}
                      alt={`${name} screenshot ${activeScreenshot + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 md:pb-2">
                    {game.screenshots.map((screenshot, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveScreenshot(index)}
                        className={`flex-shrink-0 w-20 h-12 md:w-32 md:h-20 rounded-md md:rounded-lg overflow-hidden border-2 transition-all ${
                          activeScreenshot === index
                            ? 'border-primary-500 scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={screenshot}
                          alt={`thumb ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* 游戏介绍 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-xl md:rounded-2xl p-3 md:p-5"
              >
                <h2 className="text-sm md:text-lg font-bold text-white mb-2 md:mb-3">{t.game.description}</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-xs md:text-sm">
                  {description}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-4">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-xs bg-dark-600/50 text-gray-300 border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.section>

              {/* 玩家评论 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl md:rounded-2xl p-3 md:p-5"
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h2 className="text-sm md:text-lg font-bold text-white">{t.game.reviews}</h2>
                  <button className="text-xs md:text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    {t.game.view_more}
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
                <div className="space-y-2 md:space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-dark-700/30">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-dark-600 flex items-center justify-center text-xs md:text-base flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5 md:mb-1">
                          <span className="font-medium text-white text-xs md:text-sm truncate">{locale === 'zh' ? review.user : review.userEn}</span>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1 md:mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                                i < review.rating
                                  ? 'fill-primary-400 text-primary-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs md:text-sm text-gray-400 line-clamp-2">{locale === 'zh' ? review.content : review.contentEn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* 右侧信息栏 - 仅大屏显示 */}
            <div className="hidden lg:block space-y-6">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card rounded-2xl p-5"
              >
                <h2 className="text-base font-bold text-white mb-3">{locale === 'zh' ? '游戏信息' : 'Game Info'}</h2>
                <div className="space-y-2.5">
                  {infoItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-white font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="text-center">
                  <div className="text-4xl font-black gold-gradient-text mb-1">{game.rating}</div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(game.rating)
                            ? 'fill-primary-400 text-primary-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {locale === 'zh' ? '基于10万+评价' : 'Based on 100K+ reviews'}
                  </p>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </main>

      <AIFloatingButton onClick={() => setAiOpen(true)} />
      <AIRecommend isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      <BottomNav />
    </div>
  );
}
