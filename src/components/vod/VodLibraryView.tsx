import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { CardSkeleton, HeroBillboardSkeleton } from '../common/Skeletons';
import {
  Play,
  Plus,
  Heart,
  Search,
  Upload,
  Clock,
  Eye,
  Star,
  Check,
  Film,
  Sparkles,
} from 'lucide-react';
import { VideoItem } from '../../types';

export const VodLibraryView: React.FC = () => {
  const {
    videos,
    setActiveVideo,
    watchHistory,
    favorites,
    toggleFavorite,
    uploadVideo,
    currentUser,
  } = usePlatform();

  const { isLoading } = useViewLoading(400);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Technology');
  const [uploadGenre, setUploadGenre] = useState('Documentary');
  const [uploadDesc, setUploadDesc] = useState('');

  const featuredVideo = videos[0] || null;

  const categories = ['All', 'Movies & Sci-Fi', 'Documentary', 'Esports', 'Technology'];

  const filteredVideos = videos.filter((v) => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesQuery =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    uploadVideo({
      title: uploadTitle,
      category: uploadCategory,
      genre: uploadGenre,
      description: uploadDesc,
      thumbnailUrl: '/src/assets/images/vod_cyber_chronicles_1794476877662.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    });
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadDesc('');
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
        {/* Hero Billboard Shimmer */}
        <HeroBillboardSkeleton />

        {/* Filter & Search Bar Shimmer */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 animate-pulse">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-24 h-9 rounded-xl bg-slate-900 border border-slate-800 shrink-0" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-48 sm:w-64 h-10 rounded-xl bg-slate-900 border border-slate-800" />
            <div className="w-28 h-10 rounded-xl bg-slate-800" />
          </div>
        </div>

        {/* VOD Cards Grid Shimmer */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-800 animate-pulse" />
            <div className="h-5 bg-slate-800 rounded w-48 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
      {/* Netflix-Style Hero Billboard */}
      {featuredVideo && (
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[340px] sm:min-h-[400px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-end">
          <img
            src={featuredVideo.thumbnailUrl}
            alt={featuredVideo.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-90 scale-105"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Billboard Content */}
          <div className="relative z-10 p-4 sm:p-6 md:p-12 max-w-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold tracking-wider uppercase text-[10px]">
                Original Masterpiece
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-300 font-semibold">{featuredVideo.resolutions[0]}</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {featuredVideo.rating}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
              {featuredVideo.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
              {featuredVideo.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveVideo(featuredVideo)}
                className="px-6 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Now</span>
              </button>

              <button
                onClick={() => toggleFavorite(featuredVideo.id)}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm flex items-center gap-2 border border-slate-700 backdrop-blur transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${favorites.includes(featuredVideo.id) ? 'text-rose-500 fill-current' : ''}`}
                />
                <span>{favorites.includes(featuredVideo.id) ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Category Tabs & Search & Upload Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Interactive Filter Tabs (Buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto w-full md:w-auto">
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

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {/* Continue Watching Section (If history has items) */}
      {watchHistory.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Continue Watching
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchHistory.slice(0, 4).map((vid) => (
              <div
                key={`cw-${vid.id}`}
                onClick={() => setActiveVideo(vid)}
                className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 transition-all hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pl-0.5 shadow-lg">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  {/* Progress line */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-800">
                    <div className="h-full bg-rose-600 w-2/3" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-white truncate">{vid.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{vid.creatorName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Video Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            All Catalog Titles ({filteredVideos.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => {
            const isFav = favorites.includes(video.id);
            return (
              <div
                key={video.id}
                className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 overflow-hidden transition-all hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div
                  onClick={() => setActiveVideo(video)}
                  className="relative aspect-video overflow-hidden bg-slate-950 cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pl-0.5 shadow-xl">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-white font-medium tabular-nums">
                    {formatDuration(video.duration)}
                  </span>
                </div>

                {/* Info Block */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => setActiveVideo(video)}
                      className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {video.title}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(video.id)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ${
                        isFav ? 'text-rose-500' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[120px]">{video.creatorName}</span>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-500" />
                        {video.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Video Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-500" />
              Upload Video to Library
            </h3>
            <p className="text-xs text-slate-400">
              Videos are processed asynchronously through our FFmpeg microservice into adaptive HLS streams.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Neural Networks in Real-Time Video"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Movies & Sci-Fi">Movies & Sci-Fi</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Esports">Esports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={uploadGenre}
                    onChange={(e) => setUploadGenre(e.target.value)}
                    placeholder="e.g. Masterclass"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Tell viewers what this video is about..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                >
                  Publish Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
