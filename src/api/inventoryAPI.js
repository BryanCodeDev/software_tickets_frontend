import api from './api';

const inventoryAPI = {
  fetchInventory: async () => {
    try {
      const response = await api.get('/inventory');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },

  fetchInventoryById: async (id) => {
    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  },

  createInventoryItem: async (itemData) => {
    try {
      const { propiedad, it, area, responsable, serial, capacidad, ram, marca, status, location, warrantyExpiry } = itemData;
      const response = await api.post('/inventory', {
        propiedad,
        it,
        area,
        responsable,
        serial,
        capacidad,
        ram,
        marca,
        status,
        location,
        warrantyExpiry
      });
      return response.data;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  },

  updateInventoryItem: async (id, itemData) => {
    try {
      const { propiedad, it, area, responsable, serial, capacidad, ram, marca, status, location, warrantyExpiry } = itemData;
      const response = await api.put(`/inventory/${id}`, {
        propiedad,
        it,
        area,
        responsable,
        serial,
        capacidad,
        ram,
        marca,
        status,
        location,
        warrantyExpiry
      });
      return response.data;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  deleteInventoryItem: async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },

  detectHardware: async () => {
    try {
      const response = await api.get('/inventory/detect/hardware');
      return response.data;
    } catch (error) {
      console.error('Error detecting hardware:', error);
      throw error;
    }
  },
};

export default inventoryAPI;