import { createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback} from 'react';
import { getMeApiV1MeGet } from '../api/gen';
import { Token } from '../interfaces/token';
import useStore from '../hooks/useStore';
import { useRefreshToken } from '../hooks/useLogin';
import { StoreKeys } from '../constants';
import useGetToken from '../hooks/useToken';

interface User {
  id: string;
  device: string;
  [key: string]: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | undefined;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { token, fetchingToken, refetchToken, setToken } = useGetToken();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { refreshTokenAsync} = useRefreshToken();

  function completeProcess(user: User | undefined) {
    if (!user) {
      setUser(undefined);
      setLoading(false);
      return;
    } else {
      setUser(user);
      setLoading(false);
    }

  }

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!token?.refresh_token) {
      return false;
    }

    try {
      const refreshedToken = await refreshTokenAsync({
        body: {
          refresh_token: token.refresh_token,
        },
      })

      const newToken: Token = {
        access_token: refreshedToken.access_token,
        refresh_token: refreshedToken.refresh_token,
      }
      await setToken(newToken);
      return true;
    } catch (e) {
      return false;
    }

  }, [token, setToken]);

  const getUser = useCallback(async (retry: boolean = true) => {
    if (!token) {
      return;
    }

    try {
      const user = await getMeApiV1MeGet({
        headers: {
          Authorization: `Bearer ${token!.access_token}`,
        },
      })
    
      if (user.status === 401 && retry) {
        if (await refreshToken()) return getUser(false);
      }

      completeProcess(user.data);
    } 
    catch (e) {
      completeProcess(undefined);
    }

  }, [token]);

  useEffect(() => {
    if (!token && !fetchingToken) {
      setLoading(false);
      return;
    }

    getUser();
  }, [token])

  const isLoggedIn = useMemo(() => {
    return Boolean(token && token.access_token && token.refresh_token && !loading && user);
  }, [token, loading, user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
