import React, { useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Paper,
  alpha,
  Fade,
} from '@mui/material';
import { CloudUpload as UploadIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { useDocuments, useUploadDocument } from '../hooks/index.ts';
import DocumentList from './DocumentList.tsx';

interface DocumentPanelProps {
  sessionId?: string;
}

export const DocumentPanel: React.FC<DocumentPanelProps> = ({ sessionId }) => {
  const { data: documents, isLoading } = useDocuments(sessionId);
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && sessionId) {
      uploadDocument({ sessionId, file });
      event.target.value = '';
    }
  };

  if (!sessionId) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          bgcolor: alpha('#000', 0.02),
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <DescriptionIcon
            sx={{
              fontSize: 64,
              mb: 2,
              color: alpha('#000', 0.2),
            }}
          />
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Select a session to view documents
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha('#1976d2', 0.02),
        }}
      >
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Documents
        </Typography>
        <IconButton
          onClick={handleUploadClick}
          disabled={isUploading}
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
          {isUploading ? (
            <CircularProgress size={20} sx={{ color: 'inherit' }} />
          ) : (
            <UploadIcon fontSize="small" />
          )}
        </IconButton>
      </Paper>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : documents && documents.length > 0 ? (
          <Fade in timeout={300}>
            <Box>
              <DocumentList documents={documents} sessionId={sessionId} />
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={300}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              p={3}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: 'center',
                  bgcolor: alpha('#000', 0.02),
                  border: `2px dashed ${alpha('#000', 0.12)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: alpha('#1976d2', 0.3),
                    bgcolor: alpha('#1976d2', 0.02),
                  },
                }}
              >
                <DescriptionIcon
                  sx={{
                    fontSize: 64,
                    mb: 2,
                    color: alpha('#000', 0.2),
                  }}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={500}
                  mb={3}
                >
                  No documents uploaded yet
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.25,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                    },
                  }}
                >
                  Upload PDF
                </Button>
              </Paper>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default DocumentPanel;
