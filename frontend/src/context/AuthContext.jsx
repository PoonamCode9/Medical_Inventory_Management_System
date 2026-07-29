import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const claims = decodeToken(token);
      if (claims && claims.exp * 1000 > Date.now()) {
        setUser({
          email: claims.sub,
          role: claims.role,
          token
        });
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const claims = decodeToken(token);
    if (claims) {
      setUser({
        email: claims.sub,
        role: claims.role,
        token
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
