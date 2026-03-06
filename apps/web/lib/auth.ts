import { apiClient } from './api';
import type { RegisterInput, LoginInput, AuthResponse, TokenVerifyResponse } from '@edustream/types';

export const authApi = {
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  verifyToken: async (): Promise<TokenVerifyResponse> => {
    const response = await apiClient.get<TokenVerifyResponse>('/api/auth/verify');
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/api/auth/logout');
  },
};
