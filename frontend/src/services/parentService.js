import api from '../utils/api';

export const parentService = {
  // Get all children for the parent
  getChildren: async () => {
    try {
      const response = await api.get('/api/parent/children');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get detailed progress for a specific child
  getChildProgress: async (childId) => {
    try {
      const response = await api.get(`/api/parent/child/${childId}/progress`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate progress report for a child
  generateReport: async (childId, format = 'pdf') => {
    try {
      const response = await api.post(`/api/parent/child/${childId}/report`, { format });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await api.put('/api/parent/notifications', { preferences });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download report
  downloadReport: (childId, format = 'pdf') => {
    return `${api.defaults.baseURL}/api/parent/child/${childId}/download-report?format=${format}`;
  }
};

export default parentService;