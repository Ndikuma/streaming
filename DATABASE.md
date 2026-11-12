# OmniStream Database Architecture

This document describes the normalized PostgreSQL schema, Entity Framework Core models, relationships, and indexing strategies.

## 1. Schema Diagram & Entity Relationships

The schema is divided into 6 logical domains:
1. **Identity & Security**: `Users`, `UserProfiles`, `Roles`, `Permissions`, `UserRoles`, `AuditLogs`.
2. **Live Streaming**: `Streams`, `StreamCategories`, `StreamParticipants`, `StreamViewers`, `StreamRecordings`.
3. **Conferencing**: `Meetings`, `MeetingParticipants`, `MeetingRecordings`.
4. **Video on Demand**: `Videos`, `VideoCategories`, `VideoTags`, `VideoPlaylists`, `VideoWatchHistory`, `VideoFavorites`.
5. **Real-Time Interaction**: `ChatMessages`, `Reactions`, `VirtualGifts`, `Followers`, `Notifications`.
6. **Governance & Monetization**: `Reports`, `ModerationActions`, `Subscriptions`, `Payments`, `CreatorEarnings`.

---

## 2. PostgreSQL DDL (Data Definition Language)

```sql
-- 1. Identity & RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'RegularUser',
    is_verified BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    coins_balance INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0
);

CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, permission_name)
);

-- 2. Live Broadcasts
CREATE TABLE streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    thumbnail_url TEXT,
    stream_key VARCHAR(100) UNIQUE NOT NULL,
    livekit_room_name VARCHAR(100) UNIQUE NOT NULL,
    is_live BOOLEAN DEFAULT FALSE,
    privacy VARCHAR(30) DEFAULT 'public',
    resolution VARCHAR(20) DEFAULT '1080p',
    fps INT DEFAULT 60,
    bitrate_kbps INT DEFAULT 6000,
    viewer_count INT DEFAULT 0,
    peak_viewer_count INT DEFAULT 0,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streams_is_live ON streams(is_live) WHERE is_live = TRUE;
CREATE INDEX idx_streams_creator ON streams(creator_id);

-- 3. Video Conferences
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    passcode VARCHAR(20) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    waiting_room_enabled BOOLEAN DEFAULT TRUE,
    allow_screen_share BOOLEAN DEFAULT TRUE,
    allow_participant_unmute BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_host BOOLEAN DEFAULT FALSE,
    is_co_host BOOLEAN DEFAULT FALSE,
    in_waiting_room BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ
);

-- 4. Video on Demand (VOD)
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    genre VARCHAR(100),
    thumbnail_url TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    views_count BIGINT DEFAULT 0,
    likes_count INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    hls_master_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE video_watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    progress_seconds INT NOT NULL DEFAULT 0,
    last_watched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- 5. Virtual Gifts & Monetization
CREATE TABLE virtual_gifts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coin_value INT NOT NULL,
    icon VARCHAR(20) NOT NULL,
    animation_type VARCHAR(50) NOT NULL
);

CREATE TABLE creator_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL,
    platform_commission NUMERIC(12, 2) NOT NULL,
    net_earning NUMERIC(12, 2) NOT NULL,
    source VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Audit & Moderation
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
```
