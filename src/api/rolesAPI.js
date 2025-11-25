import api from './api';

const rolesAPI = {
  // Roles CRUD
  fetchRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener roles';
    }
  },

  getRoleById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener rol';
    }
  },

  createRole: async (data) => {
    try {
      const response = await api.post('/roles', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al crear rol';
    }
  },

  updateRole: async (id, data) => {
    try {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar rol';
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al eliminar rol';
    }
  },

  // Permissions
  fetchAllPermissions: async () => {
    try {
      const response = await api.get('/roles/permissions/all');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener permisos';
    }
  },

  fetchPermissionsByModule: async () => {
    try {
      const response = await api.get('/roles/permissions/by-module');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener permisos por módulo';
    }
  },

  // Role permissions management
  updateRolePermissions: async (roleId, permissionIds) => {
    try {
      const response = await api.put(`/roles/${roleId}/permissions`, { permissionIds });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar permisos del rol';
    }
  },
};

export default rolesAPI;