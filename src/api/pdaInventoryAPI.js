import api from './api';

const pdaInventoryAPI = {
  fetchPDAInventory: async () => {
    try {
      const response = await api.get('/pda-inventory');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchPDAInventory: async (query) => {
    try {
      const response = await api.get(`/pda-inventory/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchPDAInventoryById: async (id) => {
    try {
      const response = await api.get(`/pda-inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPDAInventoryItem: async (itemData) => {
    try {
      const {
        propiedad,
        it,
        area,
        responsable,
        serial,
        tipo_conectividad,
        capacidad_almacenamiento,
        ram,
        marca,
        modelo,
        sistema_operativo,
        aplicaciones,
        status,
        warrantyExpiry,
        purchaseDate,
        lastMaintenance,
        cost
      } = itemData;
      
      const response = await api.post('/pda-inventory', {
        propiedad,
        it,
        area,
        responsable,
        serial,
        tipo_conectividad,
        capacidad_almacenamiento,
        ram,
        marca,
        modelo,
        sistema_operativo,
        aplicaciones,
        status,
        warrantyExpiry,
        purchaseDate,
        lastMaintenance,
        cost
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePDAInventoryItem: async (id, itemData) => {
    try {
      const {
        propiedad,
        it,
        area,
        responsable,
        serial,
        tipo_conectividad,
        capacidad_almacenamiento,
        ram,
        marca,
        modelo,
        sistema_operativo,
        aplicaciones,
        status,
        warrantyExpiry,
        purchaseDate,
        lastMaintenance,
        cost
      } = itemData;
      
      const response = await api.put(`/pda-inventory/${id}`, {
        propiedad,
        it,
        area,
        responsable,
        serial,
        tipo_conectividad,
        capacidad_almacenamiento,
        ram,
        marca,
        modelo,
        sistema_operativo,
        aplicaciones,
        status,
        warrantyExpiry,
        purchaseDate,
        lastMaintenance,
        cost
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePDAInventoryItem: async (id) => {
    try {
      await api.delete(`/pda-inventory/${id}`);
    } catch (error) {
      throw error;
    }
  },

  fetchUniqueITs: async () => {
    try {
      const response = await api.get('/pda-inventory/unique/its');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default pdaInventoryAPI;