import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";

// Step Components
import ScopeStep from "./AssignmentWizard/ScopeStep";
import TemplateStep from "./AssignmentWizard/TemplateStep";
import ModulesStep from "./AssignmentWizard/ModulesStep";
import RulesStep from "./AssignmentWizard/RulesStep";
import ParticipantsStep from "./AssignmentWizard/ParticipantsStep";
import RewardsStep from "./AssignmentWizard/RewardsStep";
import PublishStep from "./AssignmentWizard/PublishStep";

const AssignmentWizard = ({ isOpen, onClose, defaultClassId, defaultClassName }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Wizard data state
  const [wizardData, setWizardData] = useState({
    scope: {
      type: defaultClassId ? "single_class" : "single_class",
      classes: defaultClassId ? [{ id: defaultClassId, name: defaultClassName }] : [],
      approvalRequired: false
    },
    template: {
      type: "blank", // "template" | "blank"
      selectedTemplate: null
    },
    modules: {
      items: []
    },
    rules: {
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      maxAttempts: 3,
      randomizeQuestions: false,
      gradingType: "auto",
      accessibility: {
        allowScreenReader: true,
        extraTime: false,
        textToSpeech: false
      }
    },
    participants: {
      mode: "all", // "all" | "filtered" | "manual" | "ai_suggested"
      selectedStudents: [],
      filterTags: [],
      aiSuggestions: []
    },
    rewards: {
      healCoins: 100,
      bonusMultiplier: 1,
      badges: [],
      certificate: false
    }
  });

  const steps = [
    { number: 1, title: "Scope", component: ScopeStep },
    { number: 2, title: "Template", component: TemplateStep },
    { number: 3, title: "Modules", component: ModulesStep },
    { number: 4, title: "Rules", component: RulesStep },
    { number: 5, title: "Participants", component: ParticipantsStep },
    { number: 6, title: "Rewards", component: RewardsStep },
    { number: 7, title: "Publish", component: PublishStep }
  ];

  const updateWizardData = (step, data) => {
    setWizardData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (!validateStep(currentStep)) {
      return;
    }
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1: // Scope
        if (wizardData.scope.classes.length === 0) {
          toast.error("Please select at least one class");
          return false;
        }
        return true;
      case 2: // Template
        if (wizardData.template.type === "template" && !wizardData.template.selectedTemplate) {
          toast.error("Please select a template or choose blank assignment");
          return false;
        }
        if (wizardData.template.type === "blank" && !wizardData.template.title) {
          toast.error("Please enter assignment title");
          return false;
        }
        return true;
      case 3: // Modules
        if (wizardData.modules.items.length === 0) {
          toast.error("Please add at least one module or question");
          return false;
        }
        return true;
      case 4: // Rules
        if (new Date(wizardData.rules.endTime) <= new Date(wizardData.rules.startTime)) {
          toast.error("End time must be after start time");
          return false;
        }
        return true;
      case 5: // Participants
        if (wizardData.participants.mode === "manual" && wizardData.participants.selectedStudents.length === 0) {
          toast.error("Please select at least one student");
          return false;
        }
        return true;
      case 6: // Rewards
        return true;
      default:
        return true;
    }
  };

  const handlePublish = async (status = "published") => {
    setLoading(true);
    try {
      const response = await api.post("/api/school/teacher/assignments/create-advanced", {
        ...wizardData,
        status
      });

      if (response.data.success) {
        toast.success(
          wizardData.scope.approvalRequired
            ? "Assignment submitted for approval!"
            : "Assignment published successfully!"
        );
        onClose();
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error(error.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (currentStep > 1) {
      const confirm = window.confirm("Are you sure you want to cancel? Your progress will be lost.");
      if (!confirm) return;
    }
    onClose();
  };

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Wizard Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header with Progress */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Assignment</h2>
                <p className="text-purple-100 text-sm">Step {currentStep} of 7: {steps[currentStep - 1].title}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        currentStep > step.number
                          ? "bg-green-500 text-white"
                          : currentStep === step.number
                          ? "bg-white text-purple-600"
                          : "bg-white/30 text-white/60"
                      }`}
                    >
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                    </div>
                    <span className={`text-xs mt-1 ${currentStep >= step.number ? "text-white font-semibold" : "text-white/60"}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.number ? "bg-green-500" : "bg-white/30"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent
                  data={wizardData[Object.keys(wizardData)[currentStep - 1]]}
                  allData={wizardData}
                  updateData={(data) => updateWizardData(Object.keys(wizardData)[currentStep - 1], data)}
                  onPublish={handlePublish}
                  loading={loading}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 flex justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>

            {currentStep < 7 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePublish("draft")}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  Save as Draft
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePublish("published")}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {wizardData.scope.approvalRequired ? "Submit for Approval" : "Publish Now"}
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssignmentWizard;

