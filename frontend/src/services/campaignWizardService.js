import api from '../utils/api';

export const campaignWizardService = {
  // Step 1: Define Scope
  defineScope: async (scopeData) => {
    try {
      const response = await api.post('/api/campaign-wizard/scope', scopeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Step 2: Select Templates
  selectTemplates: async (templateData) => {
    try {
      const response = await api.post('/api/campaign-wizard/templates', templateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Step 3: Configure Pilot
  configurePilot: async (pilotData) => {
    try {
      const response = await api.post('/api/campaign-wizard/pilot', pilotData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Step 4: Set Budget
  setBudget: async (budgetData) => {
    try {
      const response = await api.post('/api/campaign-wizard/budget', budgetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Step 5: Request Approvals
  requestApprovals: async (approvalData) => {
    try {
      const response = await api.post('/api/campaign-wizard/approvals', approvalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Step 6: Launch Campaign
  launchCampaign: async (launchData) => {
    try {
      const response = await api.post('/api/campaign-wizard/launch', launchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get Templates
  getTemplates: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/campaign-wizard/templates?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get Monitoring Data
  getMonitoringData: async (campaignId) => {
    try {
      const response = await api.get(`/api/campaign-wizard/monitoring/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate Report
  generateReport: async (campaignId, reportType = 'comprehensive') => {
    try {
      const response = await api.get(`/api/campaign-wizard/report/${campaignId}/${reportType}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Save Campaign Draft
  saveCampaign: async (campaignData) => {
    try {
      const response = await api.post('/api/campaign-wizard/save', campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create Complete Campaign
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/api/campaign-wizard/create', campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get Campaign Status
  getCampaignStatus: async (campaignId) => {
    try {
      const response = await api.get(`/api/campaign-wizard/status/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update Campaign Step
  updateCampaignStep: async (campaignId, step, stepData) => {
    try {
      const response = await api.put(`/api/campaign-wizard/step/${campaignId}/${step}`, stepData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get Available Schools
  getAvailableSchools: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/campaign-wizard/schools?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get Available Districts
  getAvailableDistricts: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/campaign-wizard/districts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Validate Campaign Data
  validateCampaignData: async (campaignData) => {
    try {
      const response = await api.post('/api/campaign-wizard/validate', campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get Campaign Analytics
  getCampaignAnalytics: async (campaignId, timeRange = '30d') => {
    try {
      const response = await api.get(`/api/campaign-wizard/analytics/${campaignId}?range=${timeRange}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download Campaign Report
  downloadReport: async (campaignId, format = 'pdf') => {
    try {
      const response = await api.get(`/api/campaign-wizard/download/${campaignId}?format=${format}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campaign-report-${campaignId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started' };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get Approval Status
  getApprovalStatus: async (campaignId) => {
    try {
      const response = await api.get(`/api/campaign-wizard/approvals/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Submit Approval Response
  submitApprovalResponse: async (approvalId, response) => {
    try {
      const apiResponse = await api.post(`/api/campaign-wizard/approvals/${approvalId}/respond`, response);
      return apiResponse.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default campaignWizardService;
