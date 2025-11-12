import api from "../utils/api";

export const fetchAdminSchools = async (params = {}) => {
  const response = await api.get("/api/admin/schools", { params });
  return response.data;
};

export const fetchAdminSchoolDetail = async (schoolId) => {
  const response = await api.get(`/api/admin/schools/${schoolId}`);
  return response.data;
};

export const updateAdminSchool = async (schoolId, payload) => {
  const response = await api.put(`/api/admin/schools/${schoolId}`, payload);
  return response.data;
};

export default {
  fetchAdminSchools,
  fetchAdminSchoolDetail,
  updateAdminSchool,
};

