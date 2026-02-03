import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import type { Session } from '../types/index.ts';
import { useUpdateSession, useDeleteSession } from '../hooks/index.ts';

interface SessionItemProps {
  session: Session;
  onClose?: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({ session, onClose }) => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { mutate: updateSession } = useUpdateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(session.name);

  const isSelected = sessionId === session.session_id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSessionClick = () => {
    navigate(`/chat/${session.session_id}`);
    onClose?.();
  };

  const handleEdit = () => {
    setEditName(session.name);
    setEditOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleUpdateSession = () => {
    if (!editName.trim()) return;

    updateSession(
      {
        sessionId: session.session_id,
        data: { name: editName.trim() },
      },
      {
        onSuccess: () => {
          setEditOpen(false);
        },
      }
    );
  };

  const handleDeleteSession = () => {
    deleteSession(session.session_id, {
      onSuccess: () => {
        setDeleteOpen(false);
        if (isSelected) {
          navigate('/chat');
        }
      },
    });
  };

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          mb: 0.5,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: isSelected ? alpha('#1976d2', 0.08) : 'transparent',
          '&:hover': {
            bgcolor: isSelected ? alpha('#1976d2', 0.12) : alpha('#000', 0.04),
            '& .session-menu-btn': {
              opacity: 1,
            },
          },
          transition: 'all 0.2s',
        }}
      >
        <ListItemButton
          onClick={handleSessionClick}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 2,
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {session.name}
                </Box>
                {session.document_count > 0 && (
                  <Chip
                    icon={<DescriptionIcon sx={{ fontSize: 14 }} />}
                    label={session.document_count}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      bgcolor: isSelected ? 'primary.main' : 'grey.200',
                      color: isSelected ? 'white' : 'text.secondary',
                      '& .MuiChip-icon': {
                        color: 'inherit',
                        ml: 0.5,
                      },
                    }}
                  />
                )}
              </Box>
            }
            primaryTypographyProps={{
              fontWeight: isSelected ? 600 : 500,
              fontSize: '0.9rem',
              color: isSelected ? 'primary.main' : 'text.primary',
            }}
          />
          <IconButton
            className="session-menu-btn"
            edge="end"
            size="small"
            onClick={handleMenuOpen}
            sx={{
              opacity: 0,
              ml: 1,
              transition: 'opacity 0.2s',
              '&:hover': {
                bgcolor: alpha('#000', 0.08),
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </ListItemButton>
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 160,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
          <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ py: 1.5, color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Session</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Session Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && editName.trim()) {
                handleUpdateSession();
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
          <Button onClick={() => setEditOpen(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateSession}
            variant="contained"
            disabled={!editName.trim()}
            sx={{
              borderRadius: 2,
              px: 3,
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(25,118,210,0.3)' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Session?</DialogTitle>
        <DialogContent>
          <Box sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete "{session.name}"? This action cannot be undone.
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSession}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              px: 3,
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(211,47,47,0.3)' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionItem;
