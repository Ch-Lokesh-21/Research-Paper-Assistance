import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/constants';
import type { Document, DocumentListResponse, DocumentUploadResponse } from '../types/index.ts';

export const documentService = {
  getBySession: async (sessionId: string): Promise<Document[]> => {
    const response = await axiosInstance.get<DocumentListResponse>(
      `${API_ENDPOINTS.SESSIONS.BASE}/${sessionId}/documents`
    );
    return response.data.documents;
  },

  getById: async (documentId: string): Promise<Document> => {
    const response = await axiosInstance.get<Document>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}`
    );
    return response.data;
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
