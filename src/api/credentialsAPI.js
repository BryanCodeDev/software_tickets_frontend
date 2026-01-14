import api from './api';

const credentialsAPI = {
  fetchCredentials: async () => {
    const response = await api.get('/credentials');
    return response.data;
  },

  fetchCredentialById: async (id) => {
    const response = await api.get(`/credentials/${id}`);
    return response.data;
  },

  createCredential: async (credentialData) => {
    const response = await api.post('/credentials', credentialData);
    return response.data;
  },

  updateCredential: async (id, credentialData) => {
    const response = await api.put(`/credentials/${id}`, credentialData);
    return response.data;
  },

  deleteCredential: async (id) => {
    await api.delete(`/credentials/${id}`);
  },

  fetchFolders: async () => {
    const response = await api.get('/credentials/folders');
    return response.data;
  },

  createFolder: async (folderData) => {
    const response = await api.post('/credentials/folders', folderData);
    return response.data;
  },

  updateFolder: async (id, folderData) => {
    const response = await api.put(`/credentials/folders/${id}`, folderData);
    return response.data;
  },

  deleteFolder: async (id) => {
    await api.delete(`/credentials/folders/${id}`);
  },
};

export default credentialsAPI;
