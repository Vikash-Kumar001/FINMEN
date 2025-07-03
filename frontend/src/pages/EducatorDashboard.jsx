import React, { useEffect, useState } from "react";
import {
  fetchEducatorDashboard,
  exportStudentCSV,
  fetchStudentsForEducator,
  submitStudentFeedback,
} from "../services/educatorService";

import FeedbackModal from "./FeedbackModal";
import ProgressModal from "../components/ProgressModal";
import FeedbackListModal from "./FeedbackListModal";

const EducatorDashboard = () => {
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showFeedbackList, setShowFeedbackList] = useState(false);
  const [filters, setFilters] = useState({ class: "", minXP: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetchEducatorDashboard();
      setMessage(res.data.message);
    } catch (err) {
      setMessage("⚠️ Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await fetchStudentsForEducator();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportStudentCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("❌ Failed to export student data");
    }
  };

  const handleFeedback = (student) => {
    setSelectedStudent(student);
    setShowFeedbackModal(true);
  };

  const handleProgress = (student) => {
    setSelectedStudent(student);
    setShowProgressModal(true);
  };

  const handleFeedbackHistory = (student) => {
    setSelectedStudent(student);
    setShowFeedbackList(true);
  };

  const applyFilters = (student) => {
    return (
      (!filters.class || student.class === filters.class) &&
      (filters.minXP === 0 || student.progress?.xp >= filters.minXP)
    );
  };

  useEffect(() => {
    fetchDashboard();
    fetchStudents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">🎓 Educator Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-lg font-medium mb-4 text-green-700">{message}</p>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <input
              type="text"
              placeholder="Filter by class"
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="border px-3 py-2 rounded shadow-sm"
            />
            <input
              type="number"
              placeholder="Minimum XP"
              value={filters.minXP}
              onChange={(e) => setFilters({ ...filters, minXP: parseInt(e.target.value) || 0 })}
              className="border px-3 py-2 rounded shadow-sm"
            />
            <button
              onClick={handleExport}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              aria-label="Export CSV"
            >
              📤 Export CSV
            </button>
          </div>

          {/* Students Table */}
          {students.length === 0 ? (
            <p className="text-center text-gray-500">No students assigned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left border-t">
                <thead className="bg-gray-100">
                  <tr className="text-sm text-gray-600 uppercase tracking-wide">
                    <th className="py-2 px-3">Name</th>
                    <th className="px-3">Class</th>
                    <th className="px-3">XP</th>
                    <th className="px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(applyFilters).map((student) => (
                    <tr key={student._id} className="border-b text-sm">
                      <td className="py-3 px-3 font-medium">{student.name}</td>
                      <td className="px-3">{student.class}</td>
                      <td className="px-3">{student.progress?.xp || 0}</td>
                      <td className="px-3 space-x-2">
                        <button
                          onClick={() => handleProgress(student)}
                          className="text-blue-600 hover:underline"
                        >
                          View Progress
                        </button>
                        <button
                          onClick={() => handleFeedback(student)}
                          className="text-green-600 hover:underline"
                        >
                          Give Feedback
                        </button>
                        <button
                          onClick={() => handleFeedbackHistory(student)}
                          className="text-purple-600 hover:underline"
                        >
                          View Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modals */}
          {showFeedbackModal && selectedStudent && (
            <FeedbackModal
              student={selectedStudent}
              onClose={() => setShowFeedbackModal(false)}
              onSubmit={submitStudentFeedback}
            />
          )}

          {showProgressModal && selectedStudent && (
            <ProgressModal
              studentId={selectedStudent._id}
              onClose={() => setShowProgressModal(false)}
            />
          )}

          {showFeedbackList && selectedStudent && (
            <FeedbackListModal
              studentId={selectedStudent._id}
              onClose={() => setShowFeedbackList(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EducatorDashboard;
