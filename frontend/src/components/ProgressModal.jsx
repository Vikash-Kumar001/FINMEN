import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchStudentProgress } from "../services/educatorService";
import { FaAward } from "react-icons/fa";

const ProgressModal = ({ studentId, onClose }) => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProgress = async () => {
        try {
            const data = await fetchStudentProgress(studentId);
            setProgress(data);
        } catch (err) {
            console.error("Failed to fetch progress", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (studentId) fetchProgress();
    }, [studentId]);

    if (!studentId) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
                >
                    ×
                </button>

                {loading ? (
                    <p className="text-center text-gray-500">Loading progress...</p>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                            Progress Overview
                        </h3>

                        <div className="mb-4 space-y-1">
                            <p><strong>Level:</strong> {progress?.level || 0}</p>
                            <p><strong>XP:</strong> {progress?.xp || 0}</p>
                            <p><strong>Coins:</strong> {progress?.coins || 0}</p>
                            <p><strong>Mood Check-ins:</strong> {progress?.moodCheckins || 0}</p>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-yellow-600">
                                <FaAward /> Badges Earned
                            </h4>
                            {progress?.badges?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {progress.badges.map((badge, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 text-gray-800 font-semibold shadow-sm"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No badges earned yet.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ProgressModal;
