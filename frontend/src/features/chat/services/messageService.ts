import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/constants';
import type { Message } from '../types/index.ts';

export const messageService = {
  getBySession: async (sessionId: string): Promise<Message[]> => {
    const response = await axiosInstance.get<{
      success: boolean;
      session_id: string;
      messages: Message[];
      total: number;
    }>(`${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}/messages`);
    return response.data.messages;
  },
};
