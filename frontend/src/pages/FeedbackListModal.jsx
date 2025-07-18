import React from "react";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { X } from "lucide-react";

const FeedbackListModal = ({ studentId, onClose }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get(`/api/educators/feedback/${studentId}`);
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch feedback history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchFeedbacks();
  }, [studentId]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            📝 Feedback History
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-600"
          >
            <X />
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">
            Loading feedbacks...
          </p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No feedback found for this student.
          </p>
        ) : (
          <ul className="space-y-3">
            {feedbacks.map((fb, idx) => (
              <li
                key={idx}
                className="p-4 border dark:border-gray-700 rounded shadow-sm bg-gray-50 dark:bg-gray-800"
              >
                <p className="text-gray-700 dark:text-gray-200">
                  {fb.feedback}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Date: {new Date(fb.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FeedbackListModal;
