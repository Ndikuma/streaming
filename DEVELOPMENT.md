# OmniStream Development Guide

## 1. Local Development Setup

### Prerequisites
- Node.js 20+ / 22+
- Docker & Docker Compose
- .NET 10 SDK (for C# microservices)

### Getting Started
```bash
# Clone the repository
git clone https://github.com/omnistream/omnistream.git
cd omnistream

# Install dependencies
npm install

# Start the full development stack
npm run dev
```

The unified frontend application and dev environment will launch on `http://localhost:3000`.

### Building and Verification
```bash
# Type check and linting
npm run lint

# Production bundle build
npm run build
```
