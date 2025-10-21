import api from '../utils/api';

export const cobrandingLegalService = {
  // Get all co-branding partnerships
  getCobrandingPartnerships: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr/cobranding/partnerships?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single co-branding partnership
  getCobrandingPartnership: async (partnershipId) => {
    try {
      const response = await api.get(`/api/csr/cobranding/partnerships/${partnershipId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new co-branding partnership
  createCobrandingPartnership: async (partnershipData) => {
    try {
      const response = await api.post('/api/csr/cobranding/partnerships', partnershipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update co-branding partnership
  updateCobrandingPartnership: async (partnershipId, partnershipData) => {
    try {
      const response = await api.put(`/api/csr/cobranding/partnerships/${partnershipId}`, partnershipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update contract status
  updateContractStatus: async (partnershipId, contractStatus, notes = '') => {
    try {
      const response = await api.put(`/api/csr/cobranding/partnerships/${partnershipId}/contract-status`, {
        contractStatus,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add communication log entry
  addCommunicationLog: async (partnershipId, communicationData) => {
    try {
      const response = await api.post(`/api/csr/cobranding/partnerships/${partnershipId}/communication`, communicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add brand asset
  addBrandAsset: async (partnershipId, assetData) => {
    try {
      const response = await api.post(`/api/csr/cobranding/partnerships/${partnershipId}/assets`, assetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add legal document
  addLegalDocument: async (partnershipId, documentData) => {
    try {
      const response = await api.post(`/api/csr/cobranding/partnerships/${partnershipId}/legal-documents`, documentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Associate campaign with partnership
  associateCampaign: async (partnershipId, campaignData) => {
    try {
      const response = await api.post(`/api/csr/cobranding/partnerships/${partnershipId}/associate-campaign`, campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get expiring contracts
  getExpiringContracts: async (days = 30) => {
    try {
      const response = await api.get(`/api/csr/cobranding/expiring-contracts?days=${days}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get compliance dashboard
  getComplianceDashboard: async (organizationId = null) => {
    try {
      const params = organizationId ? `?organizationId=${organizationId}` : '';
      const response = await api.get(`/api/csr/cobranding/compliance-dashboard${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete co-branding partnership
  deleteCobrandingPartnership: async (partnershipId) => {
    try {
      const response = await api.delete(`/api/csr/cobranding/partnerships/${partnershipId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get compliance dashboard with statistics
  getComplianceDashboard: async (organizationId = null) => {
    try {
      const params = organizationId ? `?organizationId=${organizationId}` : '';
      const response = await api.get(`/api/csr/cobranding/compliance-dashboard${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default cobrandingLegalService;
