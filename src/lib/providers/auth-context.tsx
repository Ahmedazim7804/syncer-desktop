import { useQuery } from '@tanstack/react-query';
import { LoginFormData } from "../zod/auth-schema";
import { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { getMeApiV1MeGetOptions } from '../api/gen/@tanstack/react-query.gen';
import useLogin from '../hooks/useLogin';

interface User {
  id: string;
  device: string;
  [key: string]: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (data: LoginFormData) => void;
  loading: boolean;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { loginAsync, isPending: loggingIn } = useLogin();
  const {
    data,
    isPending: gettingUser,
    refetch,
  } = useQuery({
    ...getMeApiV1MeGetOptions(),
    retry: false,
    retryOnMount: true,
  });

  const login = useCallback(async (data: LoginFormData) => {
    await loginAsync({
      body: {
        device: data.device,
        password: data.password,
      }
    });

    refetch();
  }, [loginAsync, refetch]);

  const isLoggedIn = useMemo(() => {
    if (!data) return false;
    return Boolean(data.success && data.data);
  }, [data]);
  const user = useMemo(() => {
    if (!data) return null;
    return data.data as User;
  }, [data]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading: loggingIn || gettingUser, refresh: refetch, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
