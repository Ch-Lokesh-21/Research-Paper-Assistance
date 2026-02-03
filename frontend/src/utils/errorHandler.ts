import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ErrorResponse {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;

    if (data?.message) return data.message;
    if (data?.detail) return data.detail;

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      return firstError?.[0] || "Validation error";
    }

    switch (error.response?.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 403:
        return "Access denied. You do not have permission.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Conflict. Resource already exists.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return error.message || "An unexpected error occurred";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export const handleApiError = (error: unknown, customMessage?: string) => {
  const message = customMessage || getErrorMessage(error);
  toast.error(message);
};

export const handleSuccess = (message: string) => {
  toast.success(message);
};
