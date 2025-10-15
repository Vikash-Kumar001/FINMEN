import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Tag, CheckSquare, Sparkles, Loader } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ParticipantsStep = ({ data, allData, updateData }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (data.mode === "manual" || data.mode === "ai_suggested") {
      fetchStudents();
    }
  }, [data.mode]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const classIds = allData.scope.classes.map(c => c.id);
      const response = await api.post("/api/school/teacher/get-students-for-assignment", {
        classIds,
        scopeType: allData.scope.type
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggest = async () => {
    setAiLoading(true);
    try {
      const classIds = allData.scope.classes.map(c => c.id);
      const response = await api.post("/api/school/teacher/ai-suggest-students", {
        classIds
      });
      const suggestions = response.data.suggestions || [];
      updateData({
        mode: "ai_suggested",
        aiSuggestions: suggestions,
        selectedStudents: suggestions.map(s => s.studentId)
      });
      toast.success(`AI suggested ${suggestions.length} students based on weak pillars`);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get AI suggestions");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleStudent = (studentId) => {
    const isSelected = data.selectedStudents.includes(studentId);
    if (isSelected) {
      updateData({ selectedStudents: data.selectedStudents.filter(id => id !== studentId) });
    } else {
      updateData({ selectedStudents: [...data.selectedStudents, studentId] });
    }
  };

  const modes = [
    { id: "all", label: "All Students", icon: Users, description: "Assign to all students in selected classes" },
    { id: "filtered", label: "Filter by Tags", icon: Tag, description: "Use tags to filter students" },
    { id: "manual", label: "Manual Selection", icon: CheckSquare, description: "Manually select specific students" },
    { id: "ai_suggested", label: "AI Suggested", icon: Sparkles, description: "Let AI suggest students by weak pillars" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Participants</h3>
        <p className="text-gray-600">Choose which students will receive this assignment</p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = data.mode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateData({ mode: mode.id })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-500"
                  : "bg-white border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{mode.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* All Students Mode */}
      {data.mode === "all" && (
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-bold text-gray-900">All Students Selected</h4>
              <p className="text-sm text-gray-600 mt-1">
                This assignment will be available to all students in the selected classes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtered Mode */}
      {data.mode === "filtered" && (
        <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
          <h4 className="font-bold text-gray-900 mb-3">Filter by Tags</h4>
          <input
            type="text"
            placeholder="Enter tags (comma-separated)"
            value={data.filterTags.join(", ")}
            onChange={(e) => updateData({ filterTags: e.target.value.split(",").map(t => t.trim()).filter(t => t) })}
            className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:outline-none"
          />
          <p className="text-xs text-gray-600 mt-2">e.g., advanced, needs_help, group_a</p>
        </div>
      )}

      {/* Manual Selection */}
      {data.mode === "manual" && (
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
          <h4 className="font-bold text-gray-900 mb-3">Select Students ({data.selectedStudents.length} selected)</h4>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {students.map((student, idx) => {
                const isSelected = data.selectedStudents.includes(student._id);
                
                return (
                  <motion.button
                    key={student._id || `student-${idx}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleStudent(student._id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{student.name}</span>
                      {isSelected && <CheckSquare className="w-4 h-4" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AI Suggested */}
      {data.mode === "ai_suggested" && (
        <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">AI-Suggested Students</h4>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAISuggest}
              disabled={aiLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get Suggestions
                </>
              )}
            </motion.button>
          </div>

          {data.aiSuggestions.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.aiSuggestions.map((suggestion, idx) => (
                <div key={suggestion.studentId || `suggestion-${idx}`} className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-semibold text-gray-900">{suggestion.studentName}</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Weak pillars: {suggestion.weakPillars.join(", ")}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                      {suggestion.confidence}% match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Click "Get Suggestions" to let AI analyze students</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantsStep;

