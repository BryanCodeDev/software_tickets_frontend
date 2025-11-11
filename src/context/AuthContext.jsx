import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const tokenTimestamp = localStorage.getItem('token_timestamp');

    if (token && storedUser && tokenTimestamp) {
      try {
        const decoded = jwtDecode(token);
        const userData = JSON.parse(storedUser);

        // Check if token is expired (JWT tokens have expiration)
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_timestamp');
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (err) {
        // Invalid token, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, twoFactorToken = null) => {
    try {
      const res = await authAPI.login(email, password, twoFactorToken);

      // If 2FA is required, don't set user/token yet
      if (res.requires2FA) {
        return res;
      }

      // Normal login flow
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);

      // Set token timestamp for session validation
      localStorage.setItem('token_timestamp', Date.now().toString());

      return res;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, username, email, password) => {
    try {
      const res = await authAPI.register(name, username, email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_timestamp');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;