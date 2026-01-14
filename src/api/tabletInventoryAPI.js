import api from './api';

const tabletInventoryAPI = {
  fetchTabletInventory: async () => {
    const response = await api.get('/tablet-inventory');
    return response.data;
  },

  searchTabletInventory: async (query) => {
    const response = await api.get(`/tablet-inventory/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  fetchTabletInventoryById: async (id) => {
    const response = await api.get(`/tablet-inventory/${id}`);
    return response.data;
  },

  createTabletInventoryItem: async (itemData) => {
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
  },

  updateTabletInventoryItem: async (id, itemData) => {
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
  },

  deleteTabletInventoryItem: async (id) => {
    await api.delete(`/tablet-inventory/${id}`);
  },

  fetchUniqueITs: async () => {
    const response = await api.get('/tablet-inventory/unique/its');
    return response.data;
  },

  getHistory: async (id) => {
    const response = await api.get(`/tablet-inventory/${id}/history`);
    return response.data;
  },
};

export default tabletInventoryAPI;