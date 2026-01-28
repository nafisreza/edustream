# EduStream Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- Docker Desktop
- npm

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd edustream
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB and LiveKit with Docker Compose

Start all services (MongoDB + LiveKit):
```bash
docker-compose up -d
```

Verify services are running:
```bash
docker ps
```

You should see `edustream-mongodb` and `edustream-livekit` containers running.

### 4. Build Shared Packages

The types package needs to be built before running the app:
```bash
npx turbo build
```

Or build just the types package:
```bash
cd packages/types
npm run build
cd ../..
```

### 5. Configure Environment Variables

**Backend (.env):**
Navigate to `apps/server/` and create a `.env` file (or copy from `.env.example`):
```bash
cp apps/server/.env.example apps/server/.env
```

The default configuration should work:
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/edustream

JWT_SECRET=edustream-super-secret-jwt-key-2026
JWT_EXPIRES_IN=7d

GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=devkey
LIVEKIT_URL=http://localhost:7880

ALLOWED_ORIGINS=http://localhost:3000
```

**Important:** Update `GMAIL_USER` and `GMAIL_APP_PASSWORD` with your Gmail credentials for password reset emails. See [Gmail SMTP Setup](#gmail-smtp-setup) below.

**Frontend (.env.local):**
Navigate to `apps/web/` and create `.env.local`:
```bash
cd apps/web
```
Create `.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 6. Run the Application

From the root directory:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### 7. Stop Services (when needed)

```bash
docker-compose down
```

### 8. Start Services Again

```bash
docker-compose up -d
```

### 9. Remove All Data (if needed)

```bash
docker-compose down -v
```

---

## Gmail SMTP Setup

For password reset emails to work:

1. **Create/Use Gmail Account** for your app
2. **Enable 2FA**: https://myaccount.google.com/security
3. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (custom name)"
   - Name it "EduStream"
   - Copy the 16-character password
4. **Update `.env`**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

---

## Troubleshooting

### Port 5000 already in use
Kill the process using port 5000:
```powershell
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### MongoDB connection failed
Check if services are running:
```bash
docker-compose ps
```

Check MongoDB logs:
```bash
docker logs edustream-mongodb
```

Check LiveKit logs:
```bash
docker logs edustream-livekit
```

### Can't connect to backend from frontend
Make sure:
1. Backend is running on port 5000
2. `.env.local` in `apps/web/` has `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. CORS is configured correctly in backend

## First Time Usage

1. Go to http://localhost:3000
2. Click "Sign Up" and create an account
3. Login with your credentials
4. Click "Create Room" to start a classroom session
5. Share the Room ID with students to join

## Development

- Frontend: `apps/web/`
- Backend: `apps/server/`
- Shared types: `packages/types/`

To work on a specific package:
```bash
cd apps/web
npm run dev
```
