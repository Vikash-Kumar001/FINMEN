import api from '../utils/api';

export const campaignApprovalService = {
  // Create approval request
  createApprovalRequest: async (approvalData) => {
    try {
      const response = await api.post('/api/campaign-approvals/approvals', approvalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get approval requests
  getApprovals: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/campaign-approvals/approvals?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get approval by ID
  getApprovalById: async (approvalId) => {
    try {
      const response = await api.get(`/api/campaign-approvals/approvals/${approvalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update workflow step
  updateWorkflowStep: async (approvalId, stepData) => {
    try {
      const response = await api.put(`/api/campaign-approvals/approvals/${approvalId}/workflow`, stepData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Make approval decision
  makeApprovalDecision: async (approvalId, decisionData) => {
    try {
      const response = await api.put(`/api/campaign-approvals/approvals/${approvalId}/decision`, decisionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update pilot results
  updatePilotResults: async (approvalId, pilotResults) => {
    try {
      const response = await api.put(`/api/campaign-approvals/approvals/${approvalId}/pilot-results`, pilotResults);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get approval statistics
  getApprovalStats: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/campaign-approvals/approvals/stats?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update approval status (helper method)
  updateApprovalStatus: async (approvalId, status) => {
    try {
      const response = await api.put(`/api/campaign-approvals/approvals/${approvalId}/decision`, {
        decision: status,
        reason: status === 'rejected' ? 'Status updated by admin' : null
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default campaignApprovalService;
