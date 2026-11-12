import React from 'react';

// Stream or Video Card Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden animate-pulse flex flex-col justify-between">
      {/* Thumbnail Aspect Video Shimmer */}
      <div className="aspect-video w-full bg-slate-800/70 relative">
        <div className="absolute top-2.5 left-2.5 w-14 h-5 rounded bg-slate-700/60" />
        <div className="absolute bottom-2.5 right-2.5 w-12 h-4 rounded bg-slate-700/60" />
      </div>

      {/* Info Block */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-slate-700/80 rounded w-4/5" />
            <div className="h-2.5 bg-slate-800 rounded w-1/2" />
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <div className="h-2.5 bg-slate-800/80 rounded w-full" />
          <div className="h-2.5 bg-slate-800/60 rounded w-2/3" />
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <div className="h-2.5 bg-slate-800 rounded w-16" />
          <div className="h-2.5 bg-slate-800 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

// Hero Billboard Skeleton (Home & VOD)
export const HeroBillboardSkeleton: React.FC = () => {
  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[340px] sm:min-h-[400px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 animate-pulse flex items-end p-6 md:p-12">
      <div className="max-w-2xl w-full space-y-4">
        {/* Category Pill Line */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-5 rounded bg-slate-700/80" />
          <div className="w-16 h-4 rounded bg-slate-800" />
          <div className="w-12 h-4 rounded bg-slate-800" />
        </div>

        {/* Title Lines */}
        <div className="h-8 md:h-10 bg-slate-700/80 rounded-lg w-3/4" />
        <div className="h-8 md:h-10 bg-slate-700/60 rounded-lg w-1/2" />

        {/* Description Lines */}
        <div className="space-y-2 pt-1 max-w-lg">
          <div className="h-3 bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-800 rounded w-5/6" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <div className="w-32 h-10 rounded-xl bg-slate-700/90" />
          <div className="w-36 h-10 rounded-xl bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

// Meeting Card Skeleton
export const MeetingCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="h-4 bg-slate-700/80 rounded w-2/3" />
          </div>
          <div className="h-3 bg-slate-800 rounded w-1/2" />
        </div>
        <div className="w-20 h-6 rounded bg-slate-800" />
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="h-3 bg-slate-800 rounded w-1/3" />
        <div className="w-24 h-8 rounded-lg bg-slate-700/80" />
      </div>
    </div>
  );
};

// Notification Item Skeleton
export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 animate-pulse flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-slate-700/80 rounded w-1/3" />
          <div className="h-3 bg-slate-800/80 rounded w-3/4" />
          <div className="h-2.5 bg-slate-800/50 rounded w-20" />
        </div>
      </div>
      <div className="w-12 h-4 rounded bg-slate-800" />
    </div>
  );
};

// Profile Banner & Inspector Skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-slate-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-6 bg-slate-700/80 rounded w-48" />
              <div className="h-3.5 bg-slate-800 rounded w-28" />
              <div className="h-3 bg-slate-800/60 rounded w-36" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-28 h-16 rounded-2xl bg-slate-800" />
            <div className="w-28 h-16 rounded-2xl bg-slate-800" />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <div className="h-3 bg-slate-800/80 rounded w-full" />
          <div className="h-3 bg-slate-800/60 rounded w-3/4" />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="h-4 bg-slate-700/80 rounded w-1/3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-slate-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
};

// Studio Console Skeleton
export const StudioSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div className="lg:col-span-8 space-y-4">
        {/* Main Viewport Shimmer */}
        <div className="aspect-video w-full rounded-2xl bg-slate-900/90 border border-slate-800 relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/60" />
          <div className="absolute bottom-4 inset-x-4 h-8 bg-slate-800/60 rounded-xl" />
        </div>

        {/* Hardware Controls Bar */}
        <div className="h-14 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center px-4 justify-between">
          <div className="flex gap-2">
            <div className="w-24 h-9 bg-slate-800 rounded-lg" />
            <div className="w-24 h-9 bg-slate-800 rounded-lg" />
            <div className="w-28 h-9 bg-slate-800 rounded-lg" />
          </div>
          <div className="w-32 h-6 bg-slate-800 rounded" />
        </div>

        {/* Inputs Form */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="h-4 bg-slate-700/80 rounded w-1/4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-slate-800/60 rounded-lg" />
            <div className="h-10 bg-slate-800/60 rounded-lg" />
          </div>
          <div className="h-20 bg-slate-800/40 rounded-lg" />
        </div>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
          <div className="h-4 bg-slate-700/80 rounded w-1/2" />
          <div className="h-12 bg-slate-800/60 rounded-xl" />
        </div>

        <div className="h-[480px] rounded-2xl bg-slate-900/60 border border-slate-800 p-4 flex flex-col justify-between">
          <div className="h-4 bg-slate-700/80 rounded w-1/3" />
          <div className="space-y-3 flex-1 pt-4">
            <div className="h-12 bg-slate-800/50 rounded-lg" />
            <div className="h-12 bg-slate-800/50 rounded-lg" />
            <div className="h-12 bg-slate-800/50 rounded-lg" />
          </div>
          <div className="h-10 bg-slate-800/80 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// Table / Moderation List Skeleton
export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="w-28 h-8 rounded-lg bg-slate-800" />
          <div className="w-28 h-8 rounded-lg bg-slate-800/60" />
        </div>
        <div className="w-32 h-8 rounded-lg bg-slate-800/60" />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800/80">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-16 h-4 rounded bg-slate-800" />
                <div className="w-48 h-4 rounded bg-slate-700/80" />
              </div>
              <div className="w-3/4 h-3 rounded bg-slate-800/60" />
            </div>
            <div className="flex gap-2">
              <div className="w-20 h-8 rounded-lg bg-slate-800" />
              <div className="w-20 h-8 rounded-lg bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Form & Preferences Skeleton (Settings)
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="h-4 bg-slate-700/80 rounded w-1/3" />
        <div className="space-y-3">
          <div className="h-12 bg-slate-800/50 rounded-xl" />
          <div className="h-12 bg-slate-800/50 rounded-xl" />
          <div className="h-12 bg-slate-800/50 rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="h-4 bg-slate-700/80 rounded w-1/4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-14 bg-slate-800/50 rounded-xl" />
          <div className="h-14 bg-slate-800/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
