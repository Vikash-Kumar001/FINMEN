import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building, Users, Globe, AlertCircle, Check } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ScopeStep = ({ data, updateData }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/api/school/teacher/classes");
      setClasses(response.data.classes || response.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const scopeOptions = [
    { id: "single_class", label: "Single Class", icon: Users, description: "Assign to one class", requiresApproval: false },
    { id: "multiple_classes", label: "Multiple Classes", icon: Building, description: "Assign to multiple classes", requiresApproval: false },
    { id: "whole_school", label: "Whole School", icon: Building, description: "All classes in your school", requiresApproval: true },
    { id: "csr", label: "CSR/District", icon: Globe, description: "Multiple schools in region", requiresApproval: true },
    { id: "state", label: "State Level", icon: Globe, description: "Entire state deployment", requiresApproval: true }
  ];

  const handleScopeChange = (scopeType) => {
    const option = scopeOptions.find(opt => opt.id === scopeType);
    updateData({
      type: scopeType,
      classes: scopeType === "single_class" || scopeType === "multiple_classes" ? data.classes : [],
      approvalRequired: option.requiresApproval
    });
  };

  const handleClassToggle = (cls) => {
    const isSelected = data.classes.some(c => c.id === cls._id || c.id === cls.name);
    
    if (isSelected) {
      updateData({
        classes: data.classes.filter(c => c.id !== cls._id && c.id !== cls.name)
      });
    } else {
      updateData({
        classes: [...data.classes, { id: cls._id || cls.name, name: cls.name }]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Assignment Scope</h3>
        <p className="text-gray-600">Choose where this assignment will be available</p>
      </div>

      {/* Scope Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scopeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = data.type === option.id;
          
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleScopeChange(option.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-500"
                  : "bg-white border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900">{option.label}</h4>
                    {isSelected && <Check className="w-5 h-5 text-purple-600" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  {option.requiresApproval && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                      <AlertCircle className="w-3 h-3" />
                      Requires admin approval
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Class Selection */}
      {(data.type === "single_class" || data.type === "multiple_classes") && (
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Select Classes</h4>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mx-auto" />
            </div>
          ) : classes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No classes available</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {classes.map((cls, idx) => {
                const classId = cls._id || cls.name;
                const isSelected = data.classes.some(c => c.id === classId);
                
                return (
                  <motion.button
                    key={classId || `class-${idx}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClassToggle(cls)}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white border-purple-500"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {cls.name}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Approval Notice */}
      {data.approvalRequired && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h5 className="font-bold text-amber-900">Approval Required</h5>
              <p className="text-sm text-amber-700 mt-1">
                This assignment scope requires admin approval before it will be published to students.
                You'll be notified once approved.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScopeStep;

