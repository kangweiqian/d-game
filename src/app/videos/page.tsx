'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import VideoFeed from '../../components/VideoFeed';
import { getHotGames } from '../../data/games';

function VideosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialIndex, setInitialIndex] = useState(0);
  const hotGames = getHotGames();

  useEffect(() => {
    const gameId = searchParams.get('gameId');
    if (gameId) {
      const index = hotGames.findIndex(g => g.id === gameId);
      if (index !== -1) {
        setInitialIndex(index);
      }
    }
  }, [searchParams, hotGames]);

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Close button - with safe area for iPhone notch */}
      <button
        onClick={() => router.back()}
        className="absolute right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
        style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Video Feed */}
      <VideoFeed games={hotGames} fullscreen initialIndex={initialIndex} />
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[100] bg-black" />}>
      <VideosContent />
    </Suspense>
  );
}
