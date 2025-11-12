import api from "../utils/api";

export const fetchSchoolApprovalDashboard = async () => {
  const response = await api.get("/api/admin/school-approvals/dashboard");
  return response.data;
};

export const fetchPendingSchoolApprovals = async (params = {}) => {
  const response = await api.get("/api/admin/school-approvals/pending", { params });
  return response.data;
};

export const fetchSchoolApprovalHistory = async (params = {}) => {
  const response = await api.get("/api/admin/school-approvals/history", { params });
  return response.data;
};

export const approveSchool = async (companyId, payload = {}) => {
  const response = await api.put(`/api/admin/school-approvals/${companyId}/approve`, payload);
  return response.data;
};

export const rejectSchool = async (companyId, payload = {}) => {
  const response = await api.put(`/api/admin/school-approvals/${companyId}/reject`, payload);
  return response.data;
};

export const updatePendingSchool = async (companyId, payload = {}) => {
  const response = await api.put(`/api/admin/school-approvals/${companyId}/update`, payload);
  return response.data;
};

