# OmniStream Security Architecture & Hardening

## 1. Principles of Security

1. **Zero-Trust Media Tokens**: Clients never receive master LiveKit or MediaMTX credentials. All access tokens are signed on the backend using HMAC-SHA256 with 10-minute validity.
2. **Multi-Role & Granular RBAC**: Broadcasters and moderators have specific claim sets (`stream:broadcast`, `chat:delete`, `users:ban`).
3. **Idempotent Financial Operations**: Virtual gift transactions and subscriptions use idempotency keys to prevent double-spending.
4. **End-to-End Media Encryption (E2EE)**: WebRTC Insertable Streams encrypt audio and video frames directly in the browser using AES-GCM before transmitting to the SFU.
5. **Audit Trail**: All administrative and moderation actions are logged to immutable `audit_logs` in PostgreSQL.

---

## 2. Rate Limiting Policy

- Authentication endpoints: 5 requests / minute per IP.
- Live chat messages: 3 messages / second per user.
- Gift transactions: 1 request / 500ms per user.
- Video upload initiations: 10 uploads / hour per creator.
