import { Server as SocketIOServer, Socket } from 'socket.io';
import { Room } from '../models/Room.model';

interface RoomState {
  roomId: string;
  participants: Map<string, ParticipantInfo>;
}

interface ParticipantInfo {
  socketId: string;
  userId: string;
  name: string;
  role: 'host' | 'participant';
}

// Store active rooms and their participants
const activeRooms = new Map<string, RoomState>();

export const initializeSocketHandlers = (io: SocketIOServer): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join room
    socket.on('join-room', ({ roomId, userId, name, role }) => {
      console.log(`📥 Join room request: ${name} → ${roomId}`);

      // Join socket.io room
      socket.join(roomId);

      // Initialize room state if not exists
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          roomId,
          participants: new Map(),
        });
      }

      const room = activeRooms.get(roomId)!;
      room.participants.set(userId, {
        socketId: socket.id,
        userId,
        name,
        role,
      });

      // Notify others in the room
      socket.to(roomId).emit('user-joined', {
        userId,
        name,
        role,
      });

      // Send current participants to the new user
      const participants = Array.from(room.participants.values()).map((p) => ({
        userId: p.userId,
        name: p.name,
        role: p.role,
      }));

      socket.emit('room-participants', participants);

      console.log(`${name} joined room ${roomId}. Total participants: ${room.participants.size}`);
    });

    // Leave room
    socket.on('leave-room', ({ roomId, userId }) => {
      handleLeaveRoom(socket, roomId, userId);
    });

    // WebRTC signaling events
    socket.on('offer', ({ roomId, targetUserId, offer }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const targetParticipant = room.participants.get(targetUserId);
        if (targetParticipant) {
          io.to(targetParticipant.socketId).emit('offer', {
            offer,
            fromUserId: getUserIdBySocketId(socket.id, roomId),
          });
        }
      }
    });

    socket.on('answer', ({ roomId, targetUserId, answer }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const targetParticipant = room.participants.get(targetUserId);
        if (targetParticipant) {
          io.to(targetParticipant.socketId).emit('answer', {
            answer,
            fromUserId: getUserIdBySocketId(socket.id, roomId),
          });
        }
      }
    });

    socket.on('ice-candidate', ({ roomId, targetUserId, candidate }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const targetParticipant = room.participants.get(targetUserId);
        if (targetParticipant) {
          io.to(targetParticipant.socketId).emit('ice-candidate', {
            candidate,
            fromUserId: getUserIdBySocketId(socket.id, roomId),
          });
        }
      }
    });

    // Classroom management events
    socket.on('raise-hand', ({ roomId, userId, name }) => {
      socket.to(roomId).emit('hand-raised', { userId, name });
    });

    socket.on('lower-hand', ({ roomId, userId, name }) => {
      socket.to(roomId).emit('hand-lowered', { userId, name });
    });

    socket.on('mute-all', ({ roomId }) => {
      socket.to(roomId).emit('muted-by-host');
    });

    socket.on('mute-user', ({ roomId, targetUserId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const targetParticipant = room.participants.get(targetUserId);
        if (targetParticipant) {
          io.to(targetParticipant.socketId).emit('muted-by-host');
        }
      }
    });

    socket.on('kick-user', ({ roomId, targetUserId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const targetParticipant = room.participants.get(targetUserId);
        if (targetParticipant) {
          io.to(targetParticipant.socketId).emit('kicked-from-room');
          handleLeaveRoom(socket, roomId, targetUserId);
        }
      }
    });

    // End meeting — host only: mark room inactive in DB, evict all participants
    socket.on('end-meeting', async ({ roomId }) => {
      try {
        await Room.findOneAndUpdate({ roomId }, { isActive: false });
      } catch (err) {
        console.error('Failed to mark room inactive:', err);
      }

      // Notify all OTHER participants to leave
      socket.to(roomId).emit('meeting-ended');

      // Clean up socket room state
      const activeRoom = activeRooms.get(roomId);
      if (activeRoom) {
        activeRooms.delete(roomId);
      }

      console.log(`🔴 Meeting ${roomId} ended by host`);
    });

    // Whiteboard events
    socket.on('whiteboard-draw', ({ roomId, drawData }) => {
      socket.to(roomId).emit('whiteboard-draw', drawData);
    });

    socket.on('whiteboard-clear', ({ roomId }) => {
      socket.to(roomId).emit('whiteboard-clear');
    });

    // Chat events
    socket.on('send-message', ({ roomId, message, userId, name }) => {
      io.to(roomId).emit('receive-message', {
        message,
        userId,
        name,
        timestamp: new Date(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      
      // Find and remove user from all rooms
      activeRooms.forEach((room, roomId) => {
        room.participants.forEach((participant, userId) => {
          if (participant.socketId === socket.id) {
            handleLeaveRoom(socket, roomId, userId);
          }
        });
      });
    });
  });
};

// Helper function to handle leaving a room
const handleLeaveRoom = (socket: Socket, roomId: string, userId: string): void => {
  const room = activeRooms.get(roomId);
  if (room) {
    const participant = room.participants.get(userId);
    if (participant) {
      room.participants.delete(userId);
      socket.leave(roomId);

      // Notify others
      socket.to(roomId).emit('user-left', { userId, name: participant.name });

      console.log(`👋 ${participant.name} left room ${roomId}. Remaining: ${room.participants.size}`);

      // Clean up empty rooms
      if (room.participants.size === 0) {
        activeRooms.delete(roomId);
        console.log(`🗑️  Room ${roomId} removed (empty)`);
      }
    }
  }
};

// Helper to get userId by socketId
const getUserIdBySocketId = (socketId: string, roomId: string): string | null => {
  const room = activeRooms.get(roomId);
  if (room) {
    for (const [userId, participant] of room.participants.entries()) {
      if (participant.socketId === socketId) {
        return userId;
      }
    }
  }
  return null;
};
