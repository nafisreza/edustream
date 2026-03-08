// User types
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Participant types
export type ParticipantRole = 'host' | 'participant';

export interface Participant {
  userId: string;
  name: string;
  role: ParticipantRole;
  joinedAt: Date;
}

// Room types
export interface Room {
  id: string;
  roomId: string;
  name: string;
  description?: string;
  hostId: string;
  hostName: string;
  participants: Participant[];
  isActive: boolean;
  settings: RoomSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomSettings {
  maxParticipants: number;
  autoMuteOnJoin: boolean;
  waitingRoomEnabled: boolean;
}

// Socket event types
export interface SocketEvents {
  // Room events
  'join-room': (data: { roomId: string; userId: string; name: string; role: ParticipantRole }) => void;
  'leave-room': (data: { roomId: string; userId: string }) => void;
  'user-joined': (data: { userId: string; name: string; role: ParticipantRole }) => void;
  'user-left': (data: { userId: string; name: string }) => void;
  'room-participants': (participants: Participant[]) => void;

  // WebRTC signaling events
  'offer': (data: { roomId: string; targetUserId: string; offer: any }) => void;
  'answer': (data: { roomId: string; targetUserId: string; answer: any }) => void;
  'ice-candidate': (data: { roomId: string; targetUserId: string; candidate: any }) => void;

  // Classroom management events
  'raise-hand': (data: { roomId: string; userId: string; name: string }) => void;
  'hand-raised': (data: { userId: string; name: string }) => void;
  'mute-all': (data: { roomId: string }) => void;
  'muted-by-host': () => void;
  'kick-user': (data: { roomId: string; targetUserId: string }) => void;
  'kicked-from-room': () => void;

  // Whiteboard events
  'whiteboard-draw': (data: { roomId: string; drawData: any }) => void;
  'whiteboard-clear': (data: { roomId: string }) => void;
  'join-whiteboard-room': (data: { roomId: string; userId: string; name: string; color?: string }) => void;
  'leave-whiteboard-room': (data: { roomId: string }) => void;
  'whiteboard-yjs-sync': (data: { roomId: string; update?: number[] }) => void;
  'whiteboard-yjs-update': (data: { roomId: string; update: number[] }) => void;
  'whiteboard-awareness-update': (data: { roomId: string; update: number[]; userId?: string }) => void;
  'whiteboard-scene-update': (data: { roomId: string; elementsJson: string }) => void;
  'whiteboard-scene-state': (data: { roomId: string; elementsJson: string }) => void;
  'whiteboard-presence-state': (data: {
    roomId: string;
    participants: Array<{ userId: string; name: string; color: string }>;
  }) => void;

  // Chat events
  'send-message': (data: { roomId: string; message: string; userId: string; name: string }) => void;
  'receive-message': (data: { message: string; userId: string; name: string; timestamp: Date }) => void;
}

// Whiteboard collaboration types
export interface WhiteboardAwarenessUser {
  userId: string;
  name: string;
  color: string;
}

// API Error response
export interface ApiError {
  message: string;
  errors?: any[];
}
