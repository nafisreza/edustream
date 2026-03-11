import express, { Application } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import roomRoutes from './routes/room.routes';
import recordingRoutes from './routes/recording.routes';
import { initializeSocketHandlers } from './sockets';

// Load environment variables
dotenv.config();

const app: Application = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduStream server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/recordings', recordingRoutes);

// Serve recording files (host-only access is enforced via the download route)
const recordingsDir = process.env.RECORDINGS_DIR || path.join(process.cwd(), 'recordings');
fs.mkdirSync(recordingsDir, { recursive: true });

// Initialize Socket.io handlers
initializeSocketHandlers(io);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

export { io };
