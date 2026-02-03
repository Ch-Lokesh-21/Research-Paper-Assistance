import React from 'react';
import { List, Typography, Box } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';
import SessionItem from './SessionItem.tsx';
import type { SessionListProps } from '../types/sessions.types.ts';


export const SessionList: React.FC<SessionListProps> = ({ sessions, onClose }) => {
  if (sessions.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        p={3}
        color="text.secondary"
      >
        <InboxIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="body2" textAlign="center">
          No sessions yet.
          <br />
          Create one to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ py: 0 }}>
      {sessions.map((session) => (
        <SessionItem key={session.id} session={session} onClose={onClose} />
      ))}
    </List>
  );
};

export default SessionList;
