'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface DanmakuItem {
  id: number;
  text: string;
  user: string;
  avatar: string;
  color: string;
  top: number;
  duration: number;
}

interface DanmakuProps {
  comments: { user: string; userEn?: string; avatar: string; content: string; contentEn?: string; likes: number }[];
  isPlaying?: boolean;
  locale?: 'zh' | 'en';
}

const colors = [
  '#ffffff',
  '#fcd34d',
  '#f472b6',
  '#60a5fa',
  '#34d399',
  '#fb923c',
  '#a78bfa',
  '#fbbf24',
];

export default function Danmaku({ comments, isPlaying = true, locale = 'zh' }: DanmakuProps) {
  const [danmakuList, setDanmakuList] = useState<DanmakuItem[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);
  const isPlayingRef = useRef(isPlaying);
  const commentsRef = useRef(comments);
  const localeRef = useRef(locale);

  isPlayingRef.current = isPlaying;
  commentsRef.current = comments;
  localeRef.current = locale;

  const addDanmaku = useCallback(() => {
    if (!isPlayingRef.current || commentsRef.current.length === 0) return;

    const comment = commentsRef.current[Math.floor(Math.random() * commentsRef.current.length)];
    const newItem: DanmakuItem = {
      id: idRef.current++,
      text: localeRef.current === 'zh' ? comment.content : (comment.contentEn || comment.content),
      user: localeRef.current === 'zh' ? comment.user : (comment.userEn || comment.user),
      avatar: comment.avatar,
      color: colors[Math.floor(Math.random() * colors.length)],
      top: 8 + Math.random() * 45,
      duration: 10 + Math.random() * 6,
    };

    setDanmakuList((prev) => [...prev.slice(-20), newItem]);

    // 自动移除已飘过屏幕的弹幕
    setTimeout(() => {
      setDanmakuList((prev) => prev.filter((d) => d.id !== newItem.id));
    }, newItem.duration * 1000 + 500);

    timeoutRef.current = setTimeout(addDanmaku, 700 + Math.random() * 1000);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      addDanmaku();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setDanmakuList([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, addDanmaku, locale]);

  if (!isPlaying && danmakuList.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 right-0 h-[60%] overflow-hidden pointer-events-none z-10">
      {danmakuList.map((item) => (
        <div
          key={item.id}
          className="absolute left-full whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 animate-danmaku"
          style={{
            top: `${item.top}%`,
            animationDuration: `${item.duration}s`,
            color: item.color,
            textShadow: '0 1px 3px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.6)',
          }}
        >
          <span className="text-xs">{item.avatar}</span>
          <span className="text-xs font-semibold">{item.user}:</span>
          <span className="text-xs">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
