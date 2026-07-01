'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RotateCcw, Download, Star, ChevronRight } from 'lucide-react';
import { Game } from '../lib/types';
import { useI18n } from '../context/I18nContext';
import { quizQuestions, personalities, calculatePersonality, PersonalityType } from '../data/personality';

interface PersonalityTestProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

export default function PersonalityTest({ isOpen, onClose, games }: PersonalityTestProps) {
  const { locale } = useI18n();
  const [step, setStep] = useState<'intro' | 'quiz' | 'calculating' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultType, setResultType] = useState<PersonalityType | null>(null);

  const startTest = useCallback(() => {
    setStep('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
  }, []);

  const handleAnswer = useCallback((optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      setStep('calculating');
      setTimeout(() => {
        const result = calculatePersonality(newAnswers);
        setResultType(result);
        setStep('result');
      }, 1500);
    }
  }, [answers, currentQuestion]);

  const resetTest = useCallback(() => {
    setStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResultType(null);
  }, []);

  const getMatchedGames = useCallback((type: PersonalityType): Game[] => {
    const info = personalities[type];
    const matchGenres = locale === 'zh' ? info.matchGenresZh : info.matchGenresEn;
    const matched = games.filter(g => {
      const genre = locale === 'zh' ? g.genre : g.genreEn;
      return matchGenres.some(mg => genre.includes(mg) || mg.includes(genre));
    });
    if (matched.length > 0) return matched.slice(0, 3);
    return games.slice(0, 3);
  }, [games, locale]);

  if (!isOpen) return null;

  const question = quizQuestions[currentQuestion];
  const progress = step === 'quiz' ? ((currentQuestion + 1) / quizQuestions.length) * 100 : 0;

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
            {step === 'intro' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pt-10 pb-8 text-center"
              >
                <div className="text-6xl mb-6">🎮✨</div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {locale === 'zh' ? '游戏人格测试' : 'Game Personality Test'}
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  {locale === 'zh'
                    ? '6道题，测测你是哪种游戏玩家？发现最适合你的游戏类型！'
                    : '6 questions to find out what type of gamer you are! Discover your perfect game match!'}
                </p>
                <button
                  onClick={startTest}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/30"
                >
                  {locale === 'zh' ? '开始测试' : 'Start Test'}
                </button>
                <p className="text-gray-500 text-xs mt-4">
                  {locale === 'zh' ? '约需 1 分钟' : 'Takes about 1 minute'}
                </p>
              </motion.div>
            )}

            {step === 'quiz' && question && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="px-6 pt-8 pb-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    {locale === 'zh' ? `第 ${currentQuestion + 1} 题` : `Question ${currentQuestion + 1}`} / {quizQuestions.length}
                  </span>
                  <span className="text-xs text-purple-400 font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>

                <h3 className="text-lg font-bold text-white mb-6 leading-relaxed">
                  {locale === 'zh' ? question.questionZh : question.questionEn}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-white/90 text-sm flex-1">
                          {locale === 'zh' ? option.textZh : option.textEn}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'calculating' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-16 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-purple-500/30 border-t-purple-500"
                />
                <h3 className="text-xl font-bold text-white mb-2">
                  {locale === 'zh' ? '正在分析你的游戏人格...' : 'Analyzing your gamer personality...'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {locale === 'zh' ? '马上就好！' : 'Almost there!'}
                </p>
              </motion.div>
            )}

            {step === 'result' && resultType && (() => {
              const info = personalities[resultType];
              const matchedGames = getMatchedGames(resultType);
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="px-6 pt-6 pb-8"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                      className="text-7xl mb-4"
                    >
                      {info.emoji}
                    </motion.div>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-3">
                      <span className="text-xs font-medium text-purple-300">
                        {locale === 'zh' ? '你的游戏人格' : 'Your Gamer Personality'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {locale === 'zh' ? info.nameZh : info.nameEn}
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                      {locale === 'zh' ? info.descZh : info.descEn}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      {locale === 'zh' ? '为你推荐的游戏' : 'Games Recommended for You'}
                    </h3>
                    <div className="space-y-3">
                      {matchedGames.map((game) => (
                        <motion.div
                          key={game.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={game.icon}
                              alt={locale === 'zh' ? game.name : game.nameEn}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm truncate">
                              {locale === 'zh' ? game.name : game.nameEn}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Star className="w-3 h-3 fill-primary-400 text-primary-400" />
                              <span className="text-xs text-gray-400">{game.rating}</span>
                              <span className="text-xs text-gray-500">·</span>
                              <span className="text-xs text-gray-400 truncate">
                                {locale === 'zh' ? game.genre : game.genreEn}
                              </span>
                            </div>
                          </div>
                          <a
                            href={game.appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 px-3 py-2 rounded-xl gold-gradient-bg text-dark-900 font-bold text-xs hover:scale-105 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={resetTest}
                      className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {locale === 'zh' ? '重新测试' : 'Retake Test'}
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
