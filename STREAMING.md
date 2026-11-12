# OmniStream Media & Streaming Infrastructure

## 1. Core Streaming Architecture

OmniStream implements a hybrid real-time media topology utilizing **LiveKit** for WebRTC low-latency streaming and **MediaMTX** for multi-protocol ingestion.

```
       [Webcam / Browser Client]
                   |
                (WebRTC)
                   v
          +-----------------+
          |   LiveKit SFU   | <--- Real-time low-latency distribution (<300ms)
          +-----------------+
                   ^
                   | WebRTC Ingestion
          +-----------------+
          |    MediaMTX     | <--- RTMP Ingestion (e.g. OBS Studio, vMix)
          +-----------------+
                   |
                   v (HLS Transmux)
          +-----------------+
          |  HLS Edge CDN   | <--- Mass broadcast playback
          +-----------------+
```

---

## 2. LiveKit SFU (Selective Forwarding Unit)

- **Protocol**: WebRTC (UDP/TCP fallback via TURN).
- **Simulcast**: Broadcasters publish 3 quality layers:
  - High: 1080p @ 60fps (4,500 - 8,500 kbps)
  - Medium: 720p @ 30fps (1,500 - 2,500 kbps)
  - Low: 360p @ 30fps (400 - 600 kbps)
- **Token Generation**: Generated exclusively on the ASP.NET Core backend with short expiry (10 minutes) and specific room grants (`canPublish`, `canSubscribe`, `hiddenParticipant`).

---

## 3. MediaMTX (RTMP to WebRTC / HLS Bridge)

`mediamtx.yml` configuration:
```yaml
paths:
  live:
    source: publisher
    runOnInit: ""
    runOnPublish: "curl -X POST http://backend:5000/api/v1/media/on-publish -d stream=$MTX_PATH"
    runOnPublishRestart: yes
    runOnUnpublish: "curl -X POST http://backend:5000/api/v1/media/on-unpublish -d stream=$MTX_PATH"
```

---

## 4. Asynchronous Video Processing with FFmpeg

Background worker queue converts uploaded raw video to multi-bitrate HLS:
```bash
ffmpeg -i input.mp4 \
  -filter_complex \
  "[0:v]split=3[v1][v2][v3]; \
   [v1]scale=w=1920:h=1080[v1out]; \
   [v2]scale=w=1280:h=720[v2out]; \
   [v3]scale=w=854:h=480[v3out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 5000k -maxrate:v:0 5350k -bufsize:v:0 7500k \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 2800k -maxrate:v:1 2996k -bufsize:v:1 4200k \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 1400k -maxrate:v:2 1498k -bufsize:v:2 2100k \
  -map a:0 -c:a aac -b:a 192k -ac 2 \
  -f hls \
  -hls_time 4 \
  -hls_playlist_type vod \
  -master_pl_name master.m3u8 \
  -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
  output_%v/manifest.m3u8
```
