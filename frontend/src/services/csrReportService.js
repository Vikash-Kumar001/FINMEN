import api from '../utils/api';

export const csrReportService = {
  // Generate CSR Report
  generateReport: async (reportData) => {
    try {
      const response = await api.post('/api/csr-reports/reports', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all reports
  getReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-reports/reports?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get report by ID
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/api/csr-reports/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get report status
  getReportStatus: async (reportId) => {
    try {
      const response = await api.get(`/api/csr-reports/reports/${reportId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download report PDF
  downloadReportPDF: async (reportId) => {
    try {
      const response = await api.get(`/api/csr-reports/reports/${reportId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `csr-report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started' };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Share report
  shareReport: async (reportId, shareData) => {
    try {
      const response = await api.post(`/api/csr-reports/reports/${reportId}/share`, shareData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get report analytics
  getReportAnalytics: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-reports/analytics?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export report data
  exportReportData: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await api.get(`/api/csr-reports/export?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `csr-reports-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Export started' };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrReportService;
