import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Home, Radio, Film, Video, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, streams } = usePlatform();
  const liveCount = streams.filter((s) => s.isLive).length;

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Live', icon: Radio, count: liveCount },
    { id: 'vod', label: 'Library', icon: Film },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around h-14"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] min-w-[44px] transition-colors cursor-pointer relative ${
              isActive ? 'text-rose-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
