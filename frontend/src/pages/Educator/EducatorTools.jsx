import React, { useState } from "react";
import { FaBook, FaClipboardList, FaComments, FaFileAlt } from "react-icons/fa";

const EducatorTools = () => {
    const [selectedTool, setSelectedTool] = useState("lesson");

    const renderTool = () => {
        switch (selectedTool) {
            case "lesson":
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">📚 Lesson Planner</h3>
                        <textarea
                            rows="6"
                            placeholder="Plan your lessons here..."
                            className="w-full border p-2 rounded shadow-sm"
                        ></textarea>
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Plan
                        </button>
                    </div>
                );
            case "assignments":
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">📝 Assignments Manager</h3>
                        <input
                            type="text"
                            placeholder="Assignment Title"
                            className="w-full mb-2 border p-2 rounded"
                        />
                        <textarea
                            rows="4"
                            placeholder="Assignment Details..."
                            className="w-full border p-2 rounded"
                        ></textarea>
                        <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                            Create Assignment
                        </button>
                    </div>
                );
            case "feedback":
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">💬 Student Feedback Panel</h3>
                        <input
                            type="text"
                            placeholder="Student Name"
                            className="w-full mb-2 border p-2 rounded"
                        />
                        <textarea
                            rows="4"
                            placeholder="Write your feedback..."
                            className="w-full border p-2 rounded"
                        ></textarea>
                        <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Submit Feedback
                        </button>
                    </div>
                );
            case "quiz":
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">🧠 Assessment & Quiz Creator</h3>
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            className="w-full mb-2 border p-2 rounded"
                        />
                        <textarea
                            rows="4"
                            placeholder="Add your questions here..."
                            className="w-full border p-2 rounded"
                        ></textarea>
                        <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Create Quiz
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">🛠️ Educator Tools</h2>

            {/* Tool Switcher */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setSelectedTool("lesson")}
                    className={`flex items-center gap-2 px-4 py-2 rounded shadow ${selectedTool === "lesson"
                            ? "bg-blue-600 text-white"
                            : "bg-white border text-blue-600"
                        }`}
                >
                    <FaBook /> Lesson Planner
                </button>
                <button
                    onClick={() => setSelectedTool("assignments")}
                    className={`flex items-center gap-2 px-4 py-2 rounded shadow ${selectedTool === "assignments"
                            ? "bg-purple-600 text-white"
                            : "bg-white border text-purple-600"
                        }`}
                >
                    <FaClipboardList /> Assignments
                </button>
                <button
                    onClick={() => setSelectedTool("feedback")}
                    className={`flex items-center gap-2 px-4 py-2 rounded shadow ${selectedTool === "feedback"
                            ? "bg-green-600 text-white"
                            : "bg-white border text-green-600"
                        }`}
                >
                    <FaComments /> Feedback
                </button>
                <button
                    onClick={() => setSelectedTool("quiz")}
                    className={`flex items-center gap-2 px-4 py-2 rounded shadow ${selectedTool === "quiz"
                            ? "bg-indigo-600 text-white"
                            : "bg-white border text-indigo-600"
                        }`}
                >
                    <FaFileAlt /> Quiz
                </button>
            </div>

            {/* Active Tool Renderer */}
            <div className="bg-white p-6 rounded-xl shadow border">{renderTool()}</div>
        </div>
    );
};

export default EducatorTools;
