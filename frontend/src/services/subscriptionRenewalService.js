import api from '../utils/api';

export const subscriptionRenewalService = {
  // Get all subscription renewal requests
  getRenewalRequests: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/api/admin/school-approvals/subscription-renewals?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single renewal request by ID
  getRenewalRequestById: async (requestId) => {
    try {
      const response = await api.get(`/api/admin/school-approvals/subscription-renewals/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve renewal request
  approveRenewal: async (requestId, data = {}) => {
    try {
      const response = await api.put(`/api/admin/school-approvals/subscription-renewals/${requestId}/approve`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject renewal request
  rejectRenewal: async (requestId, data = {}) => {
    try {
      const response = await api.put(`/api/admin/school-approvals/subscription-renewals/${requestId}/reject`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

