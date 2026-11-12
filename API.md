# OmniStream REST & SignalR API Specification

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Creates a new platform user account.
```json
// Request
{
  "username": "creator_alex",
  "email": "alex@omnistream.io",
  "password": "SecurePassword123!",
  "displayName": "Alex Vance"
}

// Response: 201 Created
{
  "userId": "d7a12b3c-91f8-4e92-9112-a1b2c3d4e5f6",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "7f8b9a1c-...",
  "expiresIn": 3600
}
```

### `POST /api/v1/auth/login`
Authenticates a user and returns a signed JWT.
```json
// Request
{
  "email": "alex@omnistream.io",
  "password": "SecurePassword123!"
}
```

---

## 2. Live Broadcasts (`/api/v1/streams`)

### `POST /api/v1/streams`
Registers a new live broadcast session and initializes a LiveKit room.
```json
// Request
{
  "title": "VALORANT World Finals Multi-Cam",
  "description": "Live coverage with interactive cast",
  "category": "Esports",
  "privacy": "public",
  "resolution": "1080p",
  "fps": 60
}

// Response: 201 Created
{
  "streamId": "str-48201",
  "livekitRoom": "room-esports-finals",
  "livekitToken": "eyJhbGci...",
  "rtmpIngestUrl": "rtmp://stream.omnistream.io/live",
  "streamKey": "live_esports_77192a8b"
}
```

### `POST /api/v1/streams/{id}/start`
Signals that the broadcaster has begun transmitting.

### `POST /api/v1/streams/{id}/stop`
Ends the broadcast, triggers recording archiver worker.

### `POST /api/v1/streams/{id}/join`
Issues a spectator LiveKit token with subscribe-only permissions.

---

## 3. Video Conferencing (`/api/v1/meetings`)

### `POST /api/v1/meetings`
Creates an encrypted multi-party conference.
```json
// Request
{
  "title": "Architecture Sync",
  "passcode": "882041",
  "waitingRoomEnabled": true,
  "allowScreenShare": true
}
```

### `POST /api/v1/meetings/{id}/join`
Verifies passcode and returns participant connection token.

---

## 4. Video on Demand (`/api/v1/videos`)

### `POST /api/v1/videos/upload`
Initiates multipart presigned upload to S3.

### `GET /api/v1/videos/{id}/playback`
Returns HLS Master playlist URL and resolution variants.

---

## 5. SignalR Real-Time Hubs

- `/hubs/stream-chat`: Real-time chat messages, message deletion, user timeout, and virtual gifts.
- `/hubs/meeting`: Real-time conference events (hands raised, participant mute toggles, waiting room admission).
- `/hubs/notifications`: Real-time in-app alerts and push pings.
