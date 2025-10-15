import api from "../utils/api";

/**
 * Parent Dashboard API Service
 * Provides centralized API calls for parent features with consistent error handling
 */

// ================== PARENT APIS ==================

/**
 * Fetch all children linked to the parent
 */
export const fetchParentChildren = async () => {
  try {
    const response = await api.get("/api/parent/children");
    return response.data;
  } catch (error) {
    console.error("Error fetching children:", error);
    throw error;
  }
};

/**
 * Fetch comprehensive analytics for a specific child
 * @param {string} childId - The child's user ID
 */
export const fetchChildAnalytics = async (childId) => {
  try {
    const response = await api.get(`/api/parent/child/${childId}/analytics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching child analytics:", error);
    throw error;
  }
};

/**
 * Fetch detailed progress for a specific child (legacy)
 * @param {string} childId - The child's user ID
 */
export const fetchChildProgress = async (childId) => {
  try {
    const response = await api.get(`/api/parent/child/${childId}/progress`);
    return response.data;
  } catch (error) {
    console.error("Error fetching child progress:", error);
    throw error;
  }
};

/**
 * Generate progress report for a child
 * @param {string} childId - The child's user ID
 * @param {string} format - Report format (pdf, json)
 */
export const generateChildReport = async (childId, format = 'pdf') => {
  try {
    const response = await api.post(`/api/parent/child/${childId}/report`, { format });
    return response.data;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

/**
 * Update parent notification preferences
 * @param {object} preferences - Notification preferences object
 */
export const updateParentNotifications = async (preferences) => {
  try {
    const response = await api.put("/api/parent/notifications", { preferences });
    return response.data;
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error;
  }
};

/**
 * Fetch single child data (legacy endpoint)
 */
export const fetchSingleChildData = async () => {
  try {
    const response = await api.get("/api/parent/child");
    return response.data;
  } catch (error) {
    console.error("Error fetching child data:", error);
    throw error;
  }
};

/**
 * Fetch parent's permission settings
 */
export const fetchParentPermissions = async () => {
  try {
    const response = await api.get("/api/parent/permissions");
    return response.data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
};

/**
 * Update parent's permission settings
 * @param {object} permissions - Permission settings object
 */
export const updateParentPermissions = async (permissions) => {
  try {
    const response = await api.put("/api/parent/permissions", { permissions });
    return response.data;
  } catch (error) {
    console.error("Error updating permissions:", error);
    throw error;
  }
};

/**
 * Upgrade parent's subscription
 * @param {string} planType - Type of plan to upgrade to
 */
export const upgradeSubscription = async (planType) => {
  try {
    const response = await api.post("/api/parent/upgrade-subscription", { planType });
    return response.data;
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    throw error;
  }
};

/**
 * Toggle email notifications for parent
 * @param {boolean} enabled - Whether to enable or disable email notifications
 */
export const updateEmailNotifications = async (enabled) => {
  try {
    const response = await api.put("/api/parent/email-notifications", { enabled });
    return response.data;
  } catch (error) {
    console.error("Error updating email notifications:", error);
    throw error;
  }
};
