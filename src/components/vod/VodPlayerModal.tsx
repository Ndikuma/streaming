import React, { useState, useRef, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Settings,
  Heart,
  Share2,
  Check,
  Eye,
  Film,
} from 'lucide-react';
import { VideoItem } from '../../types';

interface VodPlayerModalProps {
  video: VideoItem;
  onClose: () => void;
}

export const VodPlayerModal: React.FC<VodPlayerModalProps> = ({ video, onClose }) => {
  const { addToWatchHistory, favorites, toggleFavorite } = usePlatform();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 600);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedQuality, setSelectedQuality] = useState<string>(video.resolutions[0] || '1080p');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const isFavorited = favorites.includes(video.id);

  // Auto record to watch history
  useEffect(() => {
    addToWatchHistory(video);
  }, [video]);

  // Controls auto-hide timer
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-6">
      <div
        ref={containerRef}
        onMouseMove={() => setShowControls(true)}
        className="relative w-full max-w-6xl aspect-video max-h-[92vh] bg-black border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group select-none"
      >
        {/* Actual Video Element */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Top Header Bar */}
        <div
          className={`absolute top-0 inset-x-0 p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
              {video.category} · {video.genre}
            </span>
            <h2 className="text-base font-bold text-white drop-shadow-md truncate max-w-xl">
              {video.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(video.id)}
              title="Add to Favorites"
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFavorited
                  ? 'bg-rose-600 text-white'
                  : 'bg-black/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              title="Share video"
              className="p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer relative"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Big Play/Pause Splash (when paused) */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl pl-1 hover:scale-110 transition-transform">
              <Play className="w-10 h-10 fill-current" />
            </div>
          </div>
        )}

        {/* Bottom Custom Playback Controls Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 space-y-3 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-300 w-10 text-right tabular-nums">
              {formatSeconds(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:h-2 transition-all"
            />

            <span className="text-[11px] font-mono text-slate-400 w-10 tabular-nums">
              {formatSeconds(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Left Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => handleSkip(-10)}
                title="Rewind 10 seconds"
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSkip(10)}
                title="Forward 10 seconds"
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider (hidden on narrow mobile to prevent crowding) */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Playback Speed Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowQualityMenu(false);
                  }}
                  className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer tabular-nums min-h-[40px] flex items-center justify-center"
                >
                  {playbackSpeed}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-11 right-0 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 w-24 z-50">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                          playbackSpeed === s ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span>{s}x</span>
                        {playbackSpeed === s && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Resolution Switcher */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowQualityMenu(!showQualityMenu);
                    setShowSpeedMenu(false);
                  }}
                  className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer flex items-center gap-1 min-h-[40px]"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{selectedQuality}</span>
                </button>
                {showQualityMenu && (
                  <div className="absolute bottom-11 right-0 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 w-28 z-50">
                    {video.resolutions.map((res) => (
                      <button
                        key={res}
                        onClick={() => {
                          setSelectedQuality(res);
                          setShowQualityMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                          selectedQuality === res ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span>{res}</span>
                        {selectedQuality === res && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Picture-in-Picture */}
              <button
                onClick={togglePiP}
                title="Picture in picture"
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Film className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
