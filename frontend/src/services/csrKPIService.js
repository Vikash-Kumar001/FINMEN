import api from '../utils/api';

export const csrKPIService = {
  // Get comprehensive CSR KPIs
  getKPIs: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-kpis/kpis?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get KPI trends over time
  getKPITrends: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-kpis/kpis/trends?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refresh KPIs (recalculate from scratch)
  refreshKPIs: async (data = {}) => {
    try {
      const response = await api.post('/api/csr-kpis/kpis/refresh', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export KPIs data
  exportKPIs: async (format = 'json', filters = {}) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await api.get(`/api/csr-kpis/kpis/export?${params}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download exported file
  downloadKPIs: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await api.get(`/api/csr-kpis/kpis/export?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `csr-kpis-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started' };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrKPIService;
