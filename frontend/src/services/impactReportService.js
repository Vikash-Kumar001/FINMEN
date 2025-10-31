import api from '../utils/api';

export const impactReportService = {
  // Get all impact reports
  getImpactReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr/reports?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single impact report
  getImpactReport: async (reportId) => {
    try {
      const response = await api.get(`/api/csr/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate new impact report
  generateImpactReport: async (reportData) => {
    try {
      const response = await api.post('/api/csr/reports/generate', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate automated report
  generateAutomatedReport: async (reportType, period, campaignId = null) => {
    try {
      const response = await api.post('/api/csr/reports/automated', {
        reportType,
        period,
        campaignId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update impact report
  updateImpactReport: async (reportId, reportData) => {
    try {
      const response = await api.put(`/api/csr/reports/${reportId}`, reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Publish impact report
  publishImpactReport: async (reportId, isPublic = false, sharedWith = []) => {
    try {
      const response = await api.put(`/api/csr/reports/${reportId}/publish`, {
        isPublic,
        sharedWith
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export impact report
  exportImpactReport: async (reportId, format = 'json') => {
    try {
      const response = await api.get(`/api/csr/reports/${reportId}/export?format=${format}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      if (format === 'csv') {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `impact-report-${reportId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Download started' };
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete impact report
  deleteImpactReport: async (reportId) => {
    try {
      const response = await api.delete(`/api/csr/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default impactReportService;
