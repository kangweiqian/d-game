'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gold-gradient-bg flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-dark-900" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          网络连接不可用
        </h1>
        <p className="text-gray-400 mb-8">
          请检查您的网络连接，然后刷新页面重试。已缓存的游戏内容仍可浏览。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl gold-gradient-bg text-dark-900 font-medium hover:opacity-90 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            重新连接
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
