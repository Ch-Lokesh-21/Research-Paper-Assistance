export interface Document {
  id: string;
  session_id: string;
  file_name: string;
  file_size: number;
  status: 'uploaded' | 'processing' | 'indexed' | 'failed';
  chunk_count?: number | null;
  page_count?: number | null;
  error_message?: string | null;
  created_at: string;
  processed_at?: string | null;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document: Document;
}