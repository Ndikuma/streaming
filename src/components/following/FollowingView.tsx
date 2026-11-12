import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { CardSkeleton } from '../common/Skeletons';
import { Users, Radio, UserCheck, Eye, Film } from 'lucide-react';

export const FollowingView: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const { streams, followedCreators, toggleFollowCreator, setActiveStream } = usePlatform();

  // Streams from followed creators
  const followedStreams = streams.filter((s) => followedCreators.includes(s.creatorId));

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
        {/* Header Shimmer */}
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-48" />
          <div className="h-3 bg-slate-800/60 rounded w-80" />
        </div>

        {/* Content Skeletons */}
        <div className="space-y-4">
          <div className="h-4 bg-slate-800 rounded w-52 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-500" />
          <h1 className="text-xl font-bold text-white tracking-tight">Following</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
            {followedCreators.length} Channels Followed
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Stay connected with your favorite broadcasters, creators, and conference hosts
        </p>
      </div>

      {followedStreams.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Broadcasting Channels You Follow
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {followedStreams.map((stream) => (
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
                  {stream.isLive && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" /> LIVE
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={stream.creatorAvatar}
                        alt={stream.creatorName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <h3 className="text-xs font-bold text-white truncate max-w-[150px]">
                          {stream.creatorName}
                        </h3>
                        <p className="text-[10px] text-slate-400">{stream.category}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollowCreator(stream.creatorId);
                      }}
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>Following</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1">{stream.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Broadcasters Followed Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse Live Now streams and click "Follow" on creators to see their live broadcasts here.
          </p>
        </div>
      )}
    </div>
  );
};
