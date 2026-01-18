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

  // Chat events
  'send-message': (data: { roomId: string; message: string; userId: string; name: string }) => void;
  'receive-message': (data: { message: string; userId: string; name: string; timestamp: Date }) => void;
}

// API Error response
export interface ApiError {
  message: string;
  errors?: any[];
}
