import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { authService } from "../services/index.ts";
import {
  setCredentials,
  logout as logoutAction,
  setLoading,
} from "../slices/index.ts";
import { QUERY_KEYS } from "../../../config/constants.ts";
import type {
  UserSignupRequest,
  UserLoginRequest,
  AuthResponse,
  CurrentUser,
} from "../types/index.ts";
import { jwtDecode } from "jwt-decode";
import { handleApiError } from "../../../utils/errorHandler.ts";
import type { JWTPayload } from "../types/auth.types.ts";


export const useSignup = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, UserSignupRequest>({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      const decoded = jwtDecode<JWTPayload>(data.token.access_token);
      const user: CurrentUser = {
        id: decoded.sub,
        email: decoded.email,
      };

      dispatch(
        setCredentials({
          user,
          accessToken: data.token.access_token,
        }),
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, UserLoginRequest>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const decoded = jwtDecode<JWTPayload>(data.token.access_token);
      const user: CurrentUser = {
        id: decoded.sub,
        email: decoded.email,
      };

      dispatch(
        setCredentials({
          user,
          accessToken: data.token.access_token,
        }),
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logoutAction());

      queryClient.clear();
    },
    onError: (error) => {
      handleApiError(error, "Logout failed");
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  const dispatch = useDispatch();

  return useMutation<AuthResponse, Error, void>({
    mutationFn: authService.refresh,
    onSuccess: (data) => {
      const decoded = jwtDecode<JWTPayload>(data.token.access_token);
      const user: CurrentUser = {
        id: decoded.sub,
        email: decoded.email,
      };

      dispatch(
        setCredentials({
          user,
          accessToken: data.token.access_token,
        }),
      );
      dispatch(setLoading(false));
    },
    onError: (error) => {
      console.error('[useRefreshToken] Refresh token failed:', error);
      dispatch(logoutAction());
      dispatch(setLoading(false));
    },
  });
};

export const useAuth = () => {
  const dispatch = useDispatch();

  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.AUTH.USER,
    queryFn: async () => {
      try {
        await authService.refresh();
        return true;
      } catch (error: unknown) {
        console.error("Auth check failed:", error);
        dispatch(logoutAction());
        return false;
      }
    },
    retry: false,
    staleTime: Infinity,
  });
};
