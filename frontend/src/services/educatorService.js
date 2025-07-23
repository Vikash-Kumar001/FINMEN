// services/educatorService.js
import api from "../utils/api";

// 📊 Dashboard data
export const fetchEducatorDashboard = () =>
  api.get("/api/educators/dashboard");

// 📤 Export student CSV
export const exportStudentCSV = () =>
  api.get("/api/educators/export", {
    responseType: "blob",
  });

// 👨‍🎓 Students under educator
export const fetchStudentsForEducator = () =>
  api.get("/api/educators/students");

// ✍️ Submit feedback to student
export const submitStudentFeedback = (studentId, feedback) =>
  api.post(`/api/educators/feedback/${studentId}`, feedback);

// 📚 Create or update lesson plan
export const createLessonPlan = (plan) =>
  api.post("/api/educators/lesson-plans", plan);

// 📝 Create assignment
export const createAssignment = (assignment) =>
  api.post("/api/educators/assignments", assignment);

// 🧪 Create quiz or assessment
export const createQuiz = (quiz) =>
  api.post("/api/educators/quizzes", quiz);

// 📄 Get all students (for admin usage or future tool expansion)
export const fetchAllStudents = () =>
  api.get("/api/admin/students");

export const fetchStudentProgress = async (studentId) => {
  const res = await api.get(`/api/educators/student/${studentId}/overview`);
  return res.data;
};

// 📊 Get detailed student activity data
export const fetchStudentActivity = async (studentId, period = 'week') => {
  const res = await api.get(`/api/educators/student/${studentId}/activity`, {
    params: { period },
  });
  return res.data;
};

// 📝 Get student feedback history
export const fetchStudentFeedback = async (studentId) => {
  const res = await api.get(`/api/educators/feedback/${studentId}`);
  return res.data;
};