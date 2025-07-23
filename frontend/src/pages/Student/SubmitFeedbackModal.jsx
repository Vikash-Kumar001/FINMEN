import React, { useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const SubmitFeedbackModal = ({ student, onClose }) => {
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const socket = useSocket();
    const { user } = useAuth();

    const handleSubmit = () => {
        if (!socket || !socket.socket) {
            console.error("❌ Socket not available for submitting feedback");
            alert("Connection error. Please try again.");
            return;
        }
        
        setSubmitting(true);
        try {
            socket.socket.emit('student:feedback:submit', {
                studentId: student._id,
                feedback,
                from: user?._id
            });
            onClose();
        } catch (err) {
            console.error("❌ Error submitting feedback:", err.message);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                <h3 className="text-xl font-bold mb-4">
                    Submit Feedback for {student.name}
                </h3>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="5"
                    className="w-full border rounded p-2"
                    placeholder="Write your feedback here..."
                ></textarea>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitFeedbackModal;