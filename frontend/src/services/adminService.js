import api from "../utils/api";

// Educators
export const getPendingEducators = () => api.get("/admin/educators/pending");
export const approveEducator = (id) =>
  api.put(`/admin/educators/approve/${id}`);
export const blockEducator = (id) => api.put(`/admin/educators/block/${id}`);

// Students
export const getAllStudents = () => api.get("/admin/students");

// CSV Export
export const exportUsersToCSV = () => {
  return api.get("/admin/export/csv", {
    responseType: "blob",
  });
};
