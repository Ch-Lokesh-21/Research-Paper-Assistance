import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/constants';
import type { Session, SessionCreate, SessionUpdate } from '../../sessions/types/index.ts';
import type { Message } from '../types/index.ts';
import type { Document, DocumentListResponse, DocumentUploadResponse } from '../../documents/types/index.ts';

import type { QueryRequest, QueryResponse } from '../types/index.ts';

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

export const documentService = {
  getBySession: async (sessionId: string): Promise<Document[]> => {
    const response = await axiosInstance.get<DocumentListResponse>(
      `${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}/documents`
    );
    return response.data.documents;
  },

  upload: async (sessionId: string, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<DocumentUploadResponse>(
      `${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.document;
  },

  delete: async (documentId: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}`);
  },

  retry: async (documentId: string): Promise<Document> => {
    const response = await axiosInstance.post<Document>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/retry`
    );
    return response.data;
  },
};

export const queryService = {
  sendQuery: async (sessionId: string, data: QueryRequest): Promise<QueryResponse> => {
    const response = await axiosInstance.post<QueryResponse>(
      `${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}/query`,
      data
    );
    return response.data;
  },
};
