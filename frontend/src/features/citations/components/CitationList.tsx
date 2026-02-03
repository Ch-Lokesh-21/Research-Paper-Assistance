import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import {
  Article as ArticleIcon,
  Link as LinkIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import type { Citation } from '../types/index';

interface CitationListProps {
  citations: Citation[];
}

export const CitationList: React.FC<CitationListProps> = ({ citations }) => {
  if (!citations || citations.length === 0) {
    return null;
  }

  const getSourceIcon = (sourceType: Citation['source_type']) => {
    switch (sourceType) {
      case 'document':
        return <ArticleIcon sx={{ fontSize: 16 }} />;
      case 'web':
        return <LinkIcon sx={{ fontSize: 16 }} />;
      case 'llm_knowledge':
        return <PsychologyIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getSourceLabel = (citation: Citation) => {
    if (citation.source_type === 'document' && citation.page_number) {
      return `${citation.source_id} (p. ${citation.page_number})`;
    }
    return citation.source_id;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Sources
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {citations.map((citation, index) => (
          <Tooltip
            key={index}
            title={
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                  {getSourceLabel(citation)}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                  {citation.snippet}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.7 }}>
                  Confidence: {(citation.confidence * 100).toFixed(0)}%
                </Typography>
              </Box>
            }
            arrow
          >
            <Chip
              icon={getSourceIcon(citation.source_type)}
              label={getSourceLabel(citation)}
              size="small"
              variant="outlined"
              clickable={citation.source_type === 'web'}
              component={citation.url ? 'a' : 'div'}
              href={citation.url || undefined}
              target={citation.url ? '_blank' : undefined}
              rel={citation.url ? 'noopener noreferrer' : undefined}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.50',
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default CitationList;
