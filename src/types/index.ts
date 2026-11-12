export type UserRole =
  | 'SuperAdmin'
  | 'Administrator'
  | 'ContentCreator'
  | 'Broadcaster'
  | 'Moderator'
  | 'RegularUser';

export type UserPermission =
  | 'stream:broadcast'
  | 'stream:join'
  | 'stream:moderate'
  | 'meeting:host'
  | 'meeting:join'
  | 'meeting:manage'
  | 'vod:upload'
  | 'vod:delete'
  | 'chat:send'
  | 'chat:delete'
  | 'users:ban'
  | 'finance:monetize'
  | 'admin:dashboard';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  permissions: UserPermission[];
  bio: string;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isSuspended: boolean;
  coinsBalance: number;
  earningsBalance: number;
  createdAt: string;
}

export type StreamPrivacy = 'public' | 'private' | 'unlisted' | 'subscribers_only';

export interface Stream {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  streamKey: string;
  isLive: boolean;
  viewerCount: number;
  peakViewerCount: number;
  privacy: StreamPrivacy;
  startedAt?: string;
  resolution: '1080p' | '720p' | '480p';
  fps: number;
  bitrateKbps: number;
  livekitRoomName: string;
}

export interface ChatMessage {
  id: string;
  streamId?: string;
  meetingId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole?: UserRole;
  text: string;
  timestamp: string;
  isDeleted?: boolean;
  gift?: {
    id: string;
    name: string;
    icon: string;
    coinValue: number;
  };
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  coinValue: number;
  description: string;
  animationType: 'hearts' | 'rocket' | 'crown' | 'fireworks' | 'diamond';
}

export interface MeetingParticipant {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isCoHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  hasHandRaised: boolean;
  inWaitingRoom: boolean;
  joinedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  scheduledTime?: string;
  passcode: string;
  isLocked: boolean;
  waitingRoomEnabled: boolean;
  allowScreenShare: boolean;
  allowParticipantUnmute: boolean;
  participants: MeetingParticipant[];
  isActive: boolean;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  category: string;
  genre: string;
  views: number;
  likes: number;
  rating: number; // 1-5
  publishedAt: string;
  hlsPlaylistUrl?: string;
  resolutions: string[];
  tags: string[];
}

export interface WatchProgress {
  videoId: string;
  timestamp: number;
  duration: number;
  lastWatchedAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'live' | 'meeting' | 'gift' | 'follower' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'stream' | 'video' | 'chat' | 'user';
  targetId: string;
  targetTitle: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  details: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface CreatorEarningRecord {
  id: string;
  creatorId: string;
  amount: number;
  source: 'virtual_gift' | 'subscription' | 'pay_per_view' | 'donation';
  platformCommission: number;
  netEarning: number;
  senderName: string;
  timestamp: string;
}
