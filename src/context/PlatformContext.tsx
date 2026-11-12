import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Stream,
  Meeting,
  VideoItem,
  ChatMessage,
  VirtualGift,
  NotificationItem,
  ContentReport,
  AuditLog,
  CreatorEarningRecord,
  MeetingParticipant,
} from '../types';

export const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: 'gift-1', name: 'Ruby Rose', icon: '🌹', coinValue: 10, description: 'Send a fragrant rose of appreciation', animationType: 'hearts' },
  { id: 'gift-2', name: 'Neon Heart', icon: '💖', coinValue: 50, description: 'Shower the stream with glowing love', animationType: 'hearts' },
  { id: 'gift-3', name: 'Diamond Spark', icon: '💎', coinValue: 200, description: 'Sparkling diamond prestige', animationType: 'diamond' },
  { id: 'gift-4', name: 'Super Rocket', icon: '🚀', coinValue: 500, description: 'Blasts off straight through the screen!', animationType: 'rocket' },
  { id: 'gift-5', name: 'Galaxy Crown', icon: '👑', coinValue: 1000, description: 'Crown the broadcaster as a streaming king', animationType: 'crown' },
  { id: 'gift-6', name: 'Mythic Fireworks', icon: '🎆', coinValue: 2500, description: 'Spectacular firework celebration', animationType: 'fireworks' },
];

const INITIAL_USER: User = {
  id: 'usr-101',
  username: 'alex_creator',
  displayName: 'Alex Vance',
  email: 'alex.vance@omnistream.io',
  avatarUrl: '/src/assets/images/creator_avatar_streamer_1794476879090.jpg',
  role: 'ContentCreator',
  permissions: [
    'stream:broadcast',
    'stream:join',
    'stream:moderate',
    'meeting:host',
    'meeting:join',
    'meeting:manage',
    'vod:upload',
    'chat:send',
    'finance:monetize',
  ],
  bio: 'Lead Architect & Broadcaster. Building next-generation media infrastructure and streaming real-time tech talks.',
  followersCount: 14200,
  followingCount: 38,
  isVerified: true,
  isSuspended: false,
  coinsBalance: 2450,
  earningsBalance: 1284.5,
  createdAt: '2026-01-15T08:00:00Z',
};

const INITIAL_STREAMS: Stream[] = [
  {
    id: 'stream-1',
    creatorId: 'usr-201',
    creatorName: 'Nova Esports Arena',
    creatorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    title: 'VALORANT World Invitational: Team Nova vs Fire Squad [Grand Final]',
    description: 'Live coverage of the Grand Finals with multilingual caster audio and instant 4K multi-cam analysis.',
    category: 'Esports',
    thumbnailUrl: '/src/assets/images/hero_stream_gaming_1794476876855.jpg',
    streamKey: 'live_esports_77192a8b',
    isLive: true,
    viewerCount: 48920,
    peakViewerCount: 62400,
    privacy: 'public',
    startedAt: new Date(Date.now() - 42 * 60000).toISOString(),
    resolution: '1080p',
    fps: 60,
    bitrateKbps: 8500,
    livekitRoomName: 'room-esports-grand-final',
  },
  {
    id: 'stream-2',
    creatorId: 'usr-202',
    creatorName: 'Elena Rostova',
    creatorAvatar: '/src/assets/images/creator_avatar_streamer_1794476879090.jpg',
    title: 'Cyberpunk Soundscapes: Live Modular Synth Improvisation & Chat QA',
    description: 'Analog synthesizers, ambient binaural audio, and deep chill vibes for late-night coders and creators.',
    category: 'Music & Audio',
    thumbnailUrl: '/src/assets/images/vod_cyber_chronicles_1794476877662.jpg',
    streamKey: 'live_synth_8841a12e',
    isLive: true,
    viewerCount: 3820,
    peakViewerCount: 4500,
    privacy: 'public',
    startedAt: new Date(Date.now() - 75 * 60000).toISOString(),
    resolution: '1080p',
    fps: 60,
    bitrateKbps: 6000,
    livekitRoomName: 'room-synth-chill',
  },
  {
    id: 'stream-3',
    creatorId: 'usr-203',
    creatorName: 'Himalayan Wildlife Expedition',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Live Himalayan Sanctuary 4K Cam: Snow Leopards & High Altitudes',
    description: 'Solar-powered remote 4K camera positioned at 4,800m altitude in Ladakh sanctuary.',
    category: 'Nature & Science',
    thumbnailUrl: '/src/assets/images/vod_nature_documentary_1794476878831.jpg',
    streamKey: 'live_wildlife_99182f',
    isLive: true,
    viewerCount: 8430,
    peakViewerCount: 9200,
    privacy: 'public',
    startedAt: new Date(Date.now() - 180 * 60000).toISOString(),
    resolution: '1080p',
    fps: 30,
    bitrateKbps: 5500,
    livekitRoomName: 'room-wildlife-cam',
  },
  {
    id: 'stream-4',
    creatorId: 'usr-101',
    creatorName: 'Alex Vance',
    creatorAvatar: '/src/assets/images/creator_avatar_streamer_1794476879090.jpg',
    title: 'Architecting Low-Latency Hybrid Streaming on .NET 10 & WebRTC',
    description: 'Deep dive into MediaMTX, LiveKit, SignalR, and distributed video processing pipelines.',
    category: 'Technology',
    thumbnailUrl: '/src/assets/images/vod_cyber_chronicles_1794476877662.jpg',
    streamKey: 'live_alex_tech_talk',
    isLive: false,
    viewerCount: 0,
    peakViewerCount: 1250,
    privacy: 'public',
    resolution: '1080p',
    fps: 60,
    bitrateKbps: 7000,
    livekitRoomName: 'room-alex-tech',
  },
];

const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Cyber Chronicles: Neon Convergence',
    description: 'In the towering rainy megastructures of 2088, an undercover network engineer uncovers a rogue AI streaming unauthorized memories across the global mesh.',
    thumbnailUrl: '/src/assets/images/vod_cyber_chronicles_1794476877662.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734,
    creatorId: 'usr-202',
    creatorName: 'Elena Rostova',
    creatorAvatar: '/src/assets/images/creator_avatar_streamer_1794476879090.jpg',
    category: 'Movies & Sci-Fi',
    genre: 'Cyberpunk Thriller',
    views: 348200,
    likes: 29400,
    rating: 4.9,
    publishedAt: '2026-02-10T14:00:00Z',
    resolutions: ['4K UHD', '1080p', '720p', '480p'],
    tags: ['Sci-Fi', 'Cyberpunk', 'Originals', '4K'],
  },
  {
    id: 'vid-2',
    title: 'Snow Leopard: Phantom of the Himalayas',
    description: 'A 4-year expedition across the Karakoram and Himalayan snow ridges, documenting the elusive ghost cats in ultra-high resolution slow-motion cinematography.',
    thumbnailUrl: '/src/assets/images/vod_nature_documentary_1794476878831.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653,
    creatorId: 'usr-203',
    creatorName: 'Himalayan Wildlife Expedition',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'Documentary',
    genre: 'Nature & Wildlife',
    views: 892100,
    likes: 74200,
    rating: 5.0,
    publishedAt: '2026-01-28T09:30:00Z',
    resolutions: ['4K UHD', '1080p', '720p'],
    tags: ['Documentary', 'Himalayas', 'Wildlife', 'Nature'],
  },
  {
    id: 'vid-3',
    title: 'Esports Grand Championship 2026: Official Highlights',
    description: 'Relive every clutch defuse, overtime round, and the emotional trophy lift from the sold-out Berlin Arena.',
    thumbnailUrl: '/src/assets/images/hero_stream_gaming_1794476876855.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596,
    creatorId: 'usr-201',
    creatorName: 'Nova Esports Arena',
    creatorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    category: 'Esports',
    genre: 'Competitive Gaming',
    views: 1240000,
    likes: 112000,
    rating: 4.8,
    publishedAt: '2026-02-01T18:00:00Z',
    resolutions: ['1080p60', '720p60', '480p'],
    tags: ['Esports', 'Championship', 'Highlights'],
  },
  {
    id: 'vid-4',
    title: 'Full-Stack .NET 10 & Real-Time Media Architecture',
    description: 'Masterclass covering clean architecture, SignalR hubs, LiveKit token generation, and FFmpeg worker queue management.',
    thumbnailUrl: '/src/assets/images/vod_cyber_chronicles_1794476877662.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 888,
    creatorId: 'usr-101',
    creatorName: 'Alex Vance',
    creatorAvatar: '/src/assets/images/creator_avatar_streamer_1794476879090.jpg',
    category: 'Technology',
    genre: 'Engineering Tutorial',
    views: 78500,
    likes: 8300,
    rating: 4.95,
    publishedAt: '2026-02-05T12:00:00Z',
    resolutions: ['1080p', '720p'],
    tags: ['DotNet', 'C#', 'LiveKit', 'WebRTC', 'Architecture'],
  },
];

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-101',
    title: 'Global Video Streaming Architecture Sync',
    hostId: 'usr-101',
    hostName: 'Alex Vance',
    passcode: '882041',
    isLocked: false,
    waitingRoomEnabled: true,
    allowScreenShare: true,
    allowParticipantUnmute: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    participants: [
      {
        id: 'p-1',
        userId: 'usr-101',
        name: 'Alex Vance (Host)',
        avatar: '/src/assets/images/creator_avatar_streamer_1794476879090.jpg',
        isHost: true,
        isCoHost: false,
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
        hasHandRaised: false,
        inWaitingRoom: false,
        joinedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: 'p-2',
        userId: 'usr-301',
        name: 'Dr. Sarah Chen (MediaMTX Specialist)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        isHost: false,
        isCoHost: true,
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
        hasHandRaised: false,
        inWaitingRoom: false,
        joinedAt: new Date(Date.now() - 12 * 60000).toISOString(),
      },
      {
        id: 'p-3',
        userId: 'usr-302',
        name: 'Marcus Brody (DevOps Lead)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isHost: false,
        isCoHost: false,
        isMuted: true,
        isVideoOff: false,
        isScreenSharing: false,
        hasHandRaised: true,
        inWaitingRoom: false,
        joinedAt: new Date(Date.now() - 10 * 60000).toISOString(),
      },
    ],
  },
  {
    id: 'meet-102',
    title: 'Product Roadmap & Creator Monetization Review',
    hostId: 'usr-202',
    hostName: 'Elena Rostova',
    scheduledTime: '2026-11-12T16:00:00Z',
    passcode: '419200',
    isLocked: false,
    waitingRoomEnabled: false,
    allowScreenShare: true,
    allowParticipantUnmute: true,
    isActive: false,
    createdAt: new Date().toISOString(),
    participants: [],
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'live',
    title: 'Nova Esports is LIVE',
    message: 'VALORANT World Invitational Grand Finals just kicked off!',
    timestamp: '15m ago',
    isRead: false,
    actionUrl: 'stream-1',
  },
  {
    id: 'notif-2',
    type: 'gift',
    title: 'Virtual Gift Received',
    message: 'Elena Rostova sent you a Super Rocket (+500 Coins)!',
    timestamp: '1h ago',
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'meeting',
    title: 'Meeting Started',
    message: 'Architecture Sync has started. Click to join room.',
    timestamp: '2h ago',
    isRead: true,
    actionUrl: 'meet-101',
  },
  {
    id: 'notif-4',
    type: 'follower',
    title: 'New Broadcaster Follower',
    message: 'Marcus Brody started following your live broadcast channel.',
    timestamp: '5h ago',
    isRead: true,
  },
];

const INITIAL_REPORTS: ContentReport[] = [
  {
    id: 'rep-1',
    reporterId: 'usr-901',
    reporterName: 'Viewer_Sam',
    targetType: 'chat',
    targetId: 'msg-992',
    targetTitle: 'Spam in Esports Chat',
    reason: 'Repetitive promotional bot links in live broadcast comments',
    status: 'pending',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    details: 'User repeatedly posted third-party gambling URLs in live public chat.',
  },
  {
    id: 'rep-2',
    reporterId: 'usr-902',
    reporterName: 'Clara_M',
    targetType: 'stream',
    targetId: 'stream-999',
    targetTitle: 'Copyright Infringement Claim',
    reason: 'Broadcasting uncredited commercial soundtrack without license',
    status: 'pending',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    details: 'Automated fingerprinting detected copyrighted audio track at 00:14:20.',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorId: 'usr-101',
    actorName: 'Alex Vance',
    action: 'STREAM_CREATED',
    target: 'stream-4',
    details: 'Broadcaster configured 1080p60 WebRTC Live Studio session',
    timestamp: '2026-11-12T07:15:00Z',
  },
  {
    id: 'log-2',
    actorId: 'usr-101',
    actorName: 'Alex Vance',
    action: 'MEETING_HOSTED',
    target: 'meet-101',
    details: 'Started Global Video Streaming Architecture Sync with passcode protection',
    timestamp: '2026-11-12T07:30:00Z',
  },
  {
    id: 'log-3',
    actorId: 'usr-super',
    actorName: 'System Guardian',
    action: 'ROLE_ASSIGNED',
    target: 'usr-101',
    details: 'Granted stream:broadcast and finance:monetize capabilities',
    timestamp: '2026-11-12T01:00:00Z',
  },
];

interface PlatformContextType {
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  updateUserCoins: (delta: number) => void;
  streams: Stream[];
  activeStream: Stream | null;
  setActiveStream: (stream: Stream | null) => void;
  createStream: (newStream: Partial<Stream>) => Stream;
  toggleLiveBroadcast: (streamId: string) => void;
  meetings: Meeting[];
  activeMeeting: Meeting | null;
  setActiveMeeting: (meeting: Meeting | null) => void;
  createMeeting: (title: string, passcode?: string) => Meeting;
  joinMeeting: (meetingId: string) => boolean;
  leaveMeeting: () => void;
  toggleParticipantMute: (participantId: string) => void;
  toggleParticipantCamera: (participantId: string) => void;
  toggleHandRaise: (participantId: string) => void;
  admitParticipant: (participantId: string) => void;
  kickParticipant: (participantId: string) => void;
  videos: VideoItem[];
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
  uploadVideo: (video: Partial<VideoItem>) => void;
  watchHistory: VideoItem[];
  addToWatchHistory: (video: VideoItem) => void;
  favorites: string[];
  toggleFavorite: (videoId: string) => void;
  streamChatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (streamId: string, text: string, giftId?: string) => void;
  deleteChatMessage: (streamId: string, messageId: string) => void;
  virtualGifts: VirtualGift[];
  sendVirtualGift: (streamId: string, giftId: string) => boolean;
  flyingGifts: Array<{ id: string; gift: VirtualGift; sender: string; timestamp: number }>;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  followedCreators: string[];
  toggleFollowCreator: (creatorId: string) => void;
  reports: ContentReport[];
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  auditLogs: AuditLog[];
  creatorEarnings: CreatorEarningRecord[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [streams, setStreams] = useState<Stream[]>(INITIAL_STREAMS);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['vid-1', 'vid-2']);
  const [watchHistory, setWatchHistory] = useState<VideoItem[]>([INITIAL_VIDEOS[0]]);
  const [followedCreators, setFollowedCreators] = useState<string[]>(['usr-201', 'usr-202']);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [reports, setReports] = useState<ContentReport[]>(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [flyingGifts, setFlyingGifts] = useState<Array<{ id: string; gift: VirtualGift; sender: string; timestamp: number }>>([]);
  
  // Real-time chat messages by streamId
  const [streamChatMessages, setStreamChatMessages] = useState<Record<string, ChatMessage[]>>({
    'stream-1': [
      { id: 'm-1', userId: 'usr-501', userName: 'Kael_FPS', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', text: 'THAT OVERTIME 1v3 WAS INSANE!! 🔥', timestamp: '2m ago' },
      { id: 'm-2', userId: 'usr-502', userName: 'ViperMain', userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', text: 'Team Nova utility usage is world class today', timestamp: '1m ago' },
      { id: 'm-3', userId: 'usr-202', userName: 'Elena Rostova', userAvatar: '/src/assets/images/creator_avatar_streamer_1794476879090.jpg', userRole: 'ContentCreator', text: 'Rooting for Fire Squad to pull the reverse sweep! 🏆', timestamp: 'Just now' },
    ],
    'stream-2': [
      { id: 'm-4', userId: 'usr-601', userName: 'SynthWaveRunner', userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80', text: 'What filter cutoff is that on the Prophet 6? Sounds heavenly.', timestamp: '3m ago' },
      { id: 'm-5', userId: 'usr-602', userName: 'AudioGeek_9', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', text: 'Best coding music on the whole platform hands down 🎧', timestamp: 'Just now' },
    ],
  });

  const [creatorEarnings, setCreatorEarnings] = useState<CreatorEarningRecord[]>([
    {
      id: 'earn-1',
      creatorId: 'usr-101',
      amount: 50.0,
      source: 'virtual_gift',
      platformCommission: 10.0,
      netEarning: 40.0,
      senderName: 'Elena Rostova',
      timestamp: '1h ago',
    },
    {
      id: 'earn-2',
      creatorId: 'usr-101',
      amount: 120.0,
      source: 'subscription',
      platformCommission: 24.0,
      netEarning: 96.0,
      senderName: 'Marcus Brody',
      timestamp: '1d ago',
    },
  ]);

  // Periodic simulated live chat ticker to make the experience genuinely interactive and alive
  useEffect(() => {
    const interval = setInterval(() => {
      const activeId = activeStream?.id || 'stream-1';
      const sampleComments = [
        'The video quality is crystal clear! 🚀',
        'Incredible camera angle!',
        'Let\'s gooooo! 💥',
        'GGWP! Absolutely dominant play',
        'Audio sync is razor sharp today 👌',
        'Huge greetings from Tokyo!',
        'Sent a gift! Keep it up!! 💎',
      ];
      const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      const randomUserNames = ['ApexRider', 'CyberDev', 'LunaStreams', 'PixelMaster', 'NordicByte', 'EchoPilot'];
      const chosenName = randomUserNames[Math.floor(Math.random() * randomUserNames.length)];

      setStreamChatMessages((prev) => {
        const currentList = prev[activeId] || [];
        const newMsg: ChatMessage = {
          id: `sim-${Date.now()}`,
          userId: `sim-user-${Math.floor(Math.random() * 1000)}`,
          userName: chosenName,
          userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${chosenName}`,
          text: randomComment,
          timestamp: 'Just now',
        };
        return {
          ...prev,
          [activeId]: [...currentList.slice(-25), newMsg],
        };
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [activeStream]);

  // Clean up flying gift animations after 4 seconds
  useEffect(() => {
    if (flyingGifts.length === 0) return;
    const timer = setTimeout(() => {
      setFlyingGifts((prev) => prev.filter((g) => Date.now() - g.timestamp < 3500));
    }, 1000);
    return () => clearTimeout(timer);
  }, [flyingGifts]);

  const switchUserRole = (role: UserRole) => {
    const rolePermissionsMap: Record<UserRole, User['permissions']> = {
      SuperAdmin: [
        'stream:broadcast', 'stream:join', 'stream:moderate',
        'meeting:host', 'meeting:join', 'meeting:manage',
        'vod:upload', 'vod:delete', 'chat:send', 'chat:delete',
        'users:ban', 'finance:monetize', 'admin:dashboard'
      ],
      Administrator: [
        'stream:broadcast', 'stream:join', 'stream:moderate',
        'meeting:host', 'meeting:join', 'meeting:manage',
        'vod:upload', 'vod:delete', 'chat:send', 'chat:delete',
        'users:ban', 'admin:dashboard'
      ],
      ContentCreator: [
        'stream:broadcast', 'stream:join', 'stream:moderate',
        'meeting:host', 'meeting:join', 'meeting:manage',
        'vod:upload', 'chat:send', 'finance:monetize'
      ],
      Broadcaster: [
        'stream:broadcast', 'stream:join',
        'meeting:host', 'meeting:join',
        'chat:send', 'finance:monetize'
      ],
      Moderator: [
        'stream:join', 'stream:moderate',
        'meeting:join',
        'chat:send', 'chat:delete', 'users:ban'
      ],
      RegularUser: [
        'stream:join', 'meeting:join', 'chat:send'
      ],
    };

    setCurrentUser((prev) => ({
      ...prev,
      role,
      permissions: rolePermissionsMap[role] || ['stream:join', 'meeting:join', 'chat:send'],
    }));

    // Add audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'ROLE_SWITCHED',
      target: role,
      details: `Switched active role identity to ${role}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateUserCoins = (delta: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      coinsBalance: Math.max(0, prev.coinsBalance + delta),
    }));
  };

  const createStream = (newStreamData: Partial<Stream>): Stream => {
    const stream: Stream = {
      id: `stream-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.displayName,
      creatorAvatar: currentUser.avatarUrl,
      title: newStreamData.title || 'Untitled Live Stream',
      description: newStreamData.description || 'Welcome to my live stream!',
      category: newStreamData.category || 'Technology',
      thumbnailUrl: newStreamData.thumbnailUrl || '/src/assets/images/hero_stream_gaming_1794476876855.jpg',
      streamKey: `live_${Math.random().toString(36).substring(2, 10)}`,
      isLive: false,
      viewerCount: 0,
      peakViewerCount: 0,
      privacy: newStreamData.privacy || 'public',
      resolution: newStreamData.resolution || '1080p',
      fps: 60,
      bitrateKbps: 6000,
      livekitRoomName: `room-${Date.now()}`,
    };

    setStreams((prev) => [stream, ...prev]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'STREAM_CREATED',
      target: stream.id,
      details: `Created stream "${stream.title}" [Privacy: ${stream.privacy}]`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    return stream;
  };

  const toggleLiveBroadcast = (streamId: string) => {
    setStreams((prev) =>
      prev.map((s) => {
        if (s.id === streamId) {
          const nextState = !s.isLive;
          return {
            ...s,
            isLive: nextState,
            startedAt: nextState ? new Date().toISOString() : undefined,
            viewerCount: nextState ? 1 : 0,
          };
        }
        return s;
      })
    );
  };

  const createMeeting = (title: string, passcode = '123456'): Meeting => {
    const meeting: Meeting = {
      id: `meet-${Math.floor(100000 + Math.random() * 900000)}`,
      title: title || 'Quick Conference',
      hostId: currentUser.id,
      hostName: currentUser.displayName,
      passcode,
      isLocked: false,
      waitingRoomEnabled: true,
      allowScreenShare: true,
      allowParticipantUnmute: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      participants: [
        {
          id: `p-${Date.now()}`,
          userId: currentUser.id,
          name: `${currentUser.displayName} (Host)`,
          avatar: currentUser.avatarUrl,
          isHost: true,
          isCoHost: false,
          isMuted: false,
          isVideoOff: false,
          isScreenSharing: false,
          hasHandRaised: false,
          inWaitingRoom: false,
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    setMeetings((prev) => [meeting, ...prev]);
    setActiveMeeting(meeting);
    return meeting;
  };

  const joinMeeting = (meetingId: string): boolean => {
    const target = meetings.find((m) => m.id === meetingId);
    if (!target) return false;

    // Check if user already in participants
    const existing = target.participants.find((p) => p.userId === currentUser.id);
    if (!existing) {
      const newP: MeetingParticipant = {
        id: `p-${Date.now()}`,
        userId: currentUser.id,
        name: currentUser.displayName,
        avatar: currentUser.avatarUrl,
        isHost: currentUser.id === target.hostId,
        isCoHost: false,
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
        hasHandRaised: false,
        inWaitingRoom: target.waitingRoomEnabled && currentUser.id !== target.hostId,
        joinedAt: new Date().toISOString(),
      };

      const updated = {
        ...target,
        participants: [...target.participants, newP],
      };

      setMeetings((prev) => prev.map((m) => (m.id === meetingId ? updated : m)));
      setActiveMeeting(updated);
    } else {
      setActiveMeeting(target);
    }
    return true;
  };

  const leaveMeeting = () => {
    setActiveMeeting(null);
  };

  const toggleParticipantMute = (participantId: string) => {
    if (!activeMeeting) return;
    const updated = {
      ...activeMeeting,
      participants: activeMeeting.participants.map((p) =>
        p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
      ),
    };
    setActiveMeeting(updated);
    setMeetings((prev) => prev.map((m) => (m.id === activeMeeting.id ? updated : m)));
  };

  const toggleParticipantCamera = (participantId: string) => {
    if (!activeMeeting) return;
    const updated = {
      ...activeMeeting,
      participants: activeMeeting.participants.map((p) =>
        p.id === participantId ? { ...p, isVideoOff: !p.isVideoOff } : p
      ),
    };
    setActiveMeeting(updated);
    setMeetings((prev) => prev.map((m) => (m.id === activeMeeting.id ? updated : m)));
  };

  const toggleHandRaise = (participantId: string) => {
    if (!activeMeeting) return;
    const updated = {
      ...activeMeeting,
      participants: activeMeeting.participants.map((p) =>
        p.id === participantId ? { ...p, hasHandRaised: !p.hasHandRaised } : p
      ),
    };
    setActiveMeeting(updated);
  };

  const admitParticipant = (participantId: string) => {
    if (!activeMeeting) return;
    const updated = {
      ...activeMeeting,
      participants: activeMeeting.participants.map((p) =>
        p.id === participantId ? { ...p, inWaitingRoom: false } : p
      ),
    };
    setActiveMeeting(updated);
    setMeetings((prev) => prev.map((m) => (m.id === activeMeeting.id ? updated : m)));
  };

  const kickParticipant = (participantId: string) => {
    if (!activeMeeting) return;
    const updated = {
      ...activeMeeting,
      participants: activeMeeting.participants.filter((p) => p.id !== participantId),
    };
    setActiveMeeting(updated);
    setMeetings((prev) => prev.map((m) => (m.id === activeMeeting.id ? updated : m)));
  };

  const uploadVideo = (videoData: Partial<VideoItem>) => {
    const video: VideoItem = {
      id: `vid-${Date.now()}`,
      title: videoData.title || 'Untitled Upload',
      description: videoData.description || '',
      thumbnailUrl: videoData.thumbnailUrl || '/src/assets/images/vod_cyber_chronicles_1794476877662.jpg',
      videoUrl: videoData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 480,
      creatorId: currentUser.id,
      creatorName: currentUser.displayName,
      creatorAvatar: currentUser.avatarUrl,
      category: videoData.category || 'Technology',
      genre: videoData.genre || 'Originals',
      views: 1,
      likes: 0,
      rating: 5.0,
      publishedAt: new Date().toISOString(),
      resolutions: ['1080p', '720p', '480p'],
      tags: videoData.tags || ['OmniStream'],
    };

    setVideos((prev) => [video, ...prev]);
  };

  const addToWatchHistory = (video: VideoItem) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((v) => v.id !== video.id);
      return [video, ...filtered].slice(0, 10);
    });
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  const sendChatMessage = (streamId: string, text: string, giftId?: string) => {
    if (!text.trim() && !giftId) return;

    let attachedGift;
    if (giftId) {
      const g = VIRTUAL_GIFTS.find((item) => item.id === giftId);
      if (g) {
        attachedGift = {
          id: g.id,
          name: g.name,
          icon: g.icon,
          coinValue: g.coinValue,
        };
      }
    }

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      streamId,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role,
      text: text.trim(),
      timestamp: 'Just now',
      gift: attachedGift,
    };

    setStreamChatMessages((prev) => ({
      ...prev,
      [streamId]: [...(prev[streamId] || []), msg],
    }));
  };

  const deleteChatMessage = (streamId: string, messageId: string) => {
    setStreamChatMessages((prev) => ({
      ...prev,
      [streamId]: (prev[streamId] || []).map((m) =>
        m.id === messageId ? { ...m, isDeleted: true, text: '[Message deleted by moderator]' } : m
      ),
    }));
  };

  const sendVirtualGift = (streamId: string, giftId: string): boolean => {
    const gift = VIRTUAL_GIFTS.find((g) => g.id === giftId);
    if (!gift) return false;

    if (currentUser.coinsBalance < gift.coinValue) {
      return false; // Not enough coins
    }

    // Deduct coins
    updateUserCoins(-gift.coinValue);

    // Add flying animation instance
    const animationId = `fly-${Date.now()}-${Math.random()}`;
    setFlyingGifts((prev) => [
      ...prev,
      { id: animationId, gift, sender: currentUser.displayName, timestamp: Date.now() },
    ]);

    // Send chat alert
    sendChatMessage(streamId, `Sent ${gift.name} ${gift.icon}!`, giftId);

    // Record creator earning (20% platform commission, 80% to broadcaster)
    const stream = streams.find((s) => s.id === streamId);
    const gross = (gift.coinValue * 0.05); // e.g. 1 coin = $0.05
    const commission = gross * 0.2;
    const net = gross * 0.8;

    const earning: CreatorEarningRecord = {
      id: `earn-${Date.now()}`,
      creatorId: stream?.creatorId || 'usr-broadcaster',
      amount: gross,
      source: 'virtual_gift',
      platformCommission: commission,
      netEarning: net,
      senderName: currentUser.displayName,
      timestamp: 'Just now',
    };
    setCreatorEarnings((prev) => [earning, ...prev]);

    return true;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleFollowCreator = (creatorId: string) => {
    setFollowedCreators((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: action === 'resolved' ? 'REPORT_RESOLVED' : 'REPORT_DISMISSED',
      target: reportId,
      details: `Moderator set report status to ${action}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PlatformContext.Provider
      value={{
        currentUser,
        switchUserRole,
        updateUserCoins,
        streams,
        activeStream,
        setActiveStream,
        createStream,
        toggleLiveBroadcast,
        meetings,
        activeMeeting,
        setActiveMeeting,
        createMeeting,
        joinMeeting,
        leaveMeeting,
        toggleParticipantMute,
        toggleParticipantCamera,
        toggleHandRaise,
        admitParticipant,
        kickParticipant,
        videos,
        activeVideo,
        setActiveVideo,
        uploadVideo,
        watchHistory,
        addToWatchHistory,
        favorites,
        toggleFavorite,
        streamChatMessages,
        sendChatMessage,
        deleteChatMessage,
        virtualGifts: VIRTUAL_GIFTS,
        sendVirtualGift,
        flyingGifts,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        followedCreators,
        toggleFollowCreator,
        reports,
        resolveReport,
        auditLogs,
        creatorEarnings,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
