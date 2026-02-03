import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/messageService';
import { queryService } from '../services/queryService';
import { QUERY_KEYS } from '../../../config/constants';
import { handleApiError } from '../../../utils/errorHandler';
import type { Message, QueryRequest, QueryResponse } from '../types/index.ts';

export const useMessages = (sessionId: string | undefined) => {
  return useQuery<Message[], Error>({
    queryKey: QUERY_KEYS.MESSAGES.LIST(sessionId || ''),
    queryFn: () => messageService.getBySession(sessionId!),
    enabled: !!sessionId,
  });
};

export const useSendQuery = () => {
  const queryClient = useQueryClient();

  return useMutation<QueryResponse, Error, { sessionId: string; data: QueryRequest }>({
    mutationFn: ({ sessionId, data }) => queryService.sendQuery(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.MESSAGES.LIST(variables.sessionId) 
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS.LIST });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};
