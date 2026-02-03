import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/constants';
import type { QueryRequest, QueryResponse } from '../types/index.ts';

export const queryService = {
  sendQuery: async (sessionId: string, data: QueryRequest): Promise<QueryResponse> => {
    const response = await axiosInstance.post<QueryResponse>(
      `${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}/query`,
      data
    );
    return response.data;
  },
};
