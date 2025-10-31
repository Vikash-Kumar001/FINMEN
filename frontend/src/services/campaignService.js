import api from '../utils/api';

export const campaignService = {
  // Get all campaigns with filtering and pagination
  getCampaigns: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr/campaigns?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single campaign details
  getCampaign: async (campaignId) => {
    try {
      const response = await api.get(`/api/csr/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new campaign
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/api/csr/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update campaign
  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(`/api/csr/campaigns/${campaignId}`, campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update campaign workflow stage
  updateCampaignStage: async (campaignId, stage, data = {}) => {
    try {
      const response = await api.put(`/api/csr/campaigns/${campaignId}/stage`, {
        stage,
        data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve campaign
  approveCampaign: async (campaignId, isApproved, notes = '') => {
    try {
      const response = await api.put(`/api/csr/campaigns/${campaignId}/approve`, {
        isApproved,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete campaign
  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/api/csr/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get campaign templates
  getCampaignTemplates: async () => {
    try {
      const response = await api.get('/api/csr/campaigns/templates');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get campaign metrics
  getCampaignMetrics: async (campaignId) => {
    try {
      const response = await api.get(`/api/csr/campaigns/${campaignId}/metrics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default campaignService;
