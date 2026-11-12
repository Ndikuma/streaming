import React, { useState, useRef, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { StudioSkeleton } from '../common/Skeletons';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Radio,
  Settings2,
  Copy,
  Check,
  Users,
  Shield,
  Activity,
  Send,
} from 'lucide-react';
import { Stream } from '../../types';

export const LiveStudioView: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const {
    currentUser,
    streams,
    createStream,
    toggleLiveBroadcast,
    streamChatMessages,
    sendChatMessage,
  } = usePlatform();

  // Find or create broadcaster stream
  const myExistingStream = streams.find((s) => s.creatorId === currentUser.id);

  const [streamTitle, setStreamTitle] = useState(myExistingStream?.title || 'Interactive Live Broadcast & Discussion');
  const [streamDescription, setStreamDescription] = useState(myExistingStream?.description || 'Broadcasting live using WebRTC & LiveKit real-time engine.');
  const [category, setCategory] = useState(myExistingStream?.category || 'Technology');
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'subscribers_only'>('public');
  const [resolution, setResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [fps, setFps] = useState<60 | 30>(60);
  const [bitrate, setBitrate] = useState<number>(6500);

  // Hardware states
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [broadcastSeconds, setBroadcastSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isLive = myExistingStream?.isLive || false;
  const currentStreamId = myExistingStream?.id || 'studio-active';

  // Request & enumerate media devices
  useEffect(() => {
    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup Web Audio Analyser for VU meter
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const pcmData = new Uint8Array(analyser.frequencyBinCount);
        const checkAudio = () => {
          analyser.getByteFrequencyData(pcmData);
          let sum = 0;
          for (let i = 0; i < pcmData.length; i++) {
            sum += pcmData[i];
          }
          const avg = sum / pcmData.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkAudio);
        };
        checkAudio();

        // Enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const vList = devices.filter((d) => d.kind === 'videoinput');
        const aList = devices.filter((d) => d.kind === 'audioinput');
        setVideoDevices(vList);
        setAudioDevices(aList);
        if (vList[0]) setSelectedVideoDeviceId(vList[0].deviceId);
        if (aList[0]) setSelectedAudioDeviceId(aList[0].deviceId);
      } catch {
        // Fallback if browser permission is blocked or simulated
      }
    }

    initMedia();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Broadcast duration counter
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLive) {
      timer = setInterval(() => {
        setBroadcastSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setBroadcastSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isLive]);

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => {
        t.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => {
        t.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (videoRef.current && mediaStreamRef.current) {
            videoRef.current.srcObject = mediaStreamRef.current;
          }
        };
      } catch {
        // Cancelled screen share prompt
      }
    } else {
      if (videoRef.current && mediaStreamRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  const handleStartStopBroadcast = () => {
    if (!myExistingStream) {
      const created = createStream({
        title: streamTitle,
        description: streamDescription,
        category,
        privacy,
        resolution,
      });
      toggleLiveBroadcast(created.id);
    } else {
      toggleLiveBroadcast(myExistingStream.id);
    }
  };

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const streamKey = myExistingStream?.streamKey || 'live_omni_78829f001b9';
  const rtmpIngestUrl = 'rtmp://stream.omnistream.io/live';
  const messages = streamChatMessages[currentStreamId] || [];

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 bg-slate-800 rounded w-48" />
            <div className="h-3 bg-slate-800/60 rounded w-80" />
          </div>
          <div className="w-36 h-10 rounded-xl bg-slate-800" />
        </div>
        <StudioSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Live Studio</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
              Broadcaster Console
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Produce, monitor, and broadcast low-latency WebRTC streams powered by LiveKit & MediaMTX
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isLive && (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-400 font-bold uppercase">LIVE</span>
              <span className="text-slate-300 tabular-nums">{formatTime(broadcastSeconds)}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 tabular-nums">
                {myExistingStream?.viewerCount || 1} Viewers
              </span>
            </div>
          )}

          <button
            onClick={handleStartStopBroadcast}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isLive
                ? 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/30'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
            }`}
          >
            <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            <span>{isLive ? 'End Broadcast' : 'Start Live Stream'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Viewport & Hardware Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Video Viewport */}
          <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {!isCameraOn && !isScreenSharing && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3">
                <VideoOff className="w-12 h-12 text-slate-600" />
                <p className="text-xs text-slate-400">Camera preview is disabled</p>
              </div>
            )}

            {/* Overlaid Status Indicators */}
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <span className="px-2 py-1 rounded bg-black/70 backdrop-blur text-[11px] font-mono font-semibold text-slate-300 border border-white/10">
                {resolution} @ {fps}fps
              </span>
              <span className="px-2 py-1 rounded bg-black/70 backdrop-blur text-[11px] font-mono font-semibold text-slate-300 border border-white/10 tabular-nums">
                {bitrate} kbps
              </span>
            </div>

            {/* Audio VU Meter Level Bar Overlay */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
              <div className="bg-black/80 backdrop-blur p-2 rounded-xl border border-white/10 flex items-center gap-3">
                <Mic className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-75"
                    style={{ width: `${isMicOn ? audioLevel : 0}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right tabular-nums">
                  {isMicOn ? `${audioLevel}%` : 'MUTED'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hardware & Media Controls */}
          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={toggleMic}
                className={`flex-1 sm:flex-none p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                  isMicOn
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                <span>{isMicOn ? 'Mute' : 'Unmute'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`flex-1 sm:flex-none p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                  isCameraOn
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isCameraOn ? <Video className="w-4 h-4 text-indigo-400" /> : <VideoOff className="w-4 h-4" />}
                <span>{isCameraOn ? 'Stop Cam' : 'Start Cam'}</span>
              </button>

              <button
                onClick={toggleScreenShare}
                className={`w-full sm:w-auto p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                  isScreenSharing
                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>{isScreenSharing ? 'Stop Screen' : 'Share Screen'}</span>
              </button>
            </div>

            {/* Stream Diagnostics */}
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono w-full sm:w-auto justify-between sm:justify-end">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Latency: 128ms
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                WebRTC E2EE
              </span>
            </div>
          </div>

          {/* Stream Configuration Form */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-rose-400" />
              Stream Details & Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Technology">Technology & Engineering</option>
                  <option value="Esports">Esports & Gaming</option>
                  <option value="Music & Audio">Music & Creative</option>
                  <option value="Nature & Science">Nature & Science</option>
                  <option value="Education">Education & Masterclass</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Privacy Level
                </label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as 'public' | 'private' | 'subscribers_only')}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="public">Public (Listed globally)</option>
                  <option value="private">Private (Invite only)</option>
                  <option value="subscribers_only">Subscribers Only (Monetized)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Resolution & Framerate
                </label>
                <div className="flex gap-2">
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value as '1080p' | '720p' | '480p')}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="1080p">1080p Full HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p SD</option>
                  </select>
                  <select
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value) as 60 | 30)}
                    className="w-24 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value={60}>60 FPS</option>
                    <option value={30}>30 FPS</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* RTMP / OBS Ingestion Credentials (MediaMTX) */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                External Broadcaster / OBS Credentials (MediaMTX RTMP)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500">Server RTMP URL</p>
                    <p className="font-mono text-slate-300 truncate">{rtmpIngestUrl}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard?.writeText(rtmpIngestUrl)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500">Stream Key (Keep secret)</p>
                    <p className="font-mono text-slate-300 truncate">••••••••••••••••</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(streamKey);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Studio Live Chat & Guest Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Guest Speakers & Participant Invite Link */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Live Guest Broadcasters
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">1/4 Co-hosts</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.displayName}</p>
                  <p className="text-[10px] text-rose-400 font-medium">Main Broadcaster</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                ACTIVE
              </span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(`${window.location.origin}/join-guest/${currentStreamId}`);
                setCopiedInvite(true);
                setTimeout(() => setCopiedInvite(false), 2000);
              }}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedInvite ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Guest Invite Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Guest Co-Host Invite</span>
                </>
              )}
            </button>
          </div>

          {/* Broadcaster Chat Monitor */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col h-[480px]">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Broadcaster Chat Monitor</h3>
              <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs">
              {messages.length === 0 ? (
                <p className="text-slate-500 text-center py-10">Chat messages will appear here when viewers type.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/40">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{m.userName}</span>
                      <span className="text-[9px] text-slate-500">{m.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-1">{m.text}</p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                sendChatMessage(currentStreamId, chatInput);
                setChatInput('');
              }}
              className="pt-2 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Broadcast host message..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
