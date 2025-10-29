import api from './api';

const usersAPI = {
  fetchUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener usuarios';
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener usuario';
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar usuario';
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al eliminar usuario';
    }
  },

  // Profile management
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener perfil';
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      return response.data.user;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar perfil';
    }
  },

  changePassword: async (data) => {
    try {
      const response = await api.put('/users/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al cambiar contraseña';
    }
  },

  // Settings management
  getSettings: async () => {
    try {
      const response = await api.get('/users/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener configuración';
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/users/settings', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al guardar configuración';
    }
  },
};

export default usersAPI;