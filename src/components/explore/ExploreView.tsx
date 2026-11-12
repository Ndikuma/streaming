import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { CardSkeleton } from '../common/Skeletons';
import { Search, TrendingUp, Radio, Film, Video, Star, Eye } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const { streams, videos, setActiveStream, setActiveVideo, setActiveTab } = usePlatform();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabFilter, setTabFilter] = useState<'all' | 'live' | 'vod'>('all');

  const trendingTags = ['#VALORANT', '#SynthWave', '#Wildlife4K', '#DotNet10', '#WebRTC', '#LiveKit'];

  const filteredStreams = streams.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
        {/* Search Header Shimmer */}
        <div className="max-w-2xl mx-auto text-center space-y-4 animate-pulse">
          <div className="h-7 bg-slate-800 rounded-lg w-72 mx-auto" />
          <div className="h-3 bg-slate-800/60 rounded w-96 mx-auto" />
          <div className="w-full h-12 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="flex justify-center gap-2 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-16 h-4 rounded bg-slate-800" />
            ))}
          </div>
        </div>

        {/* Tabs Shimmer */}
        <div className="flex justify-center gap-2 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-28 h-8 rounded-xl bg-slate-900 border border-slate-800" />
          ))}
        </div>

        {/* Content Skeletons */}
        <div className="space-y-4">
          <div className="h-4 bg-slate-800 rounded w-44 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Explore Everything on OmniStream
        </h1>
        <p className="text-xs text-slate-400">
          Search across live broadcasts, community conferences, and on-demand video libraries
        </p>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search streams, movies, conferences, creators..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 shadow-xl"
          />
        </div>

        {/* Trending tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-500 font-semibold">Trending:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag.replace('#', ''))}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setTabFilter('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tabFilter === 'all' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Content
          </button>
          <button
            onClick={() => setTabFilter('live')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tabFilter === 'live' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Streams
          </button>
          <button
            onClick={() => setTabFilter('vod')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tabFilter === 'vod' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Videos on Demand
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-8">
        {(tabFilter === 'all' || tabFilter === 'live') && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500" />
              Live Streams ({filteredStreams.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredStreams.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveStream(s)}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 transition-all hover:shadow-xl"
                >
                  <div className="relative aspect-video">
                    <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                      LIVE
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-white truncate">{s.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{s.creatorName} · {s.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tabFilter === 'all' || tabFilter === 'vod') && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-400" />
              Videos on Demand ({filteredVideos.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredVideos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setActiveVideo(v)}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 transition-all hover:shadow-xl"
                >
                  <div className="relative aspect-video">
                    <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-white truncate">{v.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{v.category} · {v.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
