'use client';

import { useState } from 'react';
import { Wallet, CreditCard, Gift, Zap, Crown, Gem, Coins, Smartphone, QrCode } from 'lucide-react';
import Navigation from '../../components/Navigation';
import BottomNav from '../../components/BottomNav';
import { useI18n } from '../../context/I18nContext';

const packages = [
  { id: 1, coins: 100, price: '₱ 49', bonus: 0, popular: false, icon: Coins },
  { id: 2, coins: 300, price: '₱ 149', bonus: 30, popular: false, icon: Gem },
  { id: 3, coins: 680, price: '₱ 299', bonus: 100, popular: true, icon: Crown },
  { id: 4, coins: 1280, price: '₱ 599', bonus: 280, popular: false, icon: Zap },
  { id: 5, coins: 3280, price: '₱ 1499', bonus: 800, popular: false, icon: Gift },
  { id: 6, coins: 6480, price: '₱ 2999', bonus: 2000, popular: false, icon: Crown },
];

const paymentMethods = [
  { id: 'gcash', name: 'GCash', icon: '💚', descZh: '菲律宾最流行的电子钱包', descEn: 'Most popular e-wallet in Philippines' },
  { id: 'ovo', name: 'OVO', icon: '💜', descZh: '印尼领先的数字支付', descEn: 'Leading digital payment in Indonesia' },
  { id: 'dana', name: 'DANA', icon: '💙', descZh: '印尼安全便捷支付', descEn: 'Safe & convenient payment in Indonesia' },
  { id: 'grabpay', name: 'GrabPay', icon: '💚', descZh: '东南亚出行支付', descEn: 'Southeast Asia ride-hailing payment' },
  { id: 'bank', nameZh: '银行转账', nameEn: 'Bank Transfer', icon: '🏦', descZh: '支持本地银行转账', descEn: 'Support local bank transfer' },
  { id: 'card', nameZh: '信用卡', nameEn: 'Credit Card', icon: '💳', descZh: 'Visa / MasterCard', descEn: 'Visa / MasterCard' },
];

export default function RechargePage() {
  const { locale } = useI18n();
  const [selectedPackage, setSelectedPackage] = useState(3);
  const [selectedPayment, setSelectedPayment] = useState('gcash');

  return (
    <div className="min-h-screen pb-[calc(env(safe-area-inset-bottom)+5rem)]">
      <div className="md:hidden">
        <div className="sticky top-0 z-40 glass-card border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-4 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
            <h1 className="text-lg font-bold text-white">
              {locale === 'zh' ? '充值中心' : 'Recharge'}
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-700/50 border border-white/10">
              <Coins className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-semibold text-white">1,280</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Navigation />
      </div>

      <main className="pt-4 md:pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {locale === 'zh' ? '充值中心' : 'Recharge Center'}
            </h1>
            <p className="text-gray-400">
              {locale === 'zh' ? '多种本地支付方式，安全快速到账' : 'Multiple local payment methods, safe and fast'}
            </p>
          </div>

          <div
            className="glass-card rounded-3xl p-4 md:p-6 mb-6 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-dark-900" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {locale === 'zh' ? '当前余额' : 'Current Balance'}
                </p>
                <p className="text-2xl font-black text-white">
                  1,280 <span className="text-sm font-normal text-gray-400">{locale === 'zh' ? '金币' : 'coins'}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Gift className="w-4 h-4 text-primary-400" />
              <span>{locale === 'zh' ? '首充双倍，最高赠送 2000 金币' : 'First recharge double, up to 2000 coins bonus'}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary-400" />
              {locale === 'zh' ? '选择充值金额' : 'Select Amount'}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {packages.map((pkg) => {
                const Icon = pkg.icon;
                const isSelected = selectedPackage === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-white/10 glass-card hover:border-white/20'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold text-dark-900 gold-gradient-bg">
                        {locale === 'zh' ? '热卖' : 'HOT'}
                      </div>
                    )}
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                      isSelected ? 'gold-gradient-bg' : 'bg-dark-600'
                    }`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-dark-900' : 'text-gray-400'}`} />
                    </div>
                    <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {pkg.coins}
                    </div>
                    <div className="text-[10px] text-gray-500 mb-1">
                      {locale === 'zh' ? '金币' : 'coins'}
                    </div>
                    <div className={`text-sm font-bold ${isSelected ? 'text-primary-400' : 'text-gray-400'}`}>
                      {pkg.price}
                    </div>
                    {pkg.bonus > 0 && (
                      <div className="text-[10px] text-green-400 mt-1">
                        +{pkg.bonus} {locale === 'zh' ? '赠送' : 'bonus'}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary-400" />
              {locale === 'zh' ? '选择支付方式' : 'Payment Method'}
            </h2>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : 'border-white/10 glass-card hover:border-white/20'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center text-xl">
                      {method.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {method.name ?? (locale === 'zh' ? method.nameZh : method.nameEn)}
                      </div>
                      <div className="text-xs text-gray-500">{locale === 'zh' ? method.descZh : method.descEn}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary-400' : 'border-gray-600'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full gold-gradient-bg" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{locale === 'zh' ? '充值金额' : 'Amount'}</span>
              <span className="text-white font-bold">{packages.find(p => p.id === selectedPackage)?.price}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{locale === 'zh' ? '到账金币' : 'Coins'}</span>
              <span className="text-primary-400 font-bold">
                {packages.find(p => p.id === selectedPackage)?.coins}
                {(packages.find(p => p.id === selectedPackage)?.bonus ?? 0) > 0 && (
                  <span className="text-green-400 text-xs ml-1">
                    +{packages.find(p => p.id === selectedPackage)?.bonus}
                  </span>
                )}
              </span>
            </div>
            <div className="border-t border-white/5 pt-3 flex items-center justify-between">
              <span className="text-white font-bold">{locale === 'zh' ? '实付金额' : 'Total'}</span>
              <span className="text-xl font-black gold-gradient-text">
                {packages.find(p => p.id === selectedPackage)?.price}
              </span>
            </div>
          </div>

          <button
            className="w-full py-4 rounded-2xl gold-gradient-bg text-dark-900 font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            {locale === 'zh' ? '立即充值' : 'Recharge Now'}
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <QrCode className="w-4 h-4" />
              <span>{locale === 'zh' ? '扫码支付' : 'QR Pay'}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              <span>{locale === 'zh' ? '安全加密' : 'Secure'}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{locale === 'zh' ? '即时到账' : 'Instant'}</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
