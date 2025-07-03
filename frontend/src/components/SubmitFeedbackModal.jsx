import React from "react";
import { useState } from "react";

const SubmitFeedbackModal = ({ student, onClose, onSubmit }) => {
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await onSubmit(student._id, feedback);
            onClose();
        } catch (err) {
            alert("Failed to submit feedback");
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
