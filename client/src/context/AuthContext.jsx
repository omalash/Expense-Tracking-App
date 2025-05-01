import React, { createContext, useCallback, useEffect, useState } from 'react';
import axios from '../api/axios';
import useRefreshToken from '../hooks/useRefreshToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const refresh = useRefreshToken();

  const logout = useCallback(async () => {
    try {
      // Invalidate refresh token cookie/server-side session
      await axios.delete('/api/user/logout', { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setAccessToken(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const newToken = await refresh();
        setAccessToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } catch (err) {
        console.error('Refresh failed', err);
      } finally {
        setInitialized(true);
      }
    };
    initAuth();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, initialized, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
