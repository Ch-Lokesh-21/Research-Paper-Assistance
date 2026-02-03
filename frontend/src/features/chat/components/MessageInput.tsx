import React, { useState } from 'react';
import { Box, TextField, IconButton, CircularProgress, Paper, alpha } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useSendQuery } from '../hooks/index.ts';
import type { Message } from '../types/index.ts';
import MessageItem from './MessageItem.tsx';
import type { MessageInputProps } from '../types/index.ts';


export const MessageInput: React.FC<MessageInputProps> = ({ sessionId }) => {
  const [query, setQuery] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const { mutate: sendQuery, isPending } = useSendQuery();

  const handleSend = () => {
    if (!query.trim() || isPending) return;

    const userMessage: Message = {
      id: `temp-user-${Date.now()}`,
      session_id: sessionId,
      role: 'user',
      content: query.trim(),
      created_at: new Date().toISOString(),
    };

    const loadingMessage: Message = {
      id: `temp-loading-${Date.now()}`,
      session_id: sessionId,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    };

    setOptimisticMessages([userMessage, loadingMessage]);
    const currentQuery = query.trim();
    setQuery('');

    sendQuery(
      {
        sessionId,
        data: {
          query: currentQuery,
          include_sources: true,
        },
      },
      {
        onSettled: () => {
          setOptimisticMessages([]);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {optimisticMessages.length > 0 && (
        <Box sx={{ px: 3, pb: 2 }}>
          {optimisticMessages.map((msg, index) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isLoading={index === 1 && isPending}
            />
          ))}
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Ask a question about your documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: alpha('#000', 0.02),
                transition: 'all 0.2s',
                minHeight: 40,
                alignItems: 'center',
                '&:hover': {
                  bgcolor: alpha('#000', 0.03),
                },
                '&.Mui-focused': {
                  bgcolor: 'background.paper',
                  boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.1)}`,
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 0.75,
                fontSize: '0.9rem',
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!query.trim() || isPending}
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
              },
              '&.Mui-disabled': {
                bgcolor: alpha('#000', 0.12),
                color: alpha('#000', 0.26),
              },
            }}
          >
            {isPending ? (
              <CircularProgress size={20} sx={{ color: 'inherit' }} />
            ) : (
              <SendIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Paper>
    </>
  );
};

export default MessageInput;
