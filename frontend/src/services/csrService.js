import api from '../utils/api';

export const csrService = {
  // Impact Metrics
  getImpactMetrics: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr/impact?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Regional Data
  getRegionalData: async (period = 'month') => {
    try {
      const response = await api.get(`/api/csr/regional?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Trend Analysis
  getTrendData: async (period = 'month', metric = 'students') => {
    try {
      const response = await api.get(`/api/csr/trends?period=${period}&metric=${metric}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Report Generation
  generateReport: async (reportConfig) => {
    try {
      const response = await api.post('/api/csr/reports/generate', reportConfig);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Schedule Reports
  scheduleReports: async (scheduleConfig) => {
    try {
      const response = await api.post('/api/csr/reports/schedule', scheduleConfig);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export Reports
  exportReport: async (format = 'pdf', filters = {}) => {
    try {
      const response = await api.post('/api/csr/reports/generate', {
        format,
        ...filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download Report
  downloadReport: (reportId, format = 'pdf') => {
    return `${api.defaults.baseURL}/api/csr/reports/download?id=${reportId}&format=${format}`;
  },

  // Share Report
  shareReport: async (reportId, recipients) => {
    try {
      const response = await api.post('/api/csr/reports/share', {
        reportId,
        recipients
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrService;