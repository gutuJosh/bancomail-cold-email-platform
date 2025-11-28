import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

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
  getAll: async (apiKey:string) => {
    const response = await api.get(`/email-accounts?apiKey=${apiKey}`);
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
  getAll: async (apiKey:string) => {
    const response = await api.get(`/campaigns?apiKey=${apiKey}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },
  create: async (data: { name: string; subject: string; content: string,  email_account_ids:[], settings:UnknownKeyedObject, steps:UnknownKeyedObject }) => {
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
  getAll: async (parameters:{apiKey: string, campaignId?: number, page?: number, per_page?: number, sort?: string}) => {

    let query = '?';
    
    // Object.entries() gives you an array of [key, value] tuples.
    for (const [key, value] of Object.entries(parameters)) {
      
      // The 'value' is correctly typed as 'string | number | undefined'.
      
      // We check if the value is defined and not null (standard way to handle optional properties)
      if (value !== undefined && value !== null) { 
          query += `${key}=${encodeURIComponent(value)}&`;
      }
    }
    
    // Remove the trailing '&' or '?' if no params were added
    if (query.endsWith('&')) {
        query = query.slice(0, -1);
    } else if (query === '?') {
        query = '';
    }

    
    const url = `/prospects${query}`;
    const response = await api.get(url);
    return response.data;
  },
  upload: async (apiKey:string, campaignId: number, prospects: any[]) => {
    const response = await api.post('/prospects/upload', { apiKey, campaignId, prospects });
    return response.data;
  },
};

export const statsAPI = {
  getCampaignStats: async (campaignId?: number) => {
    const url = campaignId ? `/stats?campaignId=${campaignId}` : '/stats'; 
    const response = await api.get(url);
    return response.data;
  },
};



export default api;
