import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Client, getMeApiV1MeGet } from '../api/gen';
import { Token } from '../interfaces/auth';
import { useRefreshToken } from './useLogin';
import useGetAuthInfo from '../actions/getAuthData';
import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { AuthErrors, SyncerError } from '../interfaces/errors';

export function useAuthState() {
  const { data, fetchingData, setToken, clearAuthData } = useGetAuthInfo();
  const { refreshTokenAsync } = useRefreshToken();
  const queryClient = useQueryClient();
  const [finalLoading, setFinalLoading] = useState(true);

  const token = data?.token;
  const serverUrl = data?.serverUrl;
  let authError: AuthErrors | undefined = undefined;

  // Query to validate token and get user data
  const { 
    data: userData, 
    error: userError, 
    isLoading: userLoading,
    refetch: refetchUser
  } = useQuery<Client|undefined, SyncerError<AuthErrors>>({
    queryKey: ['user', token?.access_token, serverUrl],
    queryFn: async (): Promise<Client | undefined> => {
      if (!token?.access_token || !serverUrl) {
        throw new SyncerError<AuthErrors>(
          "No access token or server URL found",
          AuthErrors.MUST_LOGOUT
        );
      }
      
      try {
        const response = await getMeApiV1MeGet({
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
          baseURL: serverUrl,
        });

        if (response.status === 401) {
          throw new SyncerError<AuthErrors>(
            "Unauthorized",
            AuthErrors.UNAUTHORIZED
          );
        } else if (response.status !== 200) {
          throw new SyncerError<AuthErrors>(
            "Error fetching user data",
            AuthErrors.UNKNOWN_ERROR,
          );
        }

        return response.data;
      } catch (e) {
        if (e instanceof SyncerError) {
          throw e;
        }
        throw new SyncerError<AuthErrors>(
          "Unknown error",
          AuthErrors.UNKNOWN_ERROR,
        );
      }
      
      
    },
    enabled: Boolean(token?.access_token && serverUrl && !fetchingData),
    retry: (failureCount, error) => {
      if (error?.data === AuthErrors.UNAUTHORIZED) return false;
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
  });

  const refreshToken = useCallback(async (): Promise<AuthErrors | undefined> => {
    if (!token?.refresh_token || !serverUrl) {
      authError = AuthErrors.MUST_LOGOUT;
      return authError;
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
      
      authError = undefined;
      return authError;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          return AuthErrors.UNAUTHORIZED
        } else {
          return AuthErrors.CONNECTION_ERROR
        }
      } 
      return AuthErrors.UNKNOWN_ERROR
    }
  }, [token, setToken, refreshTokenAsync, serverUrl, queryClient]);

  useEffect(() => {
    if (userLoading) return;
    async function handleError(error: SyncerError<AuthErrors> | null): Promise<AuthErrors | undefined> {
      let finalError: AuthErrors | undefined = undefined;
      if (error !== null) {
        if (error.data === AuthErrors.UNAUTHORIZED) {
          if (token?.refresh_token) {
            const refreshedError = await refreshToken()
            if (refreshedError === AuthErrors.MUST_LOGOUT) {
              logout();
            }
            finalError = refreshedError;
          } else {
            finalError = AuthErrors.MUST_LOGOUT;
          }
        } else {
          finalError = error.data;
        }
        return finalError;
      } else {
        return undefined;
      }
    }

    handleError(userError).then((error) => {
      authError = error ?? undefined;
      setFinalLoading(fetchingData || userLoading);
    });

  }, [userError, token, refreshToken, userLoading]);

  const logout = useCallback(async () => {
    await clearAuthData();
    queryClient.clear(); // Clear all queries
  }, [clearAuthData, queryClient]);

  const isLoggedIn = Boolean(
    token?.access_token && 
    token?.refresh_token && 
    !finalLoading && 
    userData && 
    serverUrl
  );


  return {
    isLoggedIn,
    user: userData,
    error: authError,
    loading: finalLoading,
    serverUrl,
    token,
    logout,
    refreshToken,
    refetchUser,
  };
} 