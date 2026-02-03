import React from 'react';
import { Box, Paper, Typography, Avatar, CircularProgress } from '@mui/material';
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material';
import type { Citation } from '../../citations/types/index.ts';
import CitationList from '../../citations/components/CitationList.tsx';
import type { MessageItemProps } from '../types/index.ts';


export const MessageItem: React.FC<MessageItemProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';
  const citations = (message.metadata?.citations as Citation[]) || [];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          maxWidth: '80%',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32,
          }}
        >
          {isUser ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
        </Avatar>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.light' : 'grey.100',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
          }}
        >
          {isLoading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              <Typography variant="body2">Thinking...</Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {message.content}
              </Typography>
              {!isUser && citations.length > 0 && (
                <CitationList citations={citations} />
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageItem;
