import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, RotateCcw, CheckCircle, Accessibility } from "lucide-react";

const RulesStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Assignment Rules & Controls</h3>
        <p className="text-gray-600">Set timing, attempts, and grading preferences</p>
      </div>

      {/* Timing */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-gray-900">Timing</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
            <input
              type="datetime-local"
              value={data.startTime}
              onChange={(e) => updateData({ startTime: e.target.value })}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
            <input
              type="datetime-local"
              value={data.endTime}
              onChange={(e) => updateData({ endTime: e.target.value })}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Attempts */}
      <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-5 h-5 text-purple-600" />
          <h4 className="font-bold text-gray-900">Attempts</h4>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Maximum Attempts:</label>
          <select
            value={data.maxAttempts}
            onChange={(e) => updateData({ maxAttempts: parseInt(e.target.value) })}
            className="px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white"
          >
            {[1, 2, 3, 5, -1].map(n => (
              <option key={n} value={n}>{n === -1 ? "Unlimited" : n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grading & Settings */}
      <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h4 className="font-bold text-gray-900">Grading & Settings</h4>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.randomizeQuestions}
              onChange={(e) => updateData({ randomizeQuestions: e.target.checked })}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <div>
              <span className="font-semibold text-gray-900">Randomize Questions</span>
              <p className="text-sm text-gray-600">Shuffle question order for each student</p>
            </div>
          </label>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Grading Type</label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ gradingType: "auto" })}
                className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                  data.gradingType === "auto"
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-300"
                }`}
              >
                Auto-Grade
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ gradingType: "manual" })}
                className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                  data.gradingType === "manual"
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-300"
                }`}
              >
                Manual Grade
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Accessibility className="w-5 h-5 text-amber-600" />
          <h4 className="font-bold text-gray-900">Accessibility Options</h4>
        </div>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.accessibility.allowScreenReader}
            onChange={(e) => updateData({
              accessibility: { ...data.accessibility, allowScreenReader: e.target.checked }
            })}
            className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
          />
          <span className="font-semibold text-gray-900">Allow Screen Reader</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.accessibility.extraTime}
            onChange={(e) => updateData({
              accessibility: { ...data.accessibility, extraTime: e.target.checked }
            })}
            className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
          />
          <span className="font-semibold text-gray-900">Allow Extra Time (1.5x)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.accessibility.textToSpeech}
            onChange={(e) => updateData({
              accessibility: { ...data.accessibility, textToSpeech: e.target.checked }
            })}
            className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
          />
          <span className="font-semibold text-gray-900">Text-to-Speech Support</span>
        </label>
      </div>
    </div>
  );
};

export default RulesStep;

