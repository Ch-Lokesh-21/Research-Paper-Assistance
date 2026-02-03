import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/documentService';
import { QUERY_KEYS } from '../../../config/constants';
import { handleApiError, handleSuccess } from '../../../utils/errorHandler';
import type { Document } from '../types/index.ts';

export const useDocuments = (sessionId: string | undefined) => {
  return useQuery<Document[], Error>({
    queryKey: QUERY_KEYS.DOCUMENTS.LIST(sessionId || ''),
    queryFn: () => documentService.getBySession(sessionId!),
    enabled: !!sessionId,
  });
};

export const useDocumentDetails = (documentId: string, enabled: boolean = true) => {
  return useQuery<Document, Error>({
    queryKey: ['document', documentId],
    queryFn: () => documentService.getById(documentId),
    enabled: enabled && !!documentId,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<Document, Error, { sessionId: string; file: File }>({
    mutationFn: ({ sessionId, file }) => documentService.upload(sessionId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.DOCUMENTS.LIST(variables.sessionId) 
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      handleSuccess('Document uploaded successfully');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { documentId: string; sessionId: string }>({
    mutationFn: ({ documentId }) => documentService.delete(documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.DOCUMENTS.LIST(variables.sessionId) 
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      handleSuccess('Document deleted successfully');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useRetryDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<Document, Error, { documentId: string; sessionId: string }>({
    mutationFn: ({ documentId }) => documentService.retry(documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.DOCUMENTS.LIST(variables.sessionId) 
      });
      handleSuccess('Document retry initiated');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};
