import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/sessionService';
import { QUERY_KEYS } from '../../../config/constants';
import { handleApiError, handleSuccess } from '../../../utils/errorHandler';
import { useAppSelector } from '../../../hooks/index';
import { selectAuthLoading } from '../../auth/slices/authSlice';
import type { Session, SessionCreate, SessionUpdate } from '../types/index';

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
    queryKey: QUERY_KEYS.SESSIONS.DETAIL(sessionId || ''),
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
      handleSuccess('Session created successfully');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, { sessionId: string; data: SessionUpdate }>({
    mutationFn: ({ sessionId, data }) => sessionService.update(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.SESSIONS.DETAIL(variables.sessionId) 
      });
      handleSuccess('Session updated successfully');
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
      handleSuccess('Session deleted successfully');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};
