import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, BookOpen, Eye, ExternalLink } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ModulesStep = ({ data, updateData }) => {
  const [questionBank, setQuestionBank] = useState([]);
  const [inavoraModules, setInavoraModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("questions");
  const [previewModule, setPreviewModule] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const [questionsRes, inavoraRes] = await Promise.all([
        api.get("/api/school/teacher/question-bank"),
        api.get("/api/school/teacher/inavora-catalog")
      ]);
      setQuestionBank(questionsRes.data.questions || []);
      setInavoraModules(inavoraRes.data.modules || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  const addModule = (module, type) => {
    const newModule = {
      ...module,
      type,
      id: `${type}-${module._id}-${Date.now()}`
    };
    updateData({ items: [...data.items, newModule] });
    toast.success(`Added ${module.title}`);
  };

  const removeModule = (id) => {
    updateData({ items: data.items.filter(m => m.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Content Modules</h3>
        <p className="text-gray-600">Select questions from your bank or add Inavora modules</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "questions" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Question Bank
          {activeTab === "questions" && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("inavora")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "inavora" ? "text-purple-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Inavora Modules
          {activeTab === "inavora" && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Available Modules */}
        <div className="col-span-2 space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
            </div>
          ) : activeTab === "questions" ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {questionBank.map((q, idx) => (
                <motion.div
                  key={q._id || `qb-${idx}`}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{q.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{q.questionCount} questions • {q.difficulty}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {q.category}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addModule(q, "question_bank")}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {inavoraModules.map((module, idx) => (
                <motion.div
                  key={module._id || `inavora-${idx}`}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{module.title}</h4>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                          Inavora
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{module.duration} min • Module ID: {module.module_id}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPreviewModule(module)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addModule(module, "inavora")}
                        className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Selected Modules */}
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Selected ({data.items.length})</h4>
          {data.items.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No modules added yet</p>
          ) : (
            <div className="space-y-2">
              {data.items.map((item, idx) => (
                <div key={item.id || item._id || `module-${idx}`} className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm text-gray-900">{item.title}</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.type === "inavora" ? `Inavora • ${item.duration}min` : `${item.questionCount} questions`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeModule(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inavora Preview Modal */}
      <AnimatePresence>
        {previewModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewModule(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
                <h3 className="font-bold text-lg">Preview: {previewModule.title}</h3>
                <button onClick={() => setPreviewModule(null)} className="p-2 hover:bg-white/20 rounded-lg">
                  ✕
                </button>
              </div>
              <div className="p-6">
                <iframe
                  src={previewModule.previewUrl}
                  className="w-full h-96 rounded-lg border-2 border-gray-200"
                  title="Module Preview"
                />
                <div className="mt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addModule(previewModule, "inavora");
                      setPreviewModule(null);
                    }}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
                  >
                    Add This Module
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModulesStep;

