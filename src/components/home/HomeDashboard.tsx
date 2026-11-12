import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import {
  CardSkeleton,
  HeroBillboardSkeleton,
  MeetingCardSkeleton,
} from '../common/Skeletons';
import {
  Radio,
  Eye,
  Play,
  Video,
  Film,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Heart,
  Users,
} from 'lucide-react';
import { Stream, VideoItem } from '../../types';

export const HomeDashboard: React.FC = () => {
  const {
    streams,
    setActiveStream,
    videos,
    setActiveVideo,
    meetings,
    setActiveMeeting,
    setActiveTab,
    followedCreators,
  } = usePlatform();

  const { isLoading } = useViewLoading(400);

  const activeLiveStreams = streams.filter((s) => s.isLive);
  const heroLive = activeLiveStreams[0] || streams[0];
  const activeMeetings = meetings.filter((m) => m.isActive);

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
        {/* Billboard Shimmer */}
        <HeroBillboardSkeleton />

        {/* Live Broadcasts Shimmer */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-800 animate-pulse" />
            <div className="h-5 bg-slate-800 rounded w-48 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>

        {/* Meetings Shimmer */}
        <div className="space-y-4">
          <div className="h-5 bg-slate-800 rounded w-40 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MeetingCardSkeleton />
            <MeetingCardSkeleton />
          </div>
        </div>

        {/* VOD Catalog Shimmer */}
        <div className="space-y-4">
          <div className="h-5 bg-slate-800 rounded w-44 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
      {/* Hero Hybrid Showcase Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/40 p-6 md:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Next-Gen Hybrid Video Platform</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              One Unified Stage for Live, Conferences, and On-Demand.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Experience the broadcast power of YouTube, the interactive gifting of TikTok, the collaboration of Zoom, and the cinematic catalog of Netflix — all unified into one seamless ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveStream(heroLive)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Watch Top Live Broadcast</span>
              </button>

              <button
                onClick={() => setActiveTab('studio')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                Launch Studio
              </button>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="lg:col-span-5">
            <div
              onClick={() => setActiveStream(heroLive)}
              className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group cursor-pointer"
            >
              <img
                src={heroLive.thumbnailUrl}
                alt={heroLive.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold tracking-wider flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] font-mono text-white tabular-nums">
                  {heroLive.viewerCount.toLocaleString()} viewers
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-xs font-bold text-white line-clamp-1">{heroLive.title}</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">{heroLive.creatorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Live Now Broadcasts (YouTube Live & TikTok Interactive style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Live Broadcasts Happening Now
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('live')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <span>See All Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {streams.slice(0, 3).map((stream) => (
            <div
              key={stream.id}
              onClick={() => setActiveStream(stream)}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 overflow-hidden cursor-pointer transition-all hover:shadow-2xl flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {stream.isLive ? (
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" /> LIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      OFFLINE
                    </span>
                  )}
                  {stream.isLive && (
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-slate-200 tabular-nums">
                      {stream.viewerCount.toLocaleString()} viewers
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-slate-300">
                  {stream.resolution}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <img
                    src={stream.creatorAvatar}
                    alt={stream.creatorName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                  />
                  <div className="overflow-hidden">
                    <h3 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                      {stream.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{stream.creatorName}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{stream.category}</span>
                  <span className="text-rose-400 font-semibold text-[10px]">Tap to Watch & Gift</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Video Conferences (Zoom style) & Quick Collaboration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Active Video Conferences
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('meetings')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Meeting Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMeetings.map((meet) => (
            <div
              key={meet.id}
              className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/30 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs sm:text-sm font-bold text-white">{meet.title}</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Host: {meet.hostName} · {meet.participants.length} Active Participants
                </p>
                <p className="text-[11px] font-mono text-slate-500">Meeting ID: {meet.id}</p>
              </div>

              <button
                onClick={() => setActiveMeeting(meet)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                Join Conference
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Trending Video on Demand (Netflix style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-rose-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Featured on Demand Library
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('vod')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All Movies & Tutorials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {videos.slice(0, 4).map((v) => (
            <div
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 overflow-hidden cursor-pointer transition-all hover:shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pl-0.5 shadow-lg">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                  {v.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{v.category} · {v.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
