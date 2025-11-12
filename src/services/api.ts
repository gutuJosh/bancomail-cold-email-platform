import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: async (apiKey: string) => {
    const response = await api.post('/auth/login', { apiKey });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  verifySession: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export const emailAccountsAPI = {
  getAll: async () => {
    const response = await api.get('/email-accounts');
    return response.data;
  },
  create: async (data: { email: string; name: string; provider: string }) => {
    const response = await api.post('/email-accounts', data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/email-accounts/${id}`);
    return response.data;
  },
};

export const campaignsAPI = {
  getAll: async () => {
    const response = await api.get('/campaigns');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },
  create: async (data: { name: string; subject: string; content: string }) => {
    const response = await api.post('/campaigns', data);
    return response.data;
  },
  update: async (id: number, data: { name: string; subject: string; content: string; status?: string }) => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },
  start: async (id: number) => {
    const response = await api.post(`/campaigns/${id}/start`);
    return response.data;
  },
  pause: async (id: number) => {
    const response = await api.post(`/campaigns/${id}/pause`);
    return response.data;
  },
};

export const prospectsAPI = {
  getAll: async (campaignId?: number) => {
    const url = campaignId ? `/prospects?campaignId=${campaignId}` : '/prospects';
    const response = await api.get(url);
    return response.data;
  },
  upload: async (campaignId: number, prospects: any[]) => {
    const response = await api.post('/prospects/upload', { campaignId, prospects });
    return response.data;
  },
};

export const statsAPI = {
  getCampaignStats: async (campaignId?: number) => {
    const url = campaignId ? `/stats/${campaignId}` : '/stats';
    const response = await api.get(url);
    return response.data;
  },
};

export default api;
