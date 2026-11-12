import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Coins,
  DollarSign,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserCoins, creatorEarnings } = usePlatform();
  const [activeTab, setActiveTab] = useState<'buy_coins' | 'earnings' | 'subscriptions'>('buy_coins');
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const coinPackages = [
    { coins: 500, price: '$4.99', popular: false },
    { coins: 1200, price: '$9.99', bonus: '+200 Free', popular: true },
    { coins: 2600, price: '$19.99', bonus: '+600 Free', popular: false },
    { coins: 7000, price: '$49.99', bonus: '+2,000 Free', popular: false },
    { coins: 15000, price: '$99.99', bonus: '+5,000 Free', popular: false },
  ];

  const handleBuy = (coins: number, price: string) => {
    updateUserCoins(coins);
    setPurchaseSuccess(`Successfully added ${coins.toLocaleString()} Coins to your wallet!`);
    setTimeout(() => setPurchaseSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Monetization & Virtual Coins</h2>
              <p className="text-xs text-slate-400">
                Support creators with animated gifts, unlock subscriptions, and manage broadcast revenue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex items-center px-6 pt-3 gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('buy_coins')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'buy_coins'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Buy Virtual Coins
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'earnings'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Creator Revenue Dashboard
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'subscriptions'
                ? 'border-rose-400 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Channel Subscriptions
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {purchaseSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{purchaseSuccess}</span>
            </div>
          )}

          {activeTab === 'buy_coins' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Current Coin Balance
                  </span>
                  <p className="text-xl font-extrabold text-amber-400 tabular-nums">
                    {currentUser.coinsBalance.toLocaleString()} Coins
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Wallet State
                  </span>
                  <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> E2EE Verified
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coinPackages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      pkg.popular
                        ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white tabular-nums">
                          {pkg.coins.toLocaleString()}
                        </span>
                        <Coins className="w-4 h-4 text-amber-400" />
                      </div>
                      {pkg.bonus && (
                        <span className="text-[10px] text-amber-300 font-bold">{pkg.bonus}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleBuy(pkg.coins, pkg.price)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      {pkg.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Gross</span>
                  <p className="text-base font-bold text-white tabular-nums mt-1">$1,605.62</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Platform (20%)</span>
                  <p className="text-base font-bold text-rose-400 tabular-nums mt-1">$321.12</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Net Payout</span>
                  <p className="text-base font-bold text-emerald-400 tabular-nums mt-1">
                    ${currentUser.earningsBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Recent Gift & Subscription Ledger
                </h3>
                <div className="space-y-2">
                  {creatorEarnings.map((record) => (
                    <div
                      key={record.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="font-semibold text-slate-200">
                            From {record.senderName} ({record.source.replace('_', ' ')})
                          </p>
                          <span className="text-[10px] text-slate-500">{record.timestamp}</span>
                        </div>
                      </div>
                      <div className="text-right tabular-nums">
                        <span className="font-bold text-emerald-400">+${record.netEarning.toFixed(2)}</span>
                        <p className="text-[10px] text-slate-500">
                          Comm: ${record.platformCommission.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Offer tiered memberships to your broadcast channel with customized subscriber badges, exclusive live streams, and members-only chat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Bronze Supporter', price: '$4.99/mo', perks: ['Custom Chat Badge', 'Subscriber Live Access'] },
                  { name: 'Silver Producer', price: '$9.99/mo', perks: ['All Bronze Perks', 'Behind-the-Scenes VOD', 'No Chat Delay'] },
                  { name: 'VIP Gold Patron', price: '$24.99/mo', perks: ['All Silver Perks', 'VIP Conference Invites', 'Direct Direct Messaging'] },
                ].map((tier, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white">{tier.name}</h4>
                    <p className="text-base font-extrabold text-rose-400 tabular-nums">{tier.price}</p>
                    <ul className="text-[11px] text-slate-400 space-y-1">
                      {tier.perks.map((p, pidx) => (
                        <li key={pidx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
