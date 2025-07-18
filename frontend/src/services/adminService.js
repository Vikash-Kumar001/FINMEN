import api from "../utils/api";

// Fetch analytics data for AdminAnalytics
export const fetchAnalyticsData = async (filters = {}) => {
    try {
        const response = await api.get("/api/admin/analytics", { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch analytics data');
    }
};

// Educators
export const getPendingEducators = () => api.get("/api/admin/educators/pending");
export const approveEducator = (id) =>
    api.put(`/api/admin/educators/approve/${id}`);
export const blockEducator = (id) => api.put(`/api/admin/educators/block/${id}`);
export const fetchAllEducators = () => api.get("/api/admin/educators");
export const deleteEducator = (educatorId) =>
    api.delete(`/api/admin/educators/${educatorId}`);
export const exportEducatorData = () =>
    api.get("/api/admin/educators/export/csv", {
        responseType: "blob",
    });
export const fetchEducatorStats = () =>
    api.get("/api/admin/educators/stats");
export const sendBulkEducatorMessage = ({ recipients, subject, message }) =>
    api.post("/api/admin/educators/bulk-message", { recipients, subject, message });
export const createEducatorAccount = (educatorData) =>
    api.post("/api/admin/educators/create", educatorData);

// Students
export const fetchAllStudents = () => api.get("/api/admin/students");
export const updateStudentStatus = (studentId, status) =>
    api.put(`/api/admin/students/${studentId}/status`, { status });
export const deleteStudent = (studentId) =>
    api.delete(`/api/admin/students/${studentId}`);
export const exportStudentData = () =>
    api.get("/api/admin/students/export/csv", {
        responseType: "blob",
    });
export const fetchStudentStats = () =>
    api.get("/api/admin/students/stats");
export const sendBulkMessage = ({ recipients, subject, message }) =>
    api.post("/api/admin/students/bulk-message", { recipients, subject, message });
export const createStudentAccount = (studentData) =>
    api.post("/api/admin/students/create", studentData);

// Users
export const fetchUsers = async (filters = {}) => {
    try {
        const response = await api.get("/api/admin/users", { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
};

// CSV Export for Users
export const exportUsersToCSV = () =>
    api.get("/api/admin/export/csv", {
        responseType: "blob",
    });

// System Settings
export const updateSettings = async (settingsData) => {
    try {
        const response = await api.patch("/api/admin/settings", settingsData);
        return response.data;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw new Error(error.response?.data?.message || 'Failed to update settings');
    }
};

// Audit Logs
export const fetchAuditLogs = async (filters = {}) => {
    try {
        const response = await api.get("/api/admin/audit-logs", { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch audit logs');
    }
};

// Security Metrics
export const fetchSecurityMetrics = async () => {
    try {
        const response = await api.get("/api/admin/security-metrics");
        return response.data;
    } catch (error) {
        console.error('Error fetching security metrics:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch security metrics');
    }
};

// Data Management
export const fetchDataManagementStatus = async () => {
    try {
        const response = await api.get("/api/admin/data-management");
        return response.data;
    } catch (error) {
        console.error('Error fetching data management status:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch data management status');
    }
};

// Reports
export const generateReport = async (reportConfig) => {
    try {
        const response = await api.post("/api/admin/reports", reportConfig);
        return response.data;
    } catch (error) {
        console.error('Error generating report:', error);
        throw new Error(error.response?.data?.message || 'Failed to generate report');
    }
};

// Redemptions
export const fetchRedemptions = async (filters = {}) => {
    try {
        const response = await api.get("/api/admin/redemptions", { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching redemptions:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch redemptions');
    }
};

// Educator Tracking
export const fetchEducatorTracking = async (educatorId) => {
    try {
        const response = await api.get(`/api/admin/educators/${educatorId}/tracking`);
        return response.data;
    } catch (error) {
        console.error('Error fetching educator tracking:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch educator tracking data');
    }
};

export default api;