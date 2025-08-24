# Authentication System

This document describes the authentication system implementation in the Syncer application.

## Overview

The authentication system automatically handles user authentication on app launch, token validation, and refresh. It uses React Query for state management and Tauri store for persistent storage.

## Key Components

### 1. Auth Context (`src/lib/context/auth-context.tsx`)

- Provides authentication state to the entire application
- Manages user data, loading states, and authentication status
- Uses the `useAuthState` hook for state management

### 2. Auth State Hook (`src/lib/hooks/useAuthState.ts`)

- Core logic for authentication state management
- Handles token validation, refresh, and user data fetching
- Uses React Query for efficient data fetching and caching

### 3. Store Management (`src/lib/actions/getAuthData.ts`)

- Manages persistent storage of authentication data
- Handles Tauri store operations for tokens and server URLs
- Provides cache management for better performance

### 4. API Client (`src/lib/client.ts`)

- Sets up axios interceptors for automatic authentication
- Dynamically sets base URL from stored server URL
- Handles global error responses

## Authentication Flow

### App Launch

1. **Check Stored Auth Data**: App checks if token and server URL are stored
2. **Validate Token**: If auth data exists, makes a request to validate the token
3. **Auto-login**: If token is valid, user is automatically logged in
4. **Redirect**: If no valid auth data, user is redirected to login page

### Login Process

1. **User Input**: User provides device name, server URL, and password
2. **API Call**: Login request is made to the specified server URL
3. **Store Data**: On success, token and server URL are stored
4. **Navigation**: User is redirected to dashboard

### Token Management

1. **Automatic Refresh**: Tokens are automatically refreshed when they expire
2. **Error Handling**: 401 errors trigger token refresh attempts
3. **Fallback**: If refresh fails, user is logged out

## Usage

### Using Auth Context

```tsx
import { useAuth } from "@/lib/context/auth-context";

function MyComponent() {
  const { isLoggedIn, user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>Welcome, {user?.device}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import { getMeApiV1MeGet } from "@/lib/api/gen";
import { useAuth } from "@/lib/context/auth-context";

function useUserData() {
  const { serverUrl } = useAuth();

  return useQuery({
    queryKey: ["user-data"],
    queryFn: () =>
      getMeApiV1MeGet({
        baseURL: serverUrl,
        // Headers are automatically added by the client
      }),
    enabled: Boolean(serverUrl),
  });
}
```

## Configuration

### Server URL

- The server URL is stored after successful login
- All subsequent API calls use this URL as the base URL
- Login requests use the user-provided server URL

### Token Storage

- Access and refresh tokens are stored in Tauri store
- Tokens are automatically included in API requests
- Expired tokens trigger automatic refresh

## Security Features

1. **Token Validation**: Tokens are validated on every app launch
2. **Automatic Refresh**: Expired tokens are automatically refreshed
3. **Secure Storage**: Auth data is stored securely using Tauri store
4. **Error Handling**: Failed authentication attempts are properly handled

## Error Handling

- **Network Errors**: Retry logic with exponential backoff
- **401 Errors**: Automatic token refresh
- **Invalid Tokens**: Automatic logout and redirect to login
- **Server Unavailable**: Graceful degradation with user feedback

## Best Practices

1. **Always use the auth context** for authentication state
2. **Use React Query** for API calls when possible
3. **Handle loading states** properly in UI components
4. **Use the utility functions** for common auth operations
5. **Test error scenarios** to ensure proper fallback behavior
