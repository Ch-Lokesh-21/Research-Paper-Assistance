import type { Citation } from "../../citations/types/index";

export interface RoutingDecision {
  route: "llm" | "web_search" | "multimodal_rag";
  reasoning: string;
  confidence: number;
  fallback_route?: "llm" | "web_search" | "multimodal_rag" | null;
}

export interface VisualDecision {
  requires_visual: boolean;
  reasoning: string;
  visual_type?: "full_page" | "diagram" | "table" | "figure" | null;
  confidence: number;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface MessageCreate {
  role: "user" | "assistant";
  content: string;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export interface MessageInputProps {
  sessionId: string;
}

export interface MessageItemProps {
  message: Message;
  isLoading?: boolean;
}

export interface QueryRequest {
  query: string;
  stream?: boolean;
  include_sources?: boolean;
}

export interface QueryResponse {
  success: boolean;
  query: string;
  answer: string;
  citations: Citation[];
  routing?: RoutingDecision | null;
  visual_decision?: VisualDecision | null;
  processing_time_ms: number;
  session_id: string;
}
