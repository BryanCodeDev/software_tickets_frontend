import api from './api';

const tabletInventoryAPI = {
  fetchTabletInventory: async () => {
    try {
      const response = await api.get('/tablet-inventory');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchTabletInventory: async (query) => {
    try {
      const response = await api.get(`/tablet-inventory/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchTabletInventoryById: async (id) => {
    try {
      const response = await api.get(`/tablet-inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTabletInventoryItem: async (itemData) => {
    try {
      const { propiedad, it, area, responsable, serial, capacidad_almacenamiento, ram, marca, modelo, pantalla, sistema_operativo, status, warrantyExpiry, purchaseDate, lastMaintenance, cost } = itemData;
      const response = await api.post('/tablet-inventory', {
        propiedad,
        it,
        area,
        responsable,
        serial,
        capacidad_almacenamiento,
        ram,
        marca,
        modelo,
        pantalla,
        sistema_operativo,
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

  updateTabletInventoryItem: async (id, itemData) => {
    try {
      const { propiedad, it, area, responsable, serial, capacidad_almacenamiento, ram, marca, modelo, pantalla, sistema_operativo, status, warrantyExpiry, purchaseDate, lastMaintenance, cost } = itemData;
      const response = await api.put(`/tablet-inventory/${id}`, {
        propiedad,
        it,
        area,
        responsable,
        serial,
        capacidad_almacenamiento,
        ram,
        marca,
        modelo,
        pantalla,
        sistema_operativo,
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

  deleteTabletInventoryItem: async (id) => {
    try {
      await api.delete(`/tablet-inventory/${id}`);
    } catch (error) {
      throw error;
    }
  },

  fetchUniqueITs: async () => {
    try {
      const response = await api.get('/tablet-inventory/unique/its');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default tabletInventoryAPI;