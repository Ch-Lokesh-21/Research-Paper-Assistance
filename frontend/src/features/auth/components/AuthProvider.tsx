import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../slices/authSlice";
import { useRefreshToken } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import type { CurrentUser } from '../types/index';
import type { JWTPayload, AuthProviderProps } from '../types/auth.types';


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { mutate: refreshToken } = useRefreshToken();
  const hasInitialized = useRef(false);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && !isInitializing.current) {
      hasInitialized.current = true;
      isInitializing.current = true;
      
      refreshToken(undefined, {
        onSettled: () => {
          isInitializing.current = false;
        }
      });
    }
  }, [refreshToken]);

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<{ accessToken: string }>;
      if (customEvent.detail?.accessToken) {
        

        const decoded = jwtDecode<JWTPayload>(customEvent.detail.accessToken);
        const user: CurrentUser = {
          id: decoded.sub,
          email: decoded.email,
        };

        dispatch(
          setCredentials({
            user,
            accessToken: customEvent.detail.accessToken,
          }),
        );
      }
    };

    const handleAuthError = () => {
      dispatch(logout());
    };

    window.addEventListener("accessTokenRefreshed", handleTokenRefresh);
    window.addEventListener("authError", handleAuthError);

    return () => {
      window.removeEventListener("accessTokenRefreshed", handleTokenRefresh);
      window.removeEventListener("authError", handleAuthError);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
