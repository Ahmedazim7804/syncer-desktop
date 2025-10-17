import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import { Client } from '../api/gen';
import { AuthErrors } from '../interfaces/errors';

interface AuthContextType {
  isLoggedIn: boolean;
  user: Client | undefined;
  error: AuthErrors | undefined;
  loading: boolean;
  serverUrl: string | undefined;
  logout: () => Promise<void>;
  refetchUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
