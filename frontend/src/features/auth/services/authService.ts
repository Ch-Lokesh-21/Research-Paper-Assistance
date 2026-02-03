import axiosInstance from "../../../lib/axios.ts";
import { API_ENDPOINTS } from "../../../config/constants.ts";
import type {
  UserSignupRequest,
  UserLoginRequest,
  AuthResponse,
} from "../types/index.ts";

export const authService = {
  signup: async (data: UserSignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data,
    );
    return response.data;
  },

  login: async (data: UserLoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
    );
    return response.data;
  },
};
