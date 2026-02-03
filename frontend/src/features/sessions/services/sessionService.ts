import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/constants';
import type { Session, SessionCreate, SessionUpdate } from '../types/index';

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    const response = await axiosInstance.get<{ sessions: Session[]; total: number }>(
      API_ENDPOINTS.SESSIONS.BASE
    );
    return response.data.sessions;
  },

  getById: async (sessionId: string): Promise<Session> => {
    const response = await axiosInstance.get<Session>(
      `${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}`
    );
    return response.data;
  },

  create: async (data: SessionCreate): Promise<Session> => {
    const response = await axiosInstance.post<Session>(
      API_ENDPOINTS.SESSIONS.BASE,
      data
    );
    return response.data;
  },

  update: async (sessionId: string, data: SessionUpdate): Promise<Session> => {
    const response = await axiosInstance.patch<Session>(
      `${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}`,
      data
    );
    return response.data;
  },

  delete: async (sessionId: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}`);
  },
};
