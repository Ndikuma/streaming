import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { NotificationSkeleton } from '../common/Skeletons';
import { Bell, Radio, Gift, Video, Users, CheckCheck, Trash2, ArrowRight } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    setActiveStream,
    streams,
    meetings,
    setActiveMeeting,
  } = usePlatform();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  const handleAction = (item: typeof notifications[0]) => {
    markNotificationAsRead(item.id);
    if (item.type === 'live' && item.actionUrl) {
      const targetStream = streams.find((s) => s.id === item.actionUrl);
      if (targetStream) {
        setActiveStream(targetStream);
      } else {
        setActiveTab('live');
      }
    } else if (item.type === 'meeting' && item.actionUrl) {
      const targetMeeting = meetings.find((m) => m.id === item.actionUrl);
      if (targetMeeting) {
        setActiveMeeting(targetMeeting);
      } else {
        setActiveTab('meetings');
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'live':
        return <Radio className="w-4 h-4 text-rose-500" />;
      case 'gift':
        return <Gift className="w-4 h-4 text-amber-400" />;
      case 'meeting':
        return <Video className="w-4 h-4 text-indigo-400" />;
      case 'follower':
        return <Users className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto px-4 md:px-8 pt-4">
        {/* Header Shimmer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 bg-slate-800 rounded w-48" />
            <div className="h-3 bg-slate-800/60 rounded w-80" />
          </div>
          <div className="w-32 h-8 rounded-lg bg-slate-800" />
        </div>

        {/* Filter Pills Shimmer */}
        <div className="flex gap-2 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-20 h-8 rounded-lg bg-slate-900 border border-slate-800" />
          ))}
        </div>

        {/* Notifications List Skeleton */}
        <div className="space-y-3">
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto px-4 md:px-8 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500" />
            <h1 className="text-xl font-bold text-white tracking-tight">Notification Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time activity alerts, broadcast pings, virtual gifts, and conference invites
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto w-fit">
        {['all', 'live', 'gift', 'meeting', 'follower'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
              filterType === t ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'all' ? 'All Alerts' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleAction(notif)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70'
                  : 'bg-slate-900 border-rose-500/30 hover:border-rose-500/60 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">{notif.title}</h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-500 block">{notif.timestamp}</span>
                </div>
              </div>

              {notif.actionUrl && (
                <div className="flex items-center gap-1 text-xs text-rose-400 font-semibold shrink-0 pt-1">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
