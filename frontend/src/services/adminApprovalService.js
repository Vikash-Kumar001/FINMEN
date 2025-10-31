import api from '../utils/api';

/**
 * Admin Approval Service - API calls for dual-approval system
 */

export const createApprovalRequest = async (requestData) => {
  try {
    const response = await api.post('/api/admin/approvals/requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating approval request:', error);
    throw error;
  }
};

export const getApprovalRequests = async (status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/api/admin/approvals/requests', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching approval requests:', error);
    throw error;
  }
};

export const approveRequest = async (requestId, comments = '') => {
  try {
    const response = await api.put(`/api/admin/approvals/requests/${requestId}/approve`, { comments });
    return response.data;
  } catch (error) {
    console.error('Error approving request:', error);
    throw error;
  }
};

export const rejectRequest = async (requestId, reason = '') => {
  try {
    const response = await api.put(`/api/admin/approvals/requests/${requestId}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

export const accessApprovedData = async (requestId, fields = []) => {
  try {
    const response = await api.post(`/api/admin/approvals/requests/${requestId}/access`, { fields });
    return response.data;
  } catch (error) {
    console.error('Error accessing approved data:', error);
    throw error;
  }
};

export const getApprovalStats = async () => {
  try {
    const response = await api.get('/api/admin/approvals/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    throw error;
  }
};

export default {
  createApprovalRequest,
  getApprovalRequests,
  approveRequest,
  rejectRequest,
  accessApprovedData,
  getApprovalStats
};

