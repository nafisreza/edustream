import { apiClient } from './api';

export interface RecordingInfo {
  recordingId: string;
  roomId: string;
  roomName: string;
  status: 'recording' | 'completed' | 'failed';
  startedAt: string;
  endedAt?: string;
  duration?: number; // seconds
  fileSize?: number; // bytes
}

export const recordingApi = {
  startRecording: async (roomId: string): Promise<{ recordingId: string; startedAt: string }> => {
    const response = await apiClient.post(`/api/recordings/rooms/${roomId}/start`);
    return response.data.recording;
  },

  stopRecording: async (roomId: string): Promise<{ recordingId: string; duration: number }> => {
    const response = await apiClient.post(`/api/recordings/rooms/${roomId}/stop`);
    return response.data.recording;
  },

  getRecordingStatus: async (roomId: string): Promise<{ isRecording: boolean; recording: { recordingId: string; startedAt: string } | null }> => {
    const response = await apiClient.get(`/api/recordings/rooms/${roomId}/status`);
    return response.data;
  },

  listRecordings: async (): Promise<{ recordings: RecordingInfo[] }> => {
    const response = await apiClient.get('/api/recordings');
    return response.data;
  },

  getDownloadUrl: (recordingId: string): string => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${base}/api/recordings/${recordingId}/download`;
  },
};
