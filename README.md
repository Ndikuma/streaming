# OmniStream - Next-Generation Hybrid Video Streaming Platform

OmniStream is a production-grade, unified multimedia streaming platform combining the best of **YouTube Live**, **TikTok Live**, **Zoom**, and **Netflix** in one high-performance architecture.

---

## 🌟 Core Feature Modules

### 🎥 Module A: User Management & Multi-Role RBAC
- Multi-role permission system: `Super Administrator`, `Administrator`, `Content Creator`, `Broadcaster`, `Moderator`, `Regular User`.
- Fine-grained permission assignments (`stream:broadcast`, `meeting:host`, `chat:delete`, `users:ban`).
- Real-time identity role switcher with audit log tracking.

### 🎙️ Module B: Professional Live Studio
- In-browser live broadcasting using real `navigator.mediaDevices.getUserMedia` video and microphone capture.
- Real-time Web Audio API VU decibel level meter.
- Live screen and window sharing via `getDisplayMedia`.
- Resolution controls (1080p, 720p, 480p) and FPS switches (60/30 FPS).
- External OBS / RTMP ingest credentials for MediaMTX integration.
- Embedded broadcaster chat monitor and guest co-host invitations.

### 📺 Module C: Spectator Live Viewer
- Adaptive video playback with resolution switcher (1080p, 720p, 480p).
- Fullscreen and Picture-in-Picture support.
- Channel follower management with live status notifications.
- Integrated report flagging modal.

### 💖 Module D: Interactive Live Gifting & Chat
- TikTok-style floating neon hearts reaction canvas.
- High-impact animated virtual gifts (Ruby Rose, Neon Heart, Diamond Spark, Super Rocket, Galaxy Crown, Mythic Fireworks).
- Real-time chat feed with role badges and moderator message deletion.

### 🤝 Module E: Video Conferencing (Zoom Experience)
- Multi-party encrypted video conference rooms with ID and Passcode security.
- Participant gallery grid with real camera and screen share streams.
- Waiting room gatekeeper with host Admit / Kick controls.
- Raise hand gesture indicator, mute all, and in-call chat.

### 🍿 Module F: Video on Demand (Netflix Experience)
- Cinematic Hero billboard with 4K badge and trailer preview.
- Dynamic category rows (Trending, Sci-Fi Thrillers, Nature & Wildlife, Esports).
- Custom video player with interactive timeline scrubber, volume slider, playback speeds (0.5x to 2x), and PiP.
- Automatic watch history tracking and favorites watchlist.
- Asynchronous video upload portal.

### 🔔 Module G: Real-Time Notifications
- Live broadcast started pings, meeting invitations, follower alerts, and gift notices.

### 🛡️ Module H: Moderation & Security Suite
- Incident reports queue with sanction workflows (Resolved / Dismissed).
- Immutable security audit logs recording every privileged event.

### 💎 Module I: Monetization & Creator Revenue
- Virtual coin wallet and instant checkout store.
- Creator revenue dashboard with 20% platform commission calculation and payout ledger.
- Channel subscription tiers (Bronze, Silver, VIP Gold).

---

## 🏗️ Architecture & Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md): System decomposition, decoupled media plane vs control plane.
- [DATABASE.md](DATABASE.md): PostgreSQL normalized schema and DDL.
- [API.md](API.md): Versioned REST API and SignalR Hub specifications.
- [STREAMING.md](STREAMING.md): LiveKit WebRTC SFU, MediaMTX RTMP, and FFmpeg transcoding pipelines.
- [DEPLOYMENT.md](DEPLOYMENT.md): Docker Compose, Nginx reverse proxy, and Ubuntu Linux setup.
- [SECURITY.md](SECURITY.md): RBAC, zero-trust media tokens, and E2EE encryption.
- [DEVELOPMENT.md](DEVELOPMENT.md): Setup and running guidelines.
