# EduStream Server

Backend server for EduStream virtual classroom platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **WebRTC**: LiveKit (recommended) or mediasoup

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your values.

3. **Start MongoDB** (Docker):
   ```bash
   docker run -d -p 27017:27017 --name edustream-mongo mongo:latest
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm run type-check` - Check TypeScript types

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token (protected)

### Rooms
- `POST /api/rooms/create` - Create new room (protected)
- `GET /api/rooms/:id` - Get room details (protected)
- `POST /api/rooms/:id/join` - Join room (protected)
- `DELETE /api/rooms/:id` - Close room (protected, host only)

## Socket.io Events

### Client → Server
- `join-room` - Join a room
- `leave-room` - Leave a room
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `ice-candidate` - Exchange ICE candidates
- `raise-hand` - Raise hand
- `mute-all` - Mute all participants (host only)
- `kick-user` - Remove participant (host only)
- `whiteboard-draw` - Send drawing data
- `send-message` - Send chat message

### Server → Client
- `user-joined` - New user joined room
- `user-left` - User left room
- `room-participants` - List of participants
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `ice-candidate` - Receive ICE candidate
- `hand-raised` - Participant raised hand
- `muted-by-host` - Host muted all
- `kicked-from-room` - Removed from room
- `whiteboard-draw` - Receive drawing data
- `receive-message` - Receive chat message

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── sockets/         # Socket.io handlers
├── utils/           # Utility functions
└── index.ts         # Entry point
```
