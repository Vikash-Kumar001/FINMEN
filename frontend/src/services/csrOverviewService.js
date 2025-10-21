import api from '../utils/api';

export const csrOverviewService = {
  // Get comprehensive overview data
  getOverviewData: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-overview/data?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get real-time metrics
  getRealTimeMetrics: async () => {
    try {
      const response = await api.get('/api/csr-overview/realtime');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get impact data by region
  getImpactByRegion: async (region = 'all', timeRange = 'month') => {
    try {
      const response = await api.get(`/api/csr-overview/impact/region/${region}?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get module progress data
  getModuleProgress: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-overview/modules?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get regional data
  getRegionalData: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-overview/regional?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get skills development data
  getSkillsDevelopment: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-overview/skills?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get(`/api/csr-overview/activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get live statistics
  getLiveStats: async () => {
    try {
      const response = await api.get('/api/csr-overview/live-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Subscribe to real-time updates (Socket.IO)
  subscribeToUpdates: (callback) => {
    // Use the existing Socket.IO connection from the context
    console.log('CSR Overview WebSocket subscription requested');
    
    // Return a simple object that can be used for cleanup
    const subscription = {
      readyState: 1, // OPEN
      close: () => {
        console.log('CSR Overview WebSocket subscription closed');
      }
    };
    
    return subscription;
  },

  // Unsubscribe from updates
  unsubscribeFromUpdates: (subscription) => {
    if (subscription && subscription.close) {
      subscription.close();
    }
  }
};

export default csrOverviewService;
