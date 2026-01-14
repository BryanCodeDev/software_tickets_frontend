import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../api';
import { onForceLogout, offForceLogout, updateSocketAuth } from '../api/socket';

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
      } catch {
        // Invalid token, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    const handleForceLogout = () => {
      logout();
      // Opcional: mostrar mensaje al usuario
      alert('Tu sesión ha sido cerrada desde otro dispositivo.');
    };

    onForceLogout(handleForceLogout);

    return () => {
      offForceLogout(handleForceLogout);
    };
  }, [user]);

  const login = async (email, password, twoFactorToken = null) => {
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

    // Update socket with new token
    updateSocketAuth();

    return res;
  };

  const register = async (name, username, email, password) => {
    const res = await authAPI.register(name, username, email, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_timestamp');
    setUser(null);
    // Disconnect socket
    updateSocketAuth();
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const checkPermission = (module, action) => {
    // Los administradores tienen acceso completo a todo
    if (user?.role?.name === 'Administrador') {
      return true;
    }
    
    if (!user || !user.permissions) return false;

    return user.permissions.some(permission =>
      permission.module === module && permission.action === action
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
