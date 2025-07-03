import React from "react";
import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function FeedbackModal({ studentId, onClose }) {
    const [feedback, setFeedback] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const submitFeedback = async () => {
        if (!feedback.trim()) return alert("Please write feedback before submitting.");

        try {
            setLoading(true);
            await axios.post(
                `/api/educators/feedback/${studentId}`,
                { feedback },
                { withCredentials: true }
            );
            setSuccess(true);
            setFeedback("");
        } catch (err) {
            console.error("Failed to send feedback:", err);
            alert("❌ Failed to submit feedback. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        💬 Provide Feedback
                    </h3>
                    <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-red-600">
                        <X />
                    </button>
                </div>

                {success ? (
                    <p className="text-green-600 font-medium dark:text-green-400">
                        ✅ Feedback sent successfully!
                    </p>
                ) : (
                    <>
                        <textarea
                            className="w-full border rounded p-2 h-32 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            placeholder="Write your feedback here..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        ></textarea>

                        <button
                            onClick={submitFeedback}
                            disabled={loading}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Feedback"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
