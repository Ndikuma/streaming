import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  FloatingReactionsOverlay,
  ReactionType,
  ReactionParticle,
} from './FloatingReactionsOverlay';
import {
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Heart,
  ThumbsUp,
  Gift,
  Share2,
  Flag,
  UserPlus,
  UserCheck,
  Send,
  Trash2,
  Settings,
  Eye,
  Radio,
  Check,
} from 'lucide-react';
import { Stream } from '../../types';

interface LiveViewerModalProps {
  stream: Stream;
  onClose: () => void;
  onOpenCoinModal: () => void;
}

export const LiveViewerModal: React.FC<LiveViewerModalProps> = ({ stream, onClose, onOpenCoinModal }) => {
  const {
    currentUser,
    streamChatMessages,
    sendChatMessage,
    deleteChatMessage,
    virtualGifts,
    sendVirtualGift,
    followedCreators,
    toggleFollowCreator,
    reports,
  } = usePlatform();

  const [isMuted, setIsMuted] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');

  // Real-Time Reactions State
  const [userReactions, setUserReactions] = useState<ReactionParticle[]>([]);
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboType, setComboType] = useState<ReactionType | null>(null);
  const [reactionStats, setReactionStats] = useState({
    hearts: 34280,
    likes: 18940,
    claps: 7620,
  });

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const messages = streamChatMessages[stream.id] || [];
  const isFollowing = followedCreators.includes(stream.creatorId);
  const canModerate = ['SuperAdmin', 'Administrator', 'Moderator'].includes(currentUser.role);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Clean expired user reaction particles
  useEffect(() => {
    if (userReactions.length === 0) return;
    const timer = setTimeout(() => {
      setUserReactions((prev) => prev.slice(2));
    }, 2800);
    return () => clearTimeout(timer);
  }, [userReactions]);

  // Subtle web audio feedback synthesizer for reactions
  const playReactionChime = useCallback((type: ReactionType) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'heart') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'like') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'clap') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // AudioContext not allowed before user gesture or unavailable
    }
  }, [isMuted]);

  // Core reaction trigger handler (supports button clicks and screen taps)
  const triggerReaction = useCallback((type: ReactionType, clickXPercent?: number, clickYPercent?: number) => {
    playReactionChime(type);

    setReactionStats((prev) => ({
      ...prev,
      hearts: type === 'heart' ? prev.hearts + 1 : prev.hearts,
      likes: type === 'like' ? prev.likes + 1 : prev.likes,
      claps: type === 'clap' ? prev.claps + 1 : prev.claps,
    }));

    setComboType(type);
    setComboCount((prev) => {
      const next = prev + 1;
      if (next > 0 && next % 15 === 0) {
        sendChatMessage(
          stream.id,
          `🔥 ${currentUser.displayName} is on a ${next}x ${type.toUpperCase()} streak!`
        );
      }
      return next;
    });

    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
    }
    comboTimerRef.current = setTimeout(() => {
      setComboCount(0);
      setComboType(null);
    }, 1600);

    const heartIcons = ['❤️', '💖', '💕', '💓', '💗'];
    const likeIcons = ['👍', '🔥', '⚡', '✨', '⭐'];
    const clapIcons = ['👏', '🙌', '🎉', '🎊', '✨'];

    let iconsPool = heartIcons;
    let colorsPool = ['#f43f5e', '#ec4899', '#fda4af'];

    if (type === 'like') {
      iconsPool = likeIcons;
      colorsPool = ['#38bdf8', '#f59e0b', '#fbbf24'];
    } else if (type === 'clap') {
      iconsPool = clapIcons;
      colorsPool = ['#10b981', '#a855f7', '#6366f1'];
    }

    const burstCount = Math.floor(2 + Math.random() * 2);
    const newParticles: ReactionParticle[] = [];

    for (let i = 0; i < burstCount; i++) {
      const icon = iconsPool[Math.floor(Math.random() * iconsPool.length)];
      const color = colorsPool[Math.floor(Math.random() * colorsPool.length)];
      const baseHorizontal = clickXPercent !== undefined ? clickXPercent : Math.floor(75 + Math.random() * 20);
      const spreadX = Math.floor(-4 + Math.random() * 8);

      newParticles.push({
        id: `user-${Date.now()}-${i}-${Math.random()}`,
        type,
        icon,
        x: Math.max(5, Math.min(95, baseHorizontal + spreadX)),
        startY: clickYPercent !== undefined ? clickYPercent : Math.floor(10 + Math.random() * 10),
        size: Math.floor(24 + Math.random() * 18),
        rotation: Math.floor(-30 + Math.random() * 60),
        color,
        sway: Math.floor(-35 + Math.random() * 70),
        duration: 2.2 + Math.random() * 0.6,
      });
    }

    setUserReactions((prev) => [...prev.slice(-30), ...newParticles]);
  }, [currentUser.displayName, playReactionChime, sendChatMessage, stream.id]);

  // Video Viewport Click handler (TikTok-style tap on screen to react)
  const handleViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('form')) {
      return;
    }

    if (!videoContainerRef.current) return;
    const rect = videoContainerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yFromBottomPercent = ((rect.bottom - e.clientY) / rect.height) * 100;

    triggerReaction('heart', xPercent, yFromBottomPercent);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(stream.id, chatInput);
    setChatInput('');
  };

  const handleSendGift = (giftId: string) => {
    const success = sendVirtualGift(stream.id, giftId);
    if (!success) {
      onOpenCoinModal();
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReport = () => {
    reports.push({
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.displayName,
      targetType: 'stream',
      targetId: stream.id,
      targetTitle: stream.title,
      reason: reportReason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      details: `User submitted report from live player: ${reportReason}`,
    });
    setShowReportModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 md:p-6">
      {/* Responsive Modal Container: Stacks vertically on mobile, side-by-side on desktop */}
      <div className="relative w-full max-w-7xl h-full sm:h-[94vh] max-h-screen sm:rounded-2xl bg-slate-950 border-0 sm:border border-slate-800 overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        
        {/* Floating Close Button: Positioned cleanly at top right */}
        <button
          onClick={onClose}
          aria-label="Close Live Viewer"
          className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =========================================================================
            Video Player Pane:
            - Mobile: w-full aspect-video shrink-0 (Maintains exact 16:9 aspect ratio!)
            - Desktop: lg:flex-1 lg:h-full lg:aspect-auto (Takes remaining width and full height)
           ========================================================================= */}
        <div
          ref={videoContainerRef}
          onClick={handleViewportClick}
          className="relative w-full aspect-video shrink-0 lg:aspect-auto lg:flex-1 lg:h-full bg-black flex items-center justify-center overflow-hidden group select-none cursor-pointer"
          title="Tap anywhere on the stream to send floating hearts!"
        >
          {/* Stream Broadcast Image / Canvas Feed */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={stream.thumbnailUrl}
              alt={stream.title}
              className="w-full h-full object-cover opacity-90"
            />
            {/* Ambient Lighting Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 pointer-events-none" />

            {/* Real-time Floating Reactions & Flying Gifts Canvas Layer */}
            <FloatingReactionsOverlay
              activeStreamId={stream.id}
              userReactions={userReactions}
              comboCount={comboCount}
              comboType={comboType}
            />
          </div>

          {/* Top Broadcaster Pill & Live Status */}
          <div className="absolute top-3 left-3 right-16 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2 sm:gap-3 bg-black/70 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/15 max-w-[85%] shadow-md">
              <img
                src={stream.creatorAvatar}
                alt={stream.creatorName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-rose-500 shrink-0"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white leading-tight truncate">{stream.creatorName}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 truncate">
                    <Eye className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    {stream.viewerCount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Follow Channel Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowCreator(stream.creatorId);
                }}
                className={`ml-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 min-h-[32px] ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/30'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline">Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Reaction Counter Strip (Desktop & Tablets) */}
            <div className="hidden md:flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] text-white font-semibold tabular-nums shadow-md">
              <span className="flex items-center gap-1 text-rose-400">
                ❤️ {reactionStats.hearts.toLocaleString()}
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-amber-400">
                👍 {reactionStats.likes.toLocaleString()}
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-emerald-400">
                👏 {reactionStats.claps.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Bottom Video Controls Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/70 to-transparent flex items-center justify-between opacity-95 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                aria-label="Toggle mute"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs font-medium text-slate-200 truncate max-w-[140px] sm:max-w-xs md:max-w-md hidden xs:inline">
                {stream.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quality Selector */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer min-h-[40px]"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{selectedQuality}</span>
                </button>

                {showSettings && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-11 right-0 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 w-28 z-50"
                  >
                    {(['1080p', '720p', '480p'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSelectedQuality(q);
                          setShowSettings(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer min-h-[36px] ${
                          selectedQuality === q ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span>{q}</span>
                        {selectedQuality === q && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Share */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                title="Share stream"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer relative min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -top-7 right-0 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>

              {/* Report */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReportModal(true);
                }}
                title="Report stream"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Flag className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            Chat, Reactions & Gifts Pane:
            - Mobile: flex-1 min-h-0 (Seamlessly takes all remaining height below video!)
            - Desktop: lg:w-96 lg:h-full lg:border-l (Fixed 384px side-by-side companion)
           ========================================================================= */}
        <div className="flex-1 min-h-0 lg:w-96 lg:h-full bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col justify-between overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Chat</h3>
              <span className="text-[10px] text-slate-400">· Real-time</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold tabular-nums">
              <span>{currentUser.coinsBalance.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">Coins</span>
            </div>
          </div>

          {/* Scrolling Messages Feed */}
          <div
            ref={chatScrollRef}
            className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2.5 text-xs divide-y divide-slate-900/50"
          >
            {messages.length === 0 ? (
              <p className="text-slate-500 text-center py-6 text-xs">Be the first to say hello!</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="pt-2 group flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <img
                      src={msg.userAvatar}
                      alt={msg.userName}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-semibold ${
                            msg.userId === stream.creatorId
                              ? 'text-rose-400'
                              : msg.userRole === 'Moderator'
                              ? 'text-emerald-400'
                              : 'text-slate-200'
                          }`}
                        >
                          {msg.userName}
                        </span>
                        {msg.userRole && msg.userRole !== 'RegularUser' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                            {msg.userRole}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                      <p className={`mt-0.5 leading-relaxed ${msg.isDeleted ? 'text-slate-500 italic' : 'text-slate-300'}`}>
                        {msg.text}
                      </p>
                    </div>
                  </div>

                  {/* Moderator Message Action */}
                  {canModerate && !msg.isDeleted && (
                    <button
                      onClick={() => deleteChatMessage(stream.id, msg.id)}
                      title="Delete message"
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-opacity cursor-pointer shrink-0 min-h-[32px] min-w-[32px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Virtual Gifts Quick Bar */}
          {showGiftPanel && (
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 animate-slide-up shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300">Virtual Gifts</span>
                <button
                  onClick={onOpenCoinModal}
                  className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                >
                  + Add Coins
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {virtualGifts.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift.id)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 hover:border-rose-500/40 border border-slate-700/60 transition-all cursor-pointer group min-h-[56px]"
                  >
                    <span className="text-xl sm:text-2xl group-hover:scale-125 transition-transform">{gift.icon}</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 mt-1 truncate max-w-full">
                      {gift.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold tabular-nums">
                      {gift.coinValue} coins
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Real-Time Reactions Action Bar (Heart, Like, Clap) */}
          <div className="px-3 pt-2 pb-1.5 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reactions
            </span>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Send Heart Reaction */}
              <button
                type="button"
                onClick={() => triggerReaction('heart')}
                title="Send Floating Heart (❤️)"
                className="group relative flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold transition-transform active:scale-125 cursor-pointer shadow-sm shadow-rose-900/20 min-h-[36px]"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] font-mono">Heart</span>
              </button>

              {/* Send Like Reaction */}
              <button
                type="button"
                onClick={() => triggerReaction('like')}
                title="Send Floating Like (👍/🔥)"
                className="group relative flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-bold transition-transform active:scale-125 cursor-pointer shadow-sm shadow-amber-900/20 min-h-[36px]"
              >
                <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] font-mono">Like</span>
              </button>

              {/* Send Clap Reaction */}
              <button
                type="button"
                onClick={() => triggerReaction('clap')}
                title="Send Floating Applause (👏)"
                className="group relative flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-transform active:scale-125 cursor-pointer shadow-sm shadow-emerald-900/20 min-h-[36px]"
              >
                <span className="text-xs">👏</span>
                <span className="text-[10px] font-mono">Clap</span>
              </button>
            </div>
          </div>

          {/* Chat Input & Interaction Footer */}
          <div className="p-2.5 sm:p-3 bg-slate-950 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowGiftPanel(!showGiftPanel)}
                title="Send Virtual Gift"
                className={`p-2 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  showGiftPanel
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 text-rose-400 hover:bg-slate-800'
                }`}
              >
                <Gift className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Chat or tap screen to react..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 min-h-[44px]"
              />

              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Report Stream</h3>
            <p className="text-xs text-slate-400 mb-4">
              Help keep OmniStream safe. Select why you are reporting "{stream.title}".
            </p>

            <div className="space-y-2 mb-6">
              {[
                'Inappropriate Content',
                'Harassment or Hate Speech',
                'Copyright or IP Infringement',
                'Spam or Fraudulent Activity',
                'Dangerous or Harmful Acts',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer text-xs text-slate-200 min-h-[44px]"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="accent-rose-500 w-4 h-4"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer min-h-[44px]"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
