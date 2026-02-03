export interface UserSignupRequest {
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
  type: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  exp: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: TokenResponse;
  refresh_token?: string | null;
  refresh_token_expires_in?: number | null;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface CurrentUser {
  id: string;
  email: string;
}

export type LoginFormData = Omit<UserLoginRequest, never>;

export type SignupFormData = UserSignupRequest & {
  confirmPassword?: string;
};

export interface ErrorResponse {
  detail: string;
}

export interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface JWTPayload {
  sub: string;
  email: string;
  exp: number;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}