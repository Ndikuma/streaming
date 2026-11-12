# OmniStream Deployment & Operations Guide

## 1. Target Infrastructure

- **Operating System**: Ubuntu Linux 24.04 LTS
- **Reverse Proxy**: Nginx with HTTP/2 and TLS termination
- **Container Orchestration**: Docker & Docker Compose
- **Datastores**: PostgreSQL 16 & Redis 7
- **Media Engine**: LiveKit Server & MediaMTX

---

## 2. Docker Compose Topology (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  omnistream-api:
    image: omnistream/api:latest
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=omnistream;Username=omni_admin;Password=SecretPassword
      - Redis__Configuration=redis:6379
      - LiveKit__ApiKey=API_KEY
      - LiveKit__ApiSecret=API_SECRET
      - LiveKit__Url=ws://livekit:7880
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
      - livekit

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: omnistream
      POSTGRES_USER: omni_admin
      POSTGRES_PASSWORD: SecretPassword
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  livekit:
    image: livekit/livekit-server:latest
    ports:
      - "7880:7880"
      - "7881:7881"
      - "7882:7882/udp"
    volumes:
      - ./infrastructure/livekit/livekit.yaml:/etc/livekit.yaml

  mediamtx:
    image: bluenviron/mediamtx:latest
    ports:
      - "1935:1935" # RTMP
      - "8888:8888" # HLS
      - "8889:8889" # WebRTC
    volumes:
      - ./infrastructure/mediamtx/mediamtx.yml:/mediamtx.yml

volumes:
  pgdata:
```

---

## 3. Nginx Reverse Proxy Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name stream.omnistream.io;

    ssl_certificate /etc/letsencrypt/live/stream.omnistream.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stream.omnistream.io/privkey.pem;

    # Application REST API and Web App
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # LiveKit WebRTC Signaling WebSocket
    location /livekit/ {
        proxy_pass http://localhost:7880/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```
