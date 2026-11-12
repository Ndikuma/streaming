import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { ProfileSkeleton } from '../common/Skeletons';
import {
  User as UserIcon,
  Shield,
  Key,
  CheckCircle,
  Coins,
  DollarSign,
  Video,
  Radio,
  Edit3,
  Calendar,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

export const ProfileView: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const { currentUser, switchUserRole, videos, streams, setActiveVideo, setActiveStream } = usePlatform();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser.bio);

  const myVideos = videos.filter((v) => v.creatorId === currentUser.id);
  const myStreams = streams.filter((s) => s.creatorId === currentUser.id);

  const allAvailableRoles: { role: UserRole; desc: string }[] = [
    { role: 'SuperAdmin', desc: 'Full administrative control across media nodes, billing, and users' },
    { role: 'Administrator', desc: 'Platform operations, system settings, and user oversight' },
    { role: 'ContentCreator', desc: 'Full broadcast rights, VOD uploads, and monetization' },
    { role: 'Broadcaster', desc: 'Live studio streaming and conference hosting' },
    { role: 'Moderator', desc: 'Chat moderation, user suspension, and report resolution' },
    { role: 'RegularUser', desc: 'Watch streams, participate in conferences, and send gifts' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 max-w-5xl mx-auto px-4 md:px-8 pt-4">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto px-4 md:px-8 pt-4">
      {/* Profile Card */}
      <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-rose-500/30 shadow-2xl"
              />
              {currentUser.isVerified && (
                <div
                  title="Verified Broadcaster"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center ring-4 ring-slate-900 shadow-md"
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{currentUser.displayName}</h1>
                <span className="text-xs text-slate-400">@{currentUser.username}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                  {currentUser.role}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined Jan 2026
                </span>
              </div>

              {/* Followers / Following Stats */}
              <div className="flex items-center gap-4 text-xs pt-1">
                <span className="text-slate-300">
                  <strong className="text-white font-bold tabular-nums">
                    {currentUser.followersCount.toLocaleString()}
                  </strong>{' '}
                  Followers
                </span>
                <span className="text-slate-300">
                  <strong className="text-white font-bold tabular-nums">
                    {currentUser.followingCount}
                  </strong>{' '}
                  Following
                </span>
              </div>
            </div>
          </div>

          {/* Quick Balance Cards */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Virtual Coins
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-amber-400 font-extrabold text-base tabular-nums">
                <Coins className="w-4 h-4" />
                <span>{currentUser.coinsBalance.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex-1 md:flex-none p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Creator Net Earnings
              </p>
              <div className="flex items-center justify-center gap-1 mt-1 text-emerald-400 font-extrabold text-base tabular-nums">
                <DollarSign className="w-4 h-4" />
                <span>${currentUser.earningsBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About & Bio</h3>
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingBio ? 'Save' : 'Edit Bio'}</span>
            </button>
          </div>

          {isEditingBio ? (
            <textarea
              rows={3}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{bioText}</p>
          )}
        </div>
      </div>

      {/* Role & Permissions Inspector (Module A requirement: allow users to have multiple permissions without relying exclusively on fixed roles) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Assigned Security Capabilities & Permissions
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {currentUser.permissions.length} Active Grants
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {currentUser.permissions.map((perm) => (
            <div
              key={perm}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs font-mono text-emerald-400"
            >
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{perm}</span>
            </div>
          ))}
        </div>

        {/* Role Switcher Matrix for Demonstration */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            RBAC Role Switcher
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allAvailableRoles.map((item) => (
              <button
                key={item.role}
                onClick={() => switchUserRole(item.role)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  currentUser.role === item.role
                    ? 'bg-rose-500/10 border-rose-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.role}</span>
                  {currentUser.role === item.role && (
                    <span className="text-[10px] text-rose-400 font-bold uppercase">Active</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Creator's Published Content */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Creator Published Media ({myVideos.length + myStreams.length})
        </h2>

        {myVideos.length + myStreams.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
            No videos uploaded yet. Use the Video Library to upload or Studio to broadcast!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myStreams.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveStream(s)}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 p-3 space-y-2"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold">
                    BROADCAST
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{s.title}</h4>
                <p className="text-[10px] text-slate-400">{s.category}</p>
              </div>
            ))}

            {myVideos.map((v) => (
              <div
                key={v.id}
                onClick={() => setActiveVideo(v)}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 p-3 space-y-2"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold">
                    VOD MASTER
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{v.title}</h4>
                <p className="text-[10px] text-slate-400">{v.category} · {v.genre}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
