'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback } from 'react';
import { Star, Download, Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Game } from '../lib/types';
import { useI18n } from '../context/I18nContext';

interface VideoCardProps {
  game: Game;
  size?: 'small' | 'medium' | 'large';
}

export default function VideoCard({ game, size = 'medium' }: VideoCardProps) {
  const { locale } = useI18n();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const name = locale === 'zh' ? game.name : game.nameEn;
  const genre = locale === 'zh' ? game.genre : game.genreEn;
  const downloads = locale === 'zh' ? game.downloads : game.downloadsEn;

  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[3/4]',
    large: 'aspect-[16/9]',
  };

  const handleMouseEnter = useCallback(() => {
    if (videoRef.current && game.video) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [game.video]);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setShowControls(false);
    }
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
      setShowControls(true);
    } else {
      if (showControls) {
        video.pause();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        showControlsTemporarily();
      }
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/videos?gameId=${game.id}`);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video && video.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * video.duration;
      video.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/game/${game.id}`} className="block group">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative rounded-2xl overflow-hidden glass-card card-hover"
      >
        <div
          className={`relative ${sizeClasses[size]} overflow-hidden bg-black cursor-pointer`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleVideoClick}
        >
          {/* Video Element */}
          {game.video ? (
            <video
              ref={videoRef}
              src={game.video}
              poster={game.cover}
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <img
              src={game.cover}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />

          {/* Play Button - Show when not playing */}
          {!isPlaying && game.video && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-2xl">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </motion.div>
          )}

          {/* Controls Overlay - Show when playing */}
          {game.video && showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Controls */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                {/* Progress Bar */}
                <div
                  className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3 group"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full gold-gradient-bg rounded-full relative"
                    style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </div>
                </div>

                {/* Time and Play Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-primary-400 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <span className="text-white/80 text-xs">
                      {formatTime(progress)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button
                    onClick={handleFullscreen}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/80 backdrop-blur-sm text-white text-xs font-medium hover:bg-primary-500 transition-colors"
                  >
                    <Maximize2 className="w-3 h-3" />
                    {locale === 'zh' ? '全屏播放' : 'Fullscreen'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Game Info */}
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

          {/* Video Indicator */}
          {game.video && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-medium">
                {locale === 'zh' ? '视频' : 'Video'}
              </span>
            </div>
          )}
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
