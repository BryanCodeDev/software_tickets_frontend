import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../api';
import { onForceLogout, offForceLogout, updateSocketAuth } from '../api/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para validar integridad del token
  const validateTokenIntegrity = useCallback((token, userData) => {
    try {
      const decoded = jwtDecode(token);
      // Verificar que el ID del usuario coincida con el token
      if (decoded.id !== userData.id) {
        console.warn('Integridad de token violada: ID no coincide');
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Error decodificando token:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const tokenTimestamp = localStorage.getItem('token_timestamp');

    if (!token || !storedUser || !tokenTimestamp) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userData = JSON.parse(storedUser);

      // ✅ VALIDAR INTEGRIDAD Y EXPIRACIÓN LOCALMENTE - SIN DELAY
      if (!validateTokenIntegrity(token, userData)) {
        throw new Error('Token corrupto');
      }

      // Check if token is expired (JWT tokens have expiration)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token expired, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
        setUser(null);
        setLoading(false);
        return;
      }

      // CONGELAR objeto user para prevenir modificaciones
      Object.freeze(userData);
      if (userData.role) Object.freeze(userData.role);
      if (userData.permissions) userData.permissions.forEach(p => Object.freeze(p));
      setUser(userData);

      // ✅ VALIDACIÓN CONTRA BACKEND EN BACKGROUND - SIN BLOQUEO NI DELAY
      // Se ejecuta después de renderizar la página, no afecta velocidad
      const validateInBackground = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('token_timestamp');
            setUser(null);
            window.location.href = '/login';
          }
        } catch {
          // Silencioso - no interrumpir al usuario si hay error de red
        }
      };

      // Ejecutar validación en background SIN DELAY
      setTimeout(validateInBackground, 0);

    } catch (error) {
      console.warn('Token inválido:', error.message);
      // Invalid token, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_timestamp');
      setUser(null);
    }

    setLoading(false);
  }, [validateTokenIntegrity]);

  useEffect(() => {
    if (!user) return;

    const handleForceLogout = () => {
      logout();
      // Mostrar mensaje al usuario
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
    
    // CONGELAR usuario antes de guardar en estado
    const userData = { ...res.user };
    Object.freeze(userData);
    if (userData.role) Object.freeze(userData.role);
    if (userData.permissions) userData.permissions.forEach(p => Object.freeze(p));
    setUser(userData);

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
    
    // CONGELAR usuario
    const userData = { ...res.user };
    Object.freeze(userData);
    if (userData.role) Object.freeze(userData.role);
    if (userData.permissions) userData.permissions.forEach(p => Object.freeze(p));
    setUser(userData);
    
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
    Object.freeze(newUser);
    if (newUser.role) Object.freeze(newUser.role);
    if (newUser.permissions) newUser.permissions.forEach(p => Object.freeze(p));
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const checkPermission = useCallback((module, action) => {
    // Los administradores tienen acceso completo a todo
    if (user?.role?.name === 'Administrador') {
      return true;
    }
    
    if (!user || !user.permissions) return false;

    return user.permissions.some(permission =>
      permission.module === module && permission.action === action
    );
  }, [user]);

  // Memoizar checkPermission para evitar recálculos innecesarios
  const memoizedCheckPermission = useCallback(checkPermission, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      loading, 
      checkPermission: memoizedCheckPermission,
      isAuthenticated: !!user, 
      hasRole: (role) => user?.role?.name === role, 
      hasAnyRole: (roles) => roles.includes(user?.role?.name), 
      canAccess: (module) => memoizedCheckPermission(module, 'view') || user?.role?.name === 'Administrador' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
