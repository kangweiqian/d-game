'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Sparkles, X, MessageCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { ChatMessage, Game } from '../lib/types';
import { callQwenAPI } from '../lib/qwen';
import { getHotGames } from '../data/games';

interface AIRecommendProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'modal' | 'embedded';
  autoInit?: boolean;
}

// 语音识别类型定义
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function AIRecommend({ isOpen, onClose, mode = 'modal', autoInit = false }: AIRecommendProps) {
  const { t, locale } = useI18n();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ((isOpen || autoInit) && messages.length === 0) {
      setMessages([]);
    }
  }, [isOpen, autoInit, messages.length]);

  // 关闭时清空聊天记录，恢复初始状态
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setMessages([]);
      setIsLoading(false);
      setIsRecording(false);
      setRecordingText('');
    }
  }, [isOpen]);

  // 初始化语音识别
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = locale === 'zh' ? 'zh-CN' : 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setInputValue(prev => prev + finalTranscript);
        setRecordingText('');
      } else {
        setRecordingText(interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setRecordingText('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setRecordingText('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [locale]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not supported');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      setRecordingText('');
    } catch (error) {
      console.error('Failed to start recognition:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
    }
    setIsRecording(false);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await callQwenAPI(inputValue, messages, locale);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.reply,
        recommendedGames: result.recommendedGames,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: locale === 'zh' ? '抱歉，出了点小问题，请稍后再试~' : 'Sorry, something went wrong. Please try again~',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAsk = (question: string) => {
    setInputValue(question);
  };

  const content = (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center glow-gold">
            <Sparkles className="w-5 h-5 text-dark-900" />
          </div>
          <div>
            <h3 className="font-bold text-white">{t.ai.title}</h3>
            <p className="text-xs text-gray-400">{t.ai.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {messages.length <= 1 && messages[0]?.role !== 'user' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-2"
          >
            {(() => {
              const hotGames = getHotGames();
              const featuredGame = hotGames[0];
              if (!featuredGame) return null;
              return (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="inline-block rounded-2xl p-4 bg-gradient-to-br from-purple-500/20 via-dark-700/50 to-dark-800/80 border border-purple-500/20 w-full"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={featuredGame.icon || featuredGame.cover}
                      alt={locale === 'zh' ? featuredGame.name : featuredGame.nameEn}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg truncate">
                        {locale === 'zh' ? featuredGame.name : featuredGame.nameEn}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-dark-600/70 text-gray-300 border border-white/10">
                          {locale === 'zh' ? featuredGame.genre : featuredGame.genreEn}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-primary-400">
                          <Star className="w-3 h-3 fill-primary-400" />
                          {featuredGame.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                        {locale === 'zh' ? featuredGame.downloads : featuredGame.downloadsEn} 下载
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold shrink-0 hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-green-500/25">
                      {locale === 'zh' ? '预约' : 'Pre-register'}
                    </button>
                  </div>
                </motion.div>
              );
            })()}

            <div className="space-y-2">
              <p className="text-xs text-gray-400 px-1">
                {locale === 'zh' ? '试试问我：' : 'Try asking:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(t.ai.examples as string[]).slice(0, 3).map((example, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleQuickAsk(example)}
                    className="w-fit text-left px-4 py-3 rounded-xl bg-dark-600/50 text-gray-300 hover:bg-dark-500 hover:text-white transition-colors border border-white/5 text-sm flex items-center gap-2 group"
                  >
                    <span>{example}</span>
                    <span className="text-gray-500 group-hover:text-primary-400 transition-colors">→</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'gold-gradient-bg text-dark-900 rounded-br-md'
                    : 'bg-dark-600/80 text-white rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
              
              {msg.recommendedGames && msg.recommendedGames.length > 0 && (
                <div className="space-y-2 w-full">
                  <p className="text-xs text-gray-400 px-1">{t.ai.recommend}</p>
                  <div className="flex flex-col gap-2">
                    {msg.recommendedGames.map((game: Game, gameIdx: number) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gameIdx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/80 hover:bg-dark-600/80 transition-colors cursor-pointer border border-white/5"
                        onClick={onClose}
                      >
                        <img
                          src={game.icon || game.cover}
                          alt={locale === 'zh' ? game.name : game.nameEn}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {locale === 'zh' ? game.name : game.nameEn}
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                              {locale === 'zh' ? game.genre : game.genreEn}
                            </span>
                            {(locale === 'zh' ? game.tags : game.tagsEn).slice(0, 1).map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-0.5 text-xs text-primary-400">
                              <Star className="w-3 h-3 fill-primary-400" />
                              {game.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              {locale === 'zh' ? `${game.downloads} 下载` : `${game.downloadsEn} downloads`}
                            </span>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg gold-gradient-bg text-dark-900 text-xs font-bold shrink-0 hover:scale-105 active:scale-95 transition-transform">
                          {locale === 'zh' ? '玩一玩' : 'Play'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="px-4 py-3 rounded-2xl bg-dark-600/80 rounded-bl-md">
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-primary-400"
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary-400"
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-primary-400"
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-3 rounded-full transition-all flex-shrink-0 ${
              isRecording
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500'
            }`}
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={recordingText || inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? (locale === 'zh' ? '正在聆听...' : 'Listening...') : t.ai.placeholder}
              className="w-full px-4 py-3 pr-12 bg-dark-600/50 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={(!inputValue.trim() && !recordingText) || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl gold-gradient-bg text-dark-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-red-400 mt-2 flex items-center justify-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {t.ai.voice_input}
          </motion.div>
        )}
      </div>
    </>
  );

  if (mode === 'embedded') {
    return (
      <div className="w-full flex-1 flex flex-col overflow-hidden">
        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col justify-end">
          <div className="space-y-4">
            {messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* 标题 */}
                <div>
                  <h3 className="font-bold text-xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {locale === 'zh' ? '🎮 找游戏小助手' : '🎮 Game Finder'}
                  </h3>
                </div>

                {/* 推荐游戏卡片 */}
                {(() => {
                  const hotGames = getHotGames();
                  const featuredGame = hotGames[0];
                  if (!featuredGame) return null;
                  return (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="inline-block rounded-2xl p-4 bg-gradient-to-br from-purple-500/20 via-dark-700/50 to-dark-800/80 border border-purple-500/20"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={featuredGame.icon || featuredGame.cover}
                          alt={locale === 'zh' ? featuredGame.name : featuredGame.nameEn}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">
                            {locale === 'zh' ? featuredGame.name : featuredGame.nameEn}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-dark-600/70 text-gray-300 border border-white/10">
                              {locale === 'zh' ? featuredGame.genre : featuredGame.genreEn}
                            </span>
                            <span className="flex items-center gap-0.5 text-xs text-primary-400">
                              <Star className="w-3 h-3 fill-primary-400" />
                              {featuredGame.rating}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                            {locale === 'zh' ? featuredGame.downloads : featuredGame.downloadsEn} 下载
                          </p>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold shrink-0 hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-green-500/25">
                          {locale === 'zh' ? '预约' : 'Pre-register'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* 示例问题 - 竖着排 */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 px-1">
                    {locale === 'zh' ? '试试问我：' : 'Try asking:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(t.ai.examples as string[]).slice(0, 3).map((example, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleQuickAsk(example)}
                        className="w-fit text-left px-4 py-3 rounded-xl bg-dark-600/50 text-gray-300 hover:bg-dark-500 hover:text-white transition-colors border border-white/5 text-sm flex items-center gap-2 group"
                      >
                        <span>{example}</span>
                        <span className="text-gray-500 group-hover:text-primary-400 transition-colors">→</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {messages.map((msg, idx) => {
            if (idx === 0 && messages.length <= 1) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'gold-gradient-bg text-dark-900 rounded-br-md'
                        : 'bg-dark-600/80 text-white rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.recommendedGames && msg.recommendedGames.length > 0 && (
                    <div className="space-y-2 w-full">
                      <p className="text-xs text-gray-400 px-1">{t.ai.recommend}</p>
                      <div className="flex flex-col gap-2">
                        {msg.recommendedGames.map((game: Game) => (
                          <motion.a
                            key={game.id}
                            href={`/game/${game.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-2 rounded-xl glass-card hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={onClose}
                          >
                            <img
                              src={game.cover}
                              alt={locale === 'zh' ? game.name : game.nameEn}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white text-sm truncate">
                                {locale === 'zh' ? game.name : game.nameEn}
                              </h4>
                              <p className="text-xs text-gray-400 truncate">
                                {locale === 'zh' ? game.genre : game.genreEn}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-0.5 text-xs text-primary-400">
                                  <Star className="w-3 h-3 fill-primary-400" />
                                  {game.rating}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {locale === 'zh' ? game.downloads : game.downloadsEn}
                                </span>
                              </div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg gold-gradient-bg text-dark-900 text-xs font-semibold shrink-0">
                              {locale === 'zh' ? '玩一玩' : 'Play'}
                            </button>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="px-4 py-3 rounded-2xl bg-dark-600/80 rounded-bl-md">
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-primary-400"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-primary-400"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-primary-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 固定在底部的输入框 */}
        <div className="p-4 shrink-0">
          {/* 录音状态指示器 */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-primary-500/20 border border-primary-500/30"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
                <span className="text-sm text-primary-400 font-medium">{locale === 'zh' ? '正在聆听...' : 'Listening...'}</span>
              </div>
              {/* 声波动画 */}
              <div className="flex items-center justify-center gap-1 h-8">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [8, 24, 16, 32, 12, 28, 8],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      delay: i * 0.08,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 rounded-full gold-gradient-bg"
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-2">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-3 rounded-full transition-all flex-shrink-0 ${
                isRecording
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500'
              }`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={recordingText || inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isRecording ? (locale === 'zh' ? '正在聆听...' : 'Listening...') : t.ai.placeholder}
                className="w-full px-4 py-3 pr-12 bg-dark-600/50 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={(!inputValue.trim() && !recordingText) || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl gold-gradient-bg text-dark-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 md:right-6 md:bottom-6 md:left-auto md:w-[420px] md:h-[600px] z-50 glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AIFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed right-6 bottom-20 md:bottom-6 z-40 w-14 h-14 rounded-full gold-gradient-bg flex items-center justify-center shadow-2xl glow-gold cursor-pointer"
    >
      <MessageCircle className="w-6 h-6 text-dark-900" />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 rounded-full gold-gradient-bg opacity-30 -z-10"
      />
    </motion.button>
  );
}
