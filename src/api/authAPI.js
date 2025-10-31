import api from './api';

const authAPI = {
  login: async (email, password, twoFactorToken = null) => {
    try {
      const response = await api.post('/auth/login', { email, password, twoFactorToken });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al iniciar sesión';
    }
  },

  register: async (name, username, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, username, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al registrarse';
    }
  },
};

export default authAPI;