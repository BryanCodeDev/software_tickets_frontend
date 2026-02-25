import api from './api';

const inventoryAPI = {
  fetchInventory: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },

  searchInventory: async (query) => {
    const response = await api.get(`/inventory/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  fetchInventoryById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  createInventoryItem: async (itemData) => {
    const { propiedad, it, area, responsable, serial, capacidad, ram, marca, status, warrantyExpiry, purchaseDate, lastMaintenance, cost } = itemData;
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
      warrantyExpiry,
      purchaseDate,
      lastMaintenance,
      cost
    });
    return response.data;
  },

  updateInventoryItem: async (id, itemData) => {
    const { propiedad, it, area, responsable, serial, capacidad, ram, marca, status, warrantyExpiry, purchaseDate, lastMaintenance, cost } = itemData;
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
      warrantyExpiry,
      purchaseDate,
      lastMaintenance,
      cost
    });
    return response.data;
  },

  deleteInventoryItem: async (id) => {
    await api.delete(`/inventory/${id}`);
  },

  detectHardware: async () => {
    const response = await api.get('/inventory/detect/hardware');
    return response.data;
  },

  fetchUniqueITs: async () => {
    const response = await api.get('/inventory/unique/its');
    return response.data;
  },

  getHistory: async (id) => {
    const response = await api.get(`/inventory/${id}/history`);
    return response.data;
  },
};

export default inventoryAPI;
