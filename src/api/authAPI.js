import api from './api';

const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al iniciar sesión';
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al registrarse';
    }
  },
};

export default authAPI;