// services/educatorService.js
import axios from "axios";

// 📊 Dashboard data
export const fetchEducatorDashboard = () =>
  axios.get("/api/educators/dashboard", { withCredentials: true });

// 📤 Export student CSV
export const exportStudentCSV = () =>
  axios.get("/api/educators/export", {
    withCredentials: true,
    responseType: "blob",
  });

// 👨‍🎓 Students under educator
export const fetchStudentsForEducator = () =>
  axios.get("/api/educators/students", { withCredentials: true });

// ✍️ Submit feedback to student
export const submitStudentFeedback = (studentId, feedback) =>
  axios.post(`/api/educators/feedback/${studentId}`, feedback, {
    withCredentials: true,
  });

// 📚 Create or update lesson plan
export const createLessonPlan = (plan) =>
  axios.post("/api/educators/lesson-plans", plan, { withCredentials: true });

// 📝 Create assignment
export const createAssignment = (assignment) =>
  axios.post("/api/educators/assignments", assignment, { withCredentials: true });

// 🧪 Create quiz or assessment
export const createQuiz = (quiz) =>
  axios.post("/api/educators/quizzes", quiz, { withCredentials: true });

// 📄 Get all students (for admin usage or future tool expansion)
export const fetchAllStudents = () =>
  axios.get("/api/admin/students", { withCredentials: true });

export const fetchStudentProgress = async (studentId) => {
  const res = await axios.get(`/api/educators/student/${studentId}/overview`, {
    withCredentials: true,
  });
  return res.data;
};

// 📊 Get detailed student activity data
export const fetchStudentActivity = async (studentId, period = 'week') => {
  const res = await axios.get(`/api/educators/student/${studentId}/activity`, {
    params: { period },
    withCredentials: true,
  });
  return res.data;
};

// 📝 Get student feedback history
export const fetchStudentFeedback = async (studentId) => {
  const res = await axios.get(`/api/educators/feedback/${studentId}`, {
    withCredentials: true,
  });
  return res.data;
};