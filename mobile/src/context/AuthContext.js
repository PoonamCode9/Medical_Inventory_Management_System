import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, TOKEN_KEY, decodeJwt, setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { token, username, role, exp }
  const [loading, setLoading] = useState(true);

  // On app start, restore a saved session from AsyncStorage (the app's "localStorage").
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          const decoded = decodeJwt(token);
          if (decoded && decoded.exp * 1000 > Date.now()) {
            setUser({ token, ...decoded });
          } else {
            await AsyncStorage.removeItem(TOKEN_KEY);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    restore();

    // If any request comes back 401, force logout everywhere.
    setUnauthorizedHandler(() => {
      setUser(null);
      AsyncStorage.removeItem(TOKEN_KEY);
    });
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/api/auth/login', { username, password });
    const decoded = decodeJwt(data.token);
    if (!decoded) throw new Error('Invalid token from server');
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    setUser({ token: data.token, ...decoded });
  };

  const register = async (payload) => {
    await api.post('/api/auth/register', payload);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
