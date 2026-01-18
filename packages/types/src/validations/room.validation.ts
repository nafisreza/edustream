import { z } from 'zod';

// Create room validation schema
export const createRoomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters').max(100, 'Room name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

// Join room validation schema
export const joinRoomSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
});

// Infer TypeScript types from schemas
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type JoinRoomInput = z.infer<typeof joinRoomSchema>;

// Response types
export interface RoomResponse {
  id: string;
  roomId: string;
  name: string;
  description?: string;
  hostId: string;
  hostName: string;
  participantCount?: number;
  settings: {
    maxParticipants: number;
    autoMuteOnJoin: boolean;
    waitingRoomEnabled: boolean;
  };
  isActive?: boolean;
}

export interface CreateRoomResponse {
  message: string;
  room: RoomResponse;
}

export interface JoinRoomResponse {
  message: string;
  room: {
    roomId: string;
    name: string;
    hostId: string;
    waitingRoomEnabled: boolean;
  };
}

export interface GetRoomResponse {
  room: RoomResponse;
}
