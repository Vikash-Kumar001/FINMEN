// services/adminEducatorService.js
import api from "../utils/api";

/**
 * Service for admin to track and manage educators
 * Provides functions for real-time tracking and educator account management
 */

// Get all educators (approved)
export const getAllEducators = async () => {
  try {
    const res = await api.get("/admin/educators");
    return res.data;
  } catch (error) {
    console.error("Error fetching all educators:", error.message);
    throw error;
  }
};

// Get pending educators awaiting approval
export const getPendingEducators = async () => {
  try {
    const res = await api.get("/admin/educators/pending");
    return res.data;
  } catch (error) {
    console.error("Error fetching pending educators:", error.message);
    throw error;
  }
};

// Approve an educator
export const approveEducator = async (educatorId) => {
  try {
    const res = await api.put(`/admin/educators/approve/${educatorId}`);
    return res.data;
  } catch (error) {
    console.error("Error approving educator:", error.message);
    throw error;
  }
};

// Reject/block an educator
export const rejectEducator = async (educatorId, reason) => {
  try {
    const res = await api.put(`/admin/educators/reject/${educatorId}`, { reason });
    return res.data;
  } catch (error) {
    console.error("Error rejecting educator:", error.message);
    throw error;
  }
};

// Create a new educator account
export const createEducator = async (educatorData) => {
  try {
    const res = await api.post("/admin/users/create", {
      ...educatorData,
      role: "educator"
    });
    return res.data;
  } catch (error) {
    console.error("Error creating educator account:", error.message);
    throw error;
  }
};

// Get educator activity logs
export const getEducatorActivityLogs = async (educatorId, filters = {}) => {
  try {
    const res = await api.get(`/admin/educators/${educatorId}/activities`, {
      params: filters
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching educator activity logs:", error.message);
    throw error;
  }
};

// Get educator activities with pagination
export const getEducatorActivities = async (educatorId, params = {}) => {
  try {
    const { startDate, endDate, activityType, limit, page } = params;
    let url = `/admin/educators/${educatorId}/activities`;
    
    // Add query parameters if provided
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (activityType) queryParams.append('activityType', activityType);
    if (limit) queryParams.append('limit', limit);
    if (page) queryParams.append('page', page);
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching educator activities:", error.message);
    throw error;
  }
};

// Get educator statistics
export const getEducatorStats = async () => {
  try {
    const res = await api.get("/admin/educators/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching educator statistics:", error.message);
    throw error;
  }
};

// Export educators data as CSV
export const exportEducatorsCSV = async () => {
  try {
    const res = await api.get("/admin/educators/export", {
      responseType: "blob"
    });
    return res.data;
  } catch (error) {
    console.error("Error exporting educators data:", error.message);
    throw error;
  }
};