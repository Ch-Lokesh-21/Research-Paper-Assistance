export interface Citation {
  source_type: 'document' | 'web' | 'llm_knowledge';
  source_id: string;
  page_number?: number | null;
  url?: string | null;
  snippet: string;
  confidence: number;
}