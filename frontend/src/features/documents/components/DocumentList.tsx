import React from 'react';
import { List } from '@mui/material';
import type { Document } from '../types/index.ts';
import DocumentItem from './DocumentItem';

interface DocumentListProps {
  documents: Document[];
  sessionId: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, sessionId }) => {
  return (
    <List sx={{ py: 0 }}>
      {documents.map((document) => (
        <DocumentItem key={document.id} document={document} sessionId={sessionId} />
      ))}
    </List>
  );
};

export default DocumentList;
