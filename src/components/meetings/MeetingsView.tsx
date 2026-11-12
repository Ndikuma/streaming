import React, { useState, useRef, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { MeetingCardSkeleton } from '../common/Skeletons';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Lock,
  Unlock,
  Shield,
  MessageSquare,
  Hand,
  UserCheck,
  UserX,
  Plus,
  Send,
  Copy,
  Check,
  Calendar,
  X,
} from 'lucide-react';
import { MeetingParticipant } from '../../types';

export const MeetingsView: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const {
    currentUser,
    meetings,
    activeMeeting,
    createMeeting,
    joinMeeting,
    leaveMeeting,
    toggleParticipantMute,
    toggleParticipantCamera,
    toggleHandRaise,
    admitParticipant,
    kickParticipant,
  } = usePlatform();

  const [meetingInputId, setMeetingInputId] = useState('');
  const [meetingPasscode, setMeetingPasscode] = useState('');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [meetingChatInput, setMeetingChatInput] = useState('');
  const [meetingMessages, setMeetingMessages] = useState<Array<{ id: string; sender: string; text: string; time: string }>>([
    { id: '1', sender: 'Dr. Sarah Chen', text: 'Hey team, reviewing the MediaMTX RTMP ingest benchmarks now.', time: '10:14 AM' },
    { id: '2', sender: 'Marcus Brody', text: 'LiveKit SFU auto-scaling cluster configs are deployed to staging.', time: '10:15 AM' },
  ]);

  const [copiedLink, setCopiedLink] = useState(false);
  const [isLocalScreenSharing, setIsLocalScreenSharing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const isHost = activeMeeting?.hostId === currentUser.id;

  // Camera setup for meeting
  useEffect(() => {
    if (activeMeeting) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {});
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeMeeting]);

  const handleCreateInstantMeeting = () => {
    createMeeting(newMeetingTitle || `${currentUser.displayName}'s Conference Room`);
    setNewMeetingTitle('');
  };

  const handleJoinById = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingInputId.trim()) return;
    const ok = joinMeeting(meetingInputId.trim());
    if (!ok) {
      alert(`Meeting ID "${meetingInputId}" not found. Try one from the list below.`);
    }
  };

  const handleToggleScreenShare = async () => {
    if (!isLocalScreenSharing) {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screen;
        }
        setIsLocalScreenSharing(true);
        screen.getVideoTracks()[0].onended = () => {
          setIsLocalScreenSharing(false);
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        };
      } catch {
        // cancelled
      }
    } else {
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsLocalScreenSharing(false);
    }
  };

  const handleSendMeetingChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingChatInput.trim()) return;
    setMeetingMessages((prev) => [
      ...prev,
      {
        id: `mchat-${Date.now()}`,
        sender: currentUser.displayName,
        text: meetingChatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMeetingChatInput('');
  };

  // If in active meeting room: render the Zoom-like meeting interface
  if (activeMeeting) {
    const participantsInRoom = activeMeeting.participants.filter((p) => !p.inWaitingRoom);
    const waitingRoomList = activeMeeting.participants.filter((p) => p.inWaitingRoom);

    return (
      <div className="relative h-[calc(100vh-65px)] bg-slate-950 flex flex-col justify-between overflow-hidden">
        {/* Top Meeting Info Bar */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10 backdrop-blur gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[160px] sm:max-w-md">
              {activeMeeting.title}
            </h2>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-xs font-mono text-slate-400">
              ID: {activeMeeting.id}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `Join OmniStream Meeting: ${activeMeeting.id} (Passcode: ${activeMeeting.passcode})`
                );
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">{copiedLink ? 'Copied' : 'Invite'}</span>
            </button>

            {isHost && (
              <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Host
              </span>
            )}
          </div>
        </div>

        {/* Center: Multi-Participant Video Gallery Grid */}
        <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-3 sm:gap-4 overflow-hidden relative">
          <div
            className={`flex-1 grid gap-2 sm:gap-4 items-center justify-center auto-rows-fr overflow-y-auto ${
              participantsInRoom.length <= 1
                ? 'grid-cols-1'
                : participantsInRoom.length <= 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : participantsInRoom.length <= 4
                ? 'grid-cols-2'
                : 'grid-cols-2 md:grid-cols-3'
            }`}
          >
            {participantsInRoom.map((p) => {
              const isMe = p.userId === currentUser.id;
              return (
                <div
                  key={p.id}
                  className="relative w-full h-full min-h-[160px] sm:min-h-[220px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex items-center justify-center group"
                >
                  {isMe ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${p.isVideoOff ? 'hidden' : 'block'}`}
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-full h-full object-cover filter brightness-75"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-slate-700/60 shadow-2xl"
                        />
                      </div>
                    </div>
                  )}

                  {p.isVideoOff && isMe && (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800 flex items-center justify-center text-lg sm:text-xl font-bold text-white">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-400">Camera turned off</span>
                    </div>
                  )}

                  {/* Participant Name Badge */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/70 backdrop-blur text-[11px] sm:text-xs font-semibold text-white max-w-[90%] truncate">
                    <span className="truncate">{p.name}</span>
                    {p.isMuted && <MicOff className="w-3 h-3 text-rose-400 shrink-0" />}
                    {p.hasHandRaised && <Hand className="w-3 h-3 text-amber-400 animate-bounce shrink-0" />}
                  </div>

                  {/* Host Quick Moderation Controls */}
                  {isHost && !isMe && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/80 backdrop-blur p-1 rounded-lg">
                      <button
                        onClick={() => toggleParticipantMute(p.id)}
                        title={p.isMuted ? 'Unmute participant' : 'Mute participant'}
                        className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        {p.isMuted ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => toggleParticipantCamera(p.id)}
                        title="Toggle camera"
                        className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        {p.isVideoOff ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => kickParticipant(p.id)}
                        title="Remove participant"
                        className="p-1 rounded hover:bg-rose-900/60 text-slate-400 hover:text-rose-400"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Waiting Room Side Drawer */}
          {waitingRoomList.length > 0 && isHost && (
            <div className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shrink-0">
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Waiting Room ({waitingRoomList.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {waitingRoomList.map((wp) => (
                    <div
                      key={wp.id}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={wp.avatar} alt={wp.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span className="font-medium text-slate-200 truncate">{wp.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => admitParticipant(wp.id)}
                          className="p-1 rounded bg-emerald-600/20 text-emerald-400"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => kickParticipant(wp.id)}
                          className="p-1 rounded bg-rose-600/20 text-rose-400"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* In-Meeting Real-time Chat Drawer (Slide in modal on mobile) */}
          {showChatDrawer && (
            <div className="absolute inset-x-2 bottom-16 top-12 lg:static lg:inset-auto lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between z-30 shadow-2xl">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">In-Call Chat</h3>
                <button
                  onClick={() => setShowChatDrawer(false)}
                  className="p-1 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {meetingMessages.map((m) => (
                  <div key={m.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-indigo-400">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="text-slate-200">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMeetingChat} className="p-3 border-t border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={meetingChatInput}
                  onChange={(e) => setMeetingChatInput(e.target.value)}
                  placeholder="Chat with everyone..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 min-h-[40px]"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Meeting Controls Bar */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between backdrop-blur gap-1.5 sm:gap-2">
          {/* Audio & Video Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                const me = activeMeeting.participants.find((p) => p.userId === currentUser.id);
                if (me) toggleParticipantMute(me.id);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Mute</span>
            </button>

            <button
              onClick={() => {
                const me = activeMeeting.participants.find((p) => p.userId === currentUser.id);
                if (me) toggleParticipantCamera(me.id);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <Video className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Video</span>
            </button>
          </div>

          {/* Center Meeting Action Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleToggleScreenShare}
              className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px] ${
                isLocalScreenSharing
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline">{isLocalScreenSharing ? 'Stop' : 'Share'}</span>
            </button>

            <button
              onClick={() => {
                const me = activeMeeting.participants.find((p) => p.userId === currentUser.id);
                if (me) toggleHandRaise(me.id);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <Hand className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Raise</span>
            </button>

            <button
              onClick={() => setShowChatDrawer(!showChatDrawer)}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="hidden sm:inline">Chat</span>
            </button>
          </div>

          {/* Leave & End Call */}
          <div className="flex items-center gap-2">
            <button
              onClick={leaveMeeting}
              className="px-3 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-red-900/30 cursor-pointer min-h-[44px]"
            >
              <PhoneOff className="w-4 h-4 shrink-0" />
              <span>{isHost ? 'End' : 'Leave'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton when navigating to meeting hub
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-48" />
          <div className="h-3.5 bg-slate-800/60 rounded w-80" />
        </div>

        {/* Quick Launch Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800" />
              <div className="h-4 bg-slate-700/80 rounded w-2/3" />
              <div className="h-3 bg-slate-800 rounded w-5/6" />
              <div className="h-10 bg-slate-800/80 rounded-xl w-full" />
            </div>
          ))}
        </div>

        {/* Active Conference Rooms Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-slate-800 rounded w-44 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MeetingCardSkeleton />
            <MeetingCardSkeleton />
            <MeetingCardSkeleton />
            <MeetingCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Meeting Hub (When not inside an active call)
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Video Conferencing</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            Multi-Party WebRTC
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Instant high-definition group video conferences, screen sharing, waiting rooms, and host controls
        </p>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Start Instant Meeting */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Host Instant Conference</h3>
            <p className="text-xs text-slate-400 mt-1">
              Start an encrypted multi-participant conference room with audio/video and screen share.
            </p>
          </div>
          <input
            type="text"
            value={newMeetingTitle}
            onChange={(e) => setNewMeetingTitle(e.target.value)}
            placeholder="Meeting topic (optional)"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[40px]"
          />
          <button
            onClick={handleCreateInstantMeeting}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer min-h-[44px]"
          >
            Start Meeting Now
          </button>
        </div>

        {/* Card 2: Join Meeting with ID */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Join Meeting</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter a 6-digit meeting room ID or invitation code to connect.
            </p>
          </div>
          <form onSubmit={handleJoinById} className="space-y-3">
            <input
              type="text"
              value={meetingInputId}
              onChange={(e) => setMeetingInputId(e.target.value)}
              placeholder="e.g. meet-101"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[40px]"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
            >
              Join Room
            </button>
          </form>
        </div>

        {/* Card 3: Schedule Future Meeting */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Schedule Meeting</h3>
            <p className="text-xs text-slate-400 mt-1">
              Set up calendar invites, pre-configure waiting room policies, and manage passwords.
            </p>
          </div>
          <div className="h-2 sm:h-10" />
          <button
            onClick={() => setShowScheduleModal(true)}
            className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
          >
            Schedule for Later
          </button>
        </div>
      </div>

      {/* Active & Scheduled Meetings List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Available Meeting Rooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${m.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}
                    />
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Hosted by {m.hostName}</p>
                </div>

                <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                  ID: {m.id}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span>{m.participants.length} Participants</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Lock className="w-3 h-3 text-slate-500" />
                    {m.passcode}
                  </span>
                </div>

                <button
                  onClick={() => joinMeeting(m.id)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-indigo-600/30 min-h-[36px]"
                >
                  Join Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
