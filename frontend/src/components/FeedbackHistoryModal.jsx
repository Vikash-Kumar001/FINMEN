import React from 'react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackHistoryModal = ({ studentId, onClose }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`/api/educators/feedback/${studentId}`, {
                    withCredentials: true
                });
                setFeedbackList(res.data);
            } catch (err) {
                console.error("Failed to load feedback", err);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) fetchFeedback();
    }, [studentId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Feedback History</h2>
                <button
                    className="absolute top-3 right-5 text-gray-500 hover:text-red-500 text-xl"
                    onClick={onClose}
                >
                    ×
                </button>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : feedbackList.length === 0 ? (
                    <p className="text-gray-500">No feedback available.</p>
                ) : (
                    <ul className="space-y-4 max-h-80 overflow-y-auto">
                        {feedbackList.map((item) => (
                            <li key={item._id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow-sm">
                                <p className="text-gray-700 dark:text-gray-300">{item.feedback}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    — {item.educatorId?.name || 'Educator'},{" "}
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FeedbackHistoryModal;
