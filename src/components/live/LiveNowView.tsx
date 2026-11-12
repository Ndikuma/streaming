import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { CardSkeleton } from '../common/Skeletons';
import { Radio, Eye, Filter, Sparkles, Plus } from 'lucide-react';
import { Stream } from '../../types';

export const LiveNowView: React.FC = () => {
  const { streams, setActiveStream, setActiveTab } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { isLoading } = useViewLoading(400);

  const categories = ['All', 'Esports', 'Music & Audio', 'Nature & Science', 'Technology'];

  const filteredStreams = streams.filter(
    (s) => selectedCategory === 'All' || s.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
        {/* Header Shimmer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 bg-slate-800 rounded w-48" />
            <div className="h-3 bg-slate-800/60 rounded w-72" />
          </div>
          <div className="w-32 h-10 rounded-xl bg-slate-800" />
        </div>

        {/* Tabs Shimmer */}
        <div className="flex gap-2 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-20 h-8 rounded-lg bg-slate-900 border border-slate-800" />
          ))}
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h1 className="text-xl font-bold text-white tracking-tight">Live Now</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
              {streams.filter((s) => s.isLive).length} Active Streams
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse public live broadcasts powered by ultra-low-latency WebRTC and LiveKit
          </p>
        </div>

        <button
          onClick={() => setActiveTab('studio')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-rose-900/30 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Go Live Now</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Streams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredStreams.map((stream) => (
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
                {stream.resolution} @ {stream.fps}fps
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

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {stream.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>{stream.category}</span>
                <span className="text-rose-400 font-semibold text-[10px]">Watch & Send Gifts →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
