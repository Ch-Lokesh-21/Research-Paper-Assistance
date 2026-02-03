import React, { useState } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Paper,
  alpha,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Description as FileIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  HourglassEmpty as ProcessingIcon,
  PictureAsPdf as PdfIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import type { Document } from '../../documents/types/index.ts';
import { useDeleteDocument, useRetryDocument } from '../../chat/hooks/index.ts';
import { useDocumentDetails } from '../hooks/useDocuments';

interface DocumentItemProps {
  document: Document;
  sessionId: string;
}

const getStatusConfig = (status: Document['status']) => {
  switch (status) {
    case 'indexed':
      return {
        icon: <CheckIcon fontSize="small" />,
        color: 'success.main' as const,
        bgcolor: alpha('#2e7d32', 0.1),
        label: 'Indexed',
      };
    case 'processing':
      return {
        icon: <ProcessingIcon fontSize="small" />,
        color: 'info.main' as const,
        bgcolor: alpha('#0288d1', 0.1),
        label: 'Processing',
      };
    case 'failed':
      return {
        icon: <ErrorIcon fontSize="small" />,
        color: 'error.main' as const,
        bgcolor: alpha('#d32f2f', 0.1),
        label: 'Failed',
      };
    default:
      return {
        icon: <FileIcon fontSize="small" />,
        color: 'text.secondary' as const,
        bgcolor: alpha('#000', 0.05),
        label: 'Unknown',
      };
  }
};

export const DocumentItem: React.FC<DocumentItemProps> = ({ document, sessionId }) => {
  const { mutate: deleteDocument } = useDeleteDocument();
  const { mutate: retryDocument } = useRetryDocument();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: documentDetails, isLoading: isLoadingDetails } = useDocumentDetails(
    document.id,
    detailsOpen
  );

  const statusConfig = getStatusConfig(document.status);

  const handleDetailsOpen = () => {
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };

  const handleDelete = () => {
    setDetailsOpen(false);
    setDeleteOpen(true);
  };

  const handleRetry = () => {
    retryDocument({ documentId: document.id, sessionId });
    setDetailsOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteDocument({ documentId: document.id, sessionId });
    setDeleteOpen(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${alpha('#000', 0.08)}`,
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: alpha('#1976d2', 0.3),
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '& .view-details-icon': {
              opacity: 1,
            },
          },
        }}
      >
        <ListItem
          sx={{
            py: 1.5,
            px: 2,
          }}
          secondaryAction={
            <Tooltip title="View Details" arrow>
              <IconButton
                edge="end"
                size="small"
                onClick={handleDetailsOpen}
                className="view-details-icon"
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    bgcolor: alpha('#1976d2', 0.08),
                  },
                }}
              >
                <VisibilityIcon fontSize="small" sx={{ color: 'primary.main' }} />
              </IconButton>
            </Tooltip>
          }
        >
          <ListItemIcon sx={{ minWidth: 48 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha('#1976d2', 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PdfIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                >
                  {document.file_name}
                </Box>
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    bgcolor: statusConfig.bgcolor,
                    color: statusConfig.color,
                    border: 'none',
                    '& .MuiChip-icon': {
                      color: 'inherit',
                      ml: 0.5,
                    },
                  }}
                />
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {formatFileSize(document.file_size)}
                </Box>
                {document.page_count && (
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {document.page_count} pages
                  </Box>
                )}
                {document.error_message && (
                  <Tooltip title={document.error_message} arrow>
                    <Box
                      sx={{
                        fontSize: '0.75rem',
                        color: 'error.main',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      View error
                    </Box>
                  </Tooltip>
                )}
              </Box>
            }
          />
        </ListItem>
      </Paper>

      <Dialog
        open={detailsOpen}
        onClose={handleDetailsClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Document Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {isLoadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : documentDetails ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha('#1976d2', 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PdfIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        mb: 0.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      {documentDetails.file_name}
                    </Typography>
                    <Chip
                      icon={statusConfig.icon}
                      label={statusConfig.label}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: statusConfig.bgcolor,
                        color: statusConfig.color,
                        border: 'none',
                        '& .MuiChip-icon': {
                          color: 'inherit',
                          ml: 0.5,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    File Size
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatFileSize(documentDetails.file_size)}
                  </Typography>
                </Box>

                {documentDetails.page_count !== null && documentDetails.page_count !== undefined && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Pages
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {documentDetails.page_count}
                    </Typography>
                  </Box>
                )}

                {documentDetails.chunk_count !== null && documentDetails.chunk_count !== undefined && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Chunks
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {documentDetails.chunk_count}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Document ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      wordBreak: 'break-all',
                    }}
                  >
                    {documentDetails.id}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Uploaded At
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatDate(documentDetails.created_at)}
                </Typography>
              </Box>

              {documentDetails.processed_at && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Processed At
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(documentDetails.processed_at)}
                  </Typography>
                </Box>
              )}

              {documentDetails.error_message && (
                <Box>
                  <Typography variant="caption" color="error" sx={{ display: 'block', mb: 0.5 }}>
                    Error Message
                  </Typography>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: alpha('#d32f2f', 0.05),
                      border: `1px solid ${alpha('#d32f2f', 0.2)}`,
                    }}
                  >
                    <Typography variant="body2" color="error" sx={{ fontSize: '0.85rem' }}>
                      {documentDetails.error_message}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">Unable to load document details</Typography>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          {documentDetails?.status === 'failed' && (
            <Button
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: 2,
                px: 2.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Retry Indexing
            </Button>
          )}
          <Button
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            sx={{
              borderRadius: 2,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Delete
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={handleDetailsClose}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Close
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
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Document?</DialogTitle>
        <DialogContent>
          <Box sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete "{document.file_name}"? This action cannot be undone.
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
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

export default DocumentItem;
