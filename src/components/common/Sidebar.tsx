import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Home,
  Compass,
  Radio,
  Users,
  Film,
  Video,
  Mic,
  Bell,
  User,
  Settings,
  ShieldAlert,
  DollarSign,
} from 'lucide-react';

interface SidebarProps {
  onOpenCoinModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCoinModal }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    streams,
    currentUser,
  } = usePlatform();

  const liveStreamsCount = streams.filter((s) => s.isLive).length;
  const isModOrAdmin = ['SuperAdmin', 'Administrator', 'Moderator'].includes(currentUser.role);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'live', label: 'Live Now', icon: Radio, count: liveStreamsCount },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'vod', label: 'Video Library', icon: Film },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'studio', label: 'My Studio', icon: Mic },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/70 p-4 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
            Platform Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-rose-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 tabular-nums">
                    {item.count}
                  </span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Administration & Operations */}
        <div className="space-y-1 pt-3 border-t border-slate-800/60">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
            Operations & Control
          </div>
          {isModOrAdmin && (
            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group ${
                activeTab === 'moderation'
                  ? 'bg-amber-500/10 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="whitespace-nowrap">Moderation Suite</span>
            </button>
          )}

          <button
            onClick={onOpenCoinModal}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors cursor-pointer group"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="whitespace-nowrap">Monetization & Coins</span>
          </button>
        </div>
      </div>

      {/* User Mini Bar */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.role}</p>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Balance:</span>
          <span className="font-semibold text-amber-400 tabular-nums">
            {currentUser.coinsBalance} Coins
          </span>
        </div>
      </div>
    </aside>
  );
};
