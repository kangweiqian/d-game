'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Trophy, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';

const tabs = [
  { key: 'home', href: '/', icon: Gamepad2, label: '找游戏' },
  { key: 'rankings', href: '/rankings', icon: Trophy, label: '排行榜' },
  { key: 'recharge', href: '/recharge', icon: Wallet, label: '充值' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { locale } = useI18n();

  const isActive = (href: string, key: string) => {
    if (key === 'home') return pathname === '/';
    return pathname.startsWith(href);
  };

  const labelMap: Record<string, string> = locale === 'zh'
    ? { home: '找游戏', rankings: '排行榜', recharge: '充值' }
    : { home: 'Discover', rankings: 'Rankings', recharge: 'Recharge' };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card border-t border-white/5">
        <div className="flex items-center justify-around px-2 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href, tab.key);
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
              >
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  className={`flex flex-col items-center gap-0.5 ${
                    active ? 'text-primary-400' : 'text-gray-500'
                  } transition-colors`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{labelMap[tab.key]}</span>
                </motion.div>
                {active && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-0.5 w-6 h-0.5 gold-gradient-bg rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </nav>
  );
}
