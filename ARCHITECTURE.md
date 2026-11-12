# OmniStream Architecture Documentation

## 1. System Overview & Philosophy

OmniStream is a production-grade, next-generation hybrid video streaming platform uniting four primary media paradigms into one cohesive ecosystem:
- **YouTube Live**: Low-latency public broadcasting, RTMP/WebRTC ingestion, and scheduled sessions.
- **TikTok Live**: Interactive real-time streams with low-latency chat, virtual gifts, floating animated reactions, and creator tips.
- **Zoom**: Multi-party video conferencing, gallery grid layouts, screen sharing, waiting rooms, and host controls.
- **Netflix**: High-definition video-on-demand (VOD), multi-resolution adaptive streaming (HLS), category catalog, and watch history.

## 2. Decoupled Media vs. Business Control Plane

A foundational architectural rule of OmniStream is that **the web/application backend (ASP.NET Core / Node) NEVER proxies high-throughput audio and video data**.

```
+-------------------------------------------------------------+
|                      CLIENT APPLICATIONS                    |
|        (Browser Blazor/React, Mobile Apps, OBS Studio)      |
+------------------------------+------------------------------+
                               |
            Control & Auth     |     Real-Time Media Streams
            (REST / WS)        |     (WebRTC / RTMP / HLS)
                               v
+------------------------------+------------------------------+
|     APPLICATION SERVER       |      MEDIA INFRASTRUCTURE    |
|   - Authentication (JWT)     |   - LiveKit SFU (WebRTC)     |
|   - Authorization (RBAC)     |   - MediaMTX (RTMP/HLS)      |
|   - Room & Token Generation  |   - FFmpeg Transcoding Worker|
|   - Monetization & Ledger    |   - S3-Compatible Object Store|
|   - PostgreSQL & Redis Cache |                              |
+------------------------------+------------------------------+
```

### Media Flow
1. **Live Broadcasts**:
   - Web browser cameras transmit directly to **LiveKit SFU** via WebRTC.
   - External broadcasting software (e.g. OBS Studio) streams RTMP directly to **MediaMTX**.
   - MediaMTX converts RTMP to WebRTC for sub-500ms interactive playback and packages HLS for broad CDN delivery.
2. **Video Conferences**:
   - Multi-party peer-to-SFU connections via LiveKit rooms with simulcast enabled (1080p, 720p, 360p).
3. **Video on Demand (VOD)**:
   - User uploads video files to an S3-compatible staging bucket.
   - Background FFmpeg workers trigger adaptive bitrate HLS packaging (Master playlist + 1080p, 720p, 480p variants).

## 3. Modular Monolith Backend Structure

The backend is structured as a Modular Monolith in C# / ASP.NET Core:

```
HybridStreaming/
|-- src/
|   |-- HybridStreaming.Domain/        # Core entities, value objects, domain events
|   |-- HybridStreaming.Application/   # Use cases, CQRS commands/queries, validation
|   |-- HybridStreaming.Infrastructure/ # EF Core, PostgreSQL, Redis, LiveKit SDK
|   |-- HybridStreaming.Api/           # REST endpoints, SignalR hubs, OpenAPI
|   |-- HybridStreaming.Media/         # LiveKit token generator, MediaMTX webhooks
|   |-- HybridStreaming.Workers/       # FFmpeg video transcoding background services
|   |-- HybridStreaming.Web/           # Frontend client application
|-- tests/
|   |-- HybridStreaming.UnitTests/     # Domain and business logic unit tests
|   |-- HybridStreaming.IntegrationTests/ # API and database integration tests
|-- infrastructure/
|   |-- docker/
|   |-- nginx/
|   |-- mediamtx/
|   |-- livekit/
```
