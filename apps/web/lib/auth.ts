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
<<<<<<< HEAD

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/forgot-password', { email });
    return response.data;
  },

  verifyOTP: async (email: string, otp: string): Promise<{ message: string; resetToken: string }> => {
    const response = await apiClient.post<{ message: string; resetToken: string }>('/api/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/reset-password', { resetToken, newPassword });
    return response.data;
  },
=======
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
};
