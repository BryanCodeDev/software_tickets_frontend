import api from './api';

const pdaInventoryAPI = {
  fetchPDAInventory: async () => {
    const response = await api.get('/pda-inventory');
    return response.data;
  },

  searchPDAInventory: async (query) => {
    const response = await api.get(`/pda-inventory/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  fetchPDAInventoryById: async (id) => {
    const response = await api.get(`/pda-inventory/${id}`);
    return response.data;
  },

  createPDAInventoryItem: async (itemData) => {
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
  },

  updatePDAInventoryItem: async (id, itemData) => {
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
  },

  deletePDAInventoryItem: async (id) => {
    await api.delete(`/pda-inventory/${id}`);
  },

  fetchUniqueITs: async () => {
    const response = await api.get('/pda-inventory/unique/its');
    return response.data;
  },

  getHistory: async (id) => {
    const response = await api.get(`/pda-inventory/${id}/history`);
    return response.data;
  },
};

export default pdaInventoryAPI;