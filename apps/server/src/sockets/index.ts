import { Server as SocketIOServer, Socket } from 'socket.io';
import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate, removeAwarenessStates } from 'y-protocols/awareness';
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

interface WhiteboardState {
  doc: Y.Doc;
  awareness: Awareness;
  socketToClientId: Map<string, number>;
}

interface WhiteboardParticipant {
  userId: string;
  name: string;
  color: string;
}

// Store active rooms and their participants
const activeRooms = new Map<string, RoomState>();
const whiteboardRooms = new Map<string, WhiteboardState>();
const whiteboardSnapshots = new Map<string, string>();
const whiteboardParticipants = new Map<string, Map<string, WhiteboardParticipant>>();

const getOrCreateWhiteboardState = (roomId: string): WhiteboardState => {
  const existing = whiteboardRooms.get(roomId);
  if (existing) {
    return existing;
  }

  const doc = new Y.Doc();
  const awareness = new Awareness(doc);
  const state: WhiteboardState = {
    doc,
    awareness,
    socketToClientId: new Map(),
  };
  whiteboardRooms.set(roomId, state);
  return state;
};

const toUint8Array = (data: unknown): Uint8Array => {
  if (data instanceof Uint8Array) {
    return data;
  }

  if (Buffer.isBuffer(data)) {
    return new Uint8Array(data);
  }

  if (Array.isArray(data)) {
    return Uint8Array.from(data);
  }

  return new Uint8Array();
};

const emitWhiteboardPresence = (io: SocketIOServer, roomId: string) => {
  const roomParticipants = whiteboardParticipants.get(roomId);
  const participants = roomParticipants
    ? Array.from(roomParticipants.values())
    : [];

  io.to(roomId).emit('whiteboard-presence-state', {
    roomId,
    participants,
  });
};

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

    // Join whiteboard room (separate from room participant tracking)
    socket.on('join-whiteboard-room', ({ roomId, userId, name, color }) => {
      socket.join(roomId);
      console.log(`🧩 Whiteboard join: socket ${socket.id} -> ${roomId}`);

      if (!whiteboardParticipants.has(roomId)) {
        whiteboardParticipants.set(roomId, new Map());
      }

      whiteboardParticipants.get(roomId)!.set(socket.id, {
        userId,
        name,
        color: color || '#4f46e5',
      });

      const snapshot = whiteboardSnapshots.get(roomId) ?? JSON.stringify([]);
      socket.emit('whiteboard-scene-state', { roomId, elementsJson: snapshot });
      emitWhiteboardPresence(io, roomId);
    });

    socket.on('leave-whiteboard-room', ({ roomId }) => {
      const whiteboardState = whiteboardRooms.get(roomId);
      if (whiteboardState) {
        const clientId = whiteboardState.socketToClientId.get(socket.id);
        if (typeof clientId === 'number') {
          whiteboardState.socketToClientId.delete(socket.id);
          removeAwarenessStates(whiteboardState.awareness, [clientId], socket.id);
          const removeUpdate = encodeAwarenessUpdate(whiteboardState.awareness, [clientId]);
          socket.to(roomId).emit('whiteboard-awareness-update', { roomId, update: Array.from(removeUpdate) });
        }
      }

      const participants = whiteboardParticipants.get(roomId);
      if (participants) {
        participants.delete(socket.id);
        if (participants.size === 0) {
          whiteboardParticipants.delete(roomId);
        }
      }

      socket.leave(roomId);
      emitWhiteboardPresence(io, roomId);
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

    socket.on('whiteboard-scene-update', ({ roomId, elementsJson }) => {
      if (typeof elementsJson !== 'string') {
        return;
      }

      whiteboardSnapshots.set(roomId, elementsJson);
      socket.to(roomId).emit('whiteboard-scene-update', {
        roomId,
        elementsJson,
      });
    });

    // CRDT whiteboard sync (Yjs)
    socket.on('whiteboard-yjs-sync', ({ roomId }) => {
      const whiteboardState = getOrCreateWhiteboardState(roomId);
      const fullUpdate = Y.encodeStateAsUpdate(whiteboardState.doc);

      socket.emit('whiteboard-yjs-sync', {
        roomId,
        update: Array.from(fullUpdate),
      });
    });

    socket.on('whiteboard-yjs-update', ({ roomId, update }) => {
      const updateBytes = toUint8Array(update);
      if (updateBytes.length === 0) {
        return;
      }

      const whiteboardState = getOrCreateWhiteboardState(roomId);
      Y.applyUpdate(whiteboardState.doc, updateBytes, socket.id);
      socket.to(roomId).emit('whiteboard-yjs-update', {
        roomId,
        update: Array.from(updateBytes),
      });
    });

    socket.on('whiteboard-awareness-update', ({ roomId, update, userId }) => {
      const updateBytes = toUint8Array(update);
      if (updateBytes.length === 0) {
        return;
      }

      const whiteboardState = getOrCreateWhiteboardState(roomId);
      applyAwarenessUpdate(whiteboardState.awareness, updateBytes, socket.id);

      // Track the sender's client IDs so we can clean awareness on disconnect.
      const states = Array.from(whiteboardState.awareness.getStates().entries());
      for (const [clientId, state] of states) {
        if (state && typeof state === 'object' && (state as any).user?.userId === userId) {
          whiteboardState.socketToClientId.set(socket.id, clientId);
        }
      }

      socket.to(roomId).emit('whiteboard-awareness-update', {
        roomId,
        update: Array.from(updateBytes),
      });
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

      // Remove disconnected socket from any whiteboard awareness state.
      whiteboardRooms.forEach((whiteboardState, roomId) => {
        const clientId = whiteboardState.socketToClientId.get(socket.id);
        if (typeof clientId === 'number') {
          whiteboardState.socketToClientId.delete(socket.id);
          removeAwarenessStates(whiteboardState.awareness, [clientId], socket.id);
          const removeUpdate = encodeAwarenessUpdate(whiteboardState.awareness, [clientId]);
          socket.to(roomId).emit('whiteboard-awareness-update', { roomId, update: Array.from(removeUpdate) });
        }
      });

      whiteboardParticipants.forEach((participants, roomId) => {
        if (participants.delete(socket.id)) {
          if (participants.size === 0) {
            whiteboardParticipants.delete(roomId);
          }
          emitWhiteboardPresence(io, roomId);
        }
      });
      
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
        const whiteboardState = whiteboardRooms.get(roomId);
        if (whiteboardState) {
          whiteboardState.awareness.destroy();
          whiteboardState.doc.destroy();
          whiteboardRooms.delete(roomId);
        }
        whiteboardSnapshots.delete(roomId);
        whiteboardParticipants.delete(roomId);
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
