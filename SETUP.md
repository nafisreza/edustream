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

### 3. Set Up MongoDB with Docker

Run MongoDB in a Docker container:
```bash
docker run -d \
  --name edustream-mongo \
  -p 27017:27017 \
  -v edustream-data:/data/db \
  mongo:latest
```

**For Windows PowerShell:**
```powershell
docker run -d `
  --name edustream-mongo `
  -p 27017:27017 `
  -v edustream-data:/data/db `
  mongo:latest
```

Verify MongoDB is running:
```bash
docker ps
```

You should see `edustream-mongo` in the list.

### 4. Configure Environment Variables

**Backend (.env):**
Navigate to `apps/server/` and create a `.env` file (or copy from `.env.example`):
```bash
cp apps/server/.env.example apps/server/.env
```

The default configuration should work:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edustream
JWT_SECRET=edustream-super-secret-jwt-key-2026
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend (.env.local):**
Navigate to `apps/web/` and create `.env.local`:
```bash
cd apps/web
```
Create `.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 5. Run the Application

From the root directory:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### 6. Stop MongoDB (when needed)

```bash
docker stop edustream-mongo
```

### 7. Start MongoDB again

```bash
docker start edustream-mongo
```

### 8. Remove MongoDB container (if needed)

```bash
docker stop edustream-mongo
docker rm edustream-mongo
docker volume rm edustream-data
```

## Troubleshooting

### Port 5000 already in use
Kill the process using port 5000:
```powershell
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### MongoDB connection failed
Check if MongoDB is running:
```bash
docker ps
```

Check MongoDB logs:
```bash
docker logs edustream-mongo
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
