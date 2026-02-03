export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    ME: "/users/me",
  },
  SESSIONS: {
    BASE: "/sessions",
  },
  DOCUMENTS: {
    BASE: "/documents",
  },
  QUERY: {
    BASE: "/query",
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER: "user",
} as const;

export const QUERY_KEYS = {
  AUTH: {
    USER: ["auth", "user"],
    REFRESH: ["auth", "refresh"],
  },
  SESSIONS: {
    LIST: ["sessions", "list"],
    DETAIL: (sessionId: string) => ["sessions", "detail", sessionId],
  },
  MESSAGES: {
    LIST: (sessionId: string) => ["messages", sessionId],
  },
  DOCUMENTS: {
    LIST: (sessionId: string) => ["documents", sessionId],
  },
} as const;
