import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Coins,
  Bell,
  Shield,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  Home,
  Radio,
  Film,
  Video,
  Mic,
  Users,
  Compass,
  Settings,
  ShieldAlert,
  DollarSign,
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenCoinModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCoinModal }) => {
  const {
    currentUser,
    switchUserRole,
    unreadNotificationCount,
    setActiveTab,
    activeTab,
    streams,
  } = usePlatform();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const liveStreamsCount = streams.filter((s) => s.isLive).length;
  const isModOrAdmin = ['SuperAdmin', 'Administrator', 'Moderator'].includes(currentUser.role);

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'SuperAdmin', label: 'Super Administrator' },
    { role: 'Administrator', label: 'Administrator' },
    { role: 'ContentCreator', label: 'Content Creator' },
    { role: 'Broadcaster', label: 'Broadcaster' },
    { role: 'Moderator', label: 'Moderator' },
    { role: 'RegularUser', label: 'Regular User' },
  ];

  const fullNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'live', label: 'Live Now', icon: Radio, count: liveStreamsCount },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'vod', label: 'Video Library', icon: Film },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'studio', label: 'My Studio', icon: Mic },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMobileNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        {/* Zone 1: Mobile Hamburger + Single Brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5 min-h-[44px]"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-900/20 shrink-0">
              <span className="font-extrabold text-white text-base tracking-tighter">Ω</span>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors whitespace-nowrap">
              OmniStream
            </span>
          </button>
        </div>

        {/* Zone 2: Desktop clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'home' ? 'text-white font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'live' ? 'text-white font-semibold' : ''
            }`}
          >
            Live Now
          </button>
          <button
            onClick={() => setActiveTab('vod')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'vod' ? 'text-white font-semibold' : ''
            }`}
          >
            Video Library
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'meetings' ? 'text-white font-semibold' : ''
            }`}
          >
            Meetings
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeTab === 'studio' ? 'text-white font-semibold' : ''
            }`}
          >
            My Studio
          </button>
        </nav>

        {/* Zone 3: 1 primary action + compact coins/user drawer */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Virtual Coins balance indicator & top up button */}
          <button
            onClick={onOpenCoinModal}
            title="Manage Virtual Coins and Creator Monetization"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold tabular-nums transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{currentUser.coinsBalance.toLocaleString()}</span>
          </button>

          {/* Notifications button */}
          <button
            onClick={() => setActiveTab('notifications')}
            title="View Notifications"
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
            )}
          </button>

          {/* Primary Action Button (hidden on very small mobile to save space, available in drawer/bottom nav) */}
          <button
            onClick={() => setActiveTab('studio')}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-500 transition-colors shadow-sm shadow-rose-600/30 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] items-center"
          >
            Go Live
          </button>

          {/* User profile & Role switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer focus:outline-none min-h-[40px]"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-slate-700"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="hidden xl:inline text-xs font-medium text-slate-300 max-w-[90px] truncate">
                {currentUser.displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-slate-200"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
                    <Shield className="w-3 h-3" />
                    <span>Role: {currentUser.role}</span>
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Switch Active Role
                  </div>
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchUserRole(item.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                        currentUser.role === item.role ? 'text-rose-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span>{item.label}</span>
                      {currentUser.role === item.role && <span className="text-[10px]">Active</span>}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                  {isModOrAdmin && (
                    <button
                      onClick={() => {
                        setActiveTab('moderation');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs text-amber-400 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Moderation Dashboard</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-800 px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto animate-slide-down">
          {/* Mobile User Summary */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-rose-500"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
                <p className="text-[10px] text-rose-400 font-mono truncate">{currentUser.role}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenCoinModal();
                setMobileMenuOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold tabular-nums cursor-pointer"
            >
              {currentUser.coinsBalance} Coins
            </button>
          </div>

          {/* Full Navigation Grid */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Platform Navigation
            </div>
            {fullNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-400 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 tabular-nums">
                      {item.count} live
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

          {/* Admin & Operations */}
          <div className="pt-2 border-t border-slate-800 space-y-1">
            {isModOrAdmin && (
              <button
                onClick={() => handleMobileNavClick('moderation')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-400 hover:bg-slate-900 min-h-[44px]"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Moderation Dashboard</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenCoinModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-slate-900 min-h-[44px]"
            >
              <DollarSign className="w-4 h-4 shrink-0" />
              <span>Monetization & Virtual Store</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
