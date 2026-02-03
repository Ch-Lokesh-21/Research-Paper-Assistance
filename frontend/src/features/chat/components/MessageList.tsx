import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ChatBubbleOutline as ChatIcon } from '@mui/icons-material';
import MessageItem from './MessageItem.tsx';
import type { MessageListProps } from '../types/chat.types.ts';


export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        color="text.secondary"
      >
        <ChatIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
        <Typography variant="body1" gutterBottom>
          No messages yet
        </Typography>
        <Typography variant="body2" textAlign="center">
          Start a conversation by sending a message
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </Box>
  );
};

export default MessageList;
