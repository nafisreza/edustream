import { apiClient } from './api';
import type { 
  CreateRoomInput, 
  CreateRoomResponse, 
  GetRoomResponse,
  JoinRoomInput,
  JoinRoomResponse 
} from '@edustream/types';

export const roomApi = {
  createRoom: async (data: CreateRoomInput): Promise<CreateRoomResponse> => {
    const response = await apiClient.post<CreateRoomResponse>('/api/rooms/create', data);
    return response.data;
  },

  getRoom: async (roomId: string): Promise<GetRoomResponse> => {
    const response = await apiClient.get<GetRoomResponse>(`/api/rooms/${roomId}`);
    return response.data;
  },

  joinRoom: async (roomId: string, data: JoinRoomInput): Promise<JoinRoomResponse> => {
    const response = await apiClient.post<JoinRoomResponse>(`/api/rooms/${roomId}/join`, data);
    return response.data;
  },

  closeRoom: async (roomId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/rooms/${roomId}`);
    return response.data;
  },

  getRoomToken: async (roomId: string): Promise<{
    token?: string;
    url?: string;
    roomName?: string;
    participantName?: string;
    isHost?: boolean;
    pending?: boolean;
  }> => {
    const response = await apiClient.get(`/api/rooms/${roomId}/token`);
    return response.data;
  },

  updateRoomSettings: async (
    roomId: string,
    settings: { maxParticipants?: number; autoMuteOnJoin?: boolean; waitingRoomEnabled?: boolean }
  ): Promise<{ message: string; settings: { maxParticipants: number; autoMuteOnJoin: boolean; waitingRoomEnabled: boolean } }> => {
    const response = await apiClient.patch(`/api/rooms/${roomId}/settings`, settings);
    return response.data;
  },
};
