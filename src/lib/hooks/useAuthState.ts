import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMeApiV1MeGet } from '../api/gen';
import { Token } from '../interfaces/auth';
import { useRefreshToken } from './useLogin';
import useGetAuthInfo from '../actions/getAuthData';
import { useCallback, useEffect } from 'react';

export function useAuthState() {
  const { data, fetchingData, setToken, clearAuthData } = useGetAuthInfo();
  const { refreshTokenAsync } = useRefreshToken();
  const queryClient = useQueryClient();

  const token = data?.token;
  const serverUrl = data?.serverUrl;

  // Query to validate token and get user data
  const { 
    data: userData, 
    error: userError, 
    isLoading: userLoading,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['user', token?.access_token, serverUrl],
    queryFn: async () => {
      if (!token?.access_token || !serverUrl) {
        throw new Error('No token or server URL');
      }
      
      const response = await getMeApiV1MeGet({
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
        baseURL: serverUrl,
      });
      
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      
      return response.data;
    },
    enabled: Boolean(token?.access_token && serverUrl && !fetchingData),
    retry: (failureCount, error) => {
      if (error.message === 'Unauthorized') return false;
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
  });

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!token?.refresh_token || !serverUrl) {
      return false;
    }

    try {
      const refreshedToken = await refreshTokenAsync({
        body: {
          refresh_token: token.refresh_token,
        },
        baseURL: serverUrl,
      });

      const newToken: Token = {
        access_token: refreshedToken.access_token,
        refresh_token: refreshedToken.refresh_token,
      };
      
      await setToken(newToken);
      
      // Invalidate and refetch user data with new token
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      return true;
    } catch (e) {
      console.error('Failed to refresh token:', e);
      return false;
    }
  }, [token, setToken, refreshTokenAsync, serverUrl, queryClient]);

  useEffect(() => {
    if (userError?.message === 'Unauthorized' && token?.refresh_token) {
      refreshToken().then((success) => {
        if (!success) {
          // Refresh failed, clear auth data
          logout();
        }
      });
    }
  }, [userError, token, refreshToken]);

  const logout = useCallback(async () => {
    await clearAuthData();
    queryClient.clear(); // Clear all queries
  }, [clearAuthData, queryClient]);

  const isLoggedIn = Boolean(
    token?.access_token && 
    token?.refresh_token && 
    !userLoading && 
    userData && 
    serverUrl
  );

  const loading = fetchingData || userLoading;

  return {
    isLoggedIn,
    user: userData,
    loading,
    serverUrl,
    token,
    logout,
    refreshToken,
    refetchUser,
    error: userError,
  };
} 