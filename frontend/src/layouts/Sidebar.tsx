import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Fade,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useSessions, useCreateSession } from '../features/chat/hooks/index.ts';
import { useAppSelector } from '../hooks/index.ts';
import { selectAuthLoading } from '../features/auth/slices/authSlice.ts';
import SessionList from '../features/sessions/components/SessionList.tsx';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const authLoading = useAppSelector(selectAuthLoading);
  const { data: sessions, isLoading } = useSessions();
  const { mutate: createSession, isPending } = useCreateSession();
  const [open, setOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateSession = () => {
    if (!sessionName.trim()) return;

    createSession(
      { name: sessionName.trim() },
      {
        onSuccess: (newSession) => {
          setOpen(false);
          setSessionName('');
          navigate(`/chat/${newSession.session_id}`);
          onClose?.();
        },
      }
    );
  };

  const filteredSessions = sessions?.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          p: 2.5,
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Conversations
          </Typography>
          <IconButton
            onClick={() => setOpen(true)}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'grey.50',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'grey.300',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        {authLoading || isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress size={32} />
          </Box>
        ) : filteredSessions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No sessions found' : 'No sessions yet'}
            </Typography>
            {!searchQuery && (
              <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                Create your first session to get started
              </Typography>
            )}
          </Box>
        ) : (
          <Fade in timeout={300}>
            <Box>
              <SessionList sessions={filteredSessions} onClose={onClose} />
            </Box>
          </Fade>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
          Create New Session
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Session Name"
            placeholder="e.g., Machine Learning Research"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && sessionName.trim()) {
                handleCreateSession();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateSession}
            variant="contained"
            disabled={!sessionName.trim() || isPending}
            sx={{
              borderRadius: 2,
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
              },
            }}
          >
            {isPending ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
