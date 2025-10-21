import api from '../utils/api';

export const budgetTrackingService = {
  // Get live budget tracking
  getLiveBudgetTracking: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/budget-tracking/budget-tracking?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get budget alerts
  getBudgetAlerts: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/budget-tracking/budget-alerts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Acknowledge alert
  acknowledgeAlert: async (alertId, acknowledgmentData) => {
    try {
      const response = await api.put(`/api/budget-tracking/budget-alerts/${alertId}/acknowledge`, acknowledgmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Resolve alert
  resolveAlert: async (alertId, resolutionData) => {
    try {
      const response = await api.put(`/api/budget-tracking/budget-alerts/${alertId}/resolve`, resolutionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create budget alert
  createBudgetAlert: async (alertData) => {
    try {
      const response = await api.post('/api/budget-tracking/budget-alerts', alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check threshold alerts
  checkThresholdAlerts: async (campaignId = null) => {
    try {
      const params = campaignId ? new URLSearchParams({ campaignId }) : '';
      const response = await api.post(`/api/budget-tracking/budget-alerts/check-thresholds?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get budget analytics
  getBudgetAnalytics: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/budget-tracking/budget-analytics?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default budgetTrackingService;
