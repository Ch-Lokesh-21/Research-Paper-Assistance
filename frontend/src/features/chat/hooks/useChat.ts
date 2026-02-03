import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  sessionService,
  messageService,
  documentService,
  queryService,
} from "../services/index";
import { QUERY_KEYS } from "../../../config/constants";
import { handleApiError, handleSuccess } from "../../../utils/errorHandler";
import { useAppSelector } from "../../../hooks/index";
import { selectAuthLoading } from "../../auth/slices/authSlice";
import type { QueryRequest, QueryResponse } from "../types/index.ts";
import type {
  Session,
  SessionCreate,
  SessionUpdate,
} from "../../sessions/types/index.ts";
import type { Document } from "../../documents/types/index.ts";
import type { Message } from "../types/index.ts";

export const useSessions = () => {
  const authLoading = useAppSelector(selectAuthLoading);

  return useQuery<Session[], Error>({
    queryKey: QUERY_KEYS.SESSIONS.LIST,
    queryFn: sessionService.getAll,
    enabled: !authLoading,
  });
};

export const useSession = (sessionId: string | undefined) => {
  return useQuery<Session, Error>({
    queryKey: QUERY_KEYS.SESSIONS.DETAIL(sessionId || ""),
    queryFn: () => sessionService.getById(sessionId!),
    enabled: !!sessionId,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, SessionCreate>({
    mutationFn: sessionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      handleSuccess("Session created successfully");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Session,
    Error,
    { sessionId: string; data: SessionUpdate }
  >({
    mutationFn: ({ sessionId, data }) => sessionService.update(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SESSIONS.DETAIL(variables.sessionId),
      });
      handleSuccess("Session updated successfully");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: sessionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      handleSuccess("Session deleted successfully");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useMessages = (sessionId: string | undefined) => {
  return useQuery<Message[], Error>({
    queryKey: QUERY_KEYS.MESSAGES.LIST(sessionId || ""),
    queryFn: () => messageService.getBySession(sessionId!),
    enabled: !!sessionId,
  });
};

export const useDocuments = (sessionId: string | undefined) => {
  return useQuery<Document[], Error>({
    queryKey: QUERY_KEYS.DOCUMENTS.LIST(sessionId || ""),
    queryFn: () => documentService.getBySession(sessionId!),
    enabled: !!sessionId,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<Document, Error, { sessionId: string; file: File }>({
    mutationFn: ({ sessionId, file }) =>
      documentService.upload(sessionId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DOCUMENTS.LIST(variables.sessionId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      handleSuccess("Document uploaded successfully");
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
        queryKey: QUERY_KEYS.DOCUMENTS.LIST(variables.sessionId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      handleSuccess("Document deleted successfully");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useRetryDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Document,
    Error,
    { documentId: string; sessionId: string }
  >({
    mutationFn: ({ documentId }) => documentService.retry(documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DOCUMENTS.LIST(variables.sessionId),
      });
      handleSuccess("Document retry initiated");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useSendQuery = () => {
  const queryClient = useQueryClient();

  return useMutation<
    QueryResponse,
    Error,
    { sessionId: string; data: QueryRequest }
  >({
    mutationFn: ({ sessionId, data }) =>
      queryService.sendQuery(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MESSAGES.LIST(variables.sessionId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};
