import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Calendar, Users, BookOpen, Coins, Award, Eye, Trophy } from "lucide-react";

const PublishStep = ({ allData, onPublish, loading }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Publish</h3>
        <p className="text-gray-600">Review your assignment before publishing</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Scope Summary */}
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-gray-900">Scope</h4>
          </div>
          <p className="text-sm text-gray-700 capitalize">{allData.scope.type.replace(/_/g, " ")}</p>
          <p className="text-xs text-gray-600 mt-1">{allData.scope.classes.length} class(es) selected</p>
          {allData.scope.approvalRequired && (
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle className="w-3 h-3" />
              Requires approval
            </div>
          )}
        </div>

        {/* Template Summary */}
        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-gray-900">Template</h4>
          </div>
          <p className="text-sm text-gray-700 font-semibold">
            {allData.template.type === "blank" ? "Custom Assignment" : allData.template.selectedTemplate?.title}
          </p>
          <p className="text-xs text-gray-600 mt-1">{allData.template.subject}</p>
        </div>

        {/* Modules Summary */}
        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-gray-900">Modules</h4>
          </div>
          <p className="text-sm text-gray-700">{allData.modules.items.length} module(s) added</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {allData.modules.items.slice(0, 3).map((item, idx) => (
              <span key={item.id || item._id || idx} className="text-xs bg-white px-2 py-1 rounded border border-green-300">
                {item.type === "inavora" ? "Inavora" : "Q-Bank"}
              </span>
            ))}
          </div>
        </div>

        {/* Timing Summary */}
        <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-gray-900">Duration</h4>
          </div>
          <p className="text-xs text-gray-600">Start: {formatDate(allData.rules.startTime)}</p>
          <p className="text-xs text-gray-600 mt-1">End: {formatDate(allData.rules.endTime)}</p>
        </div>
      </div>

      {/* Participants Summary */}
      <div className="bg-cyan-50 rounded-xl p-4 border-2 border-cyan-200">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-cyan-600" />
          <h4 className="font-bold text-gray-900">Participants</h4>
        </div>
        <p className="text-sm text-gray-700 capitalize">{allData.participants.mode.replace(/_/g, " ")}</p>
        {allData.participants.mode === "manual" && (
          <p className="text-xs text-gray-600 mt-1">{allData.participants.selectedStudents.length} students selected</p>
        )}
        {allData.participants.mode === "ai_suggested" && (
          <p className="text-xs text-gray-600 mt-1">{allData.participants.aiSuggestions.length} AI suggestions</p>
        )}
      </div>

      {/* Rewards Summary */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
        <h4 className="font-bold text-gray-900 mb-4">Rewards Overview</h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Coins className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-600">{allData.rewards.healCoins * allData.rewards.bonusMultiplier}</p>
            <p className="text-xs text-gray-600">HealCoins</p>
          </div>
          
          <div className="text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{allData.rewards.badges.length}</p>
            <p className="text-xs text-gray-600">Badges</p>
          </div>
          
          <div className="text-center">
            <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{allData.rewards.certificate ? "Yes" : "No"}</p>
            <p className="text-xs text-gray-600">Certificate</p>
          </div>
        </div>
      </div>

      {/* Assignment Settings Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3">Assignment Settings</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Max Attempts:</span>
            <span className="font-semibold">{allData.rules.maxAttempts === -1 ? "Unlimited" : allData.rules.maxAttempts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Grading:</span>
            <span className="font-semibold capitalize">{allData.rules.gradingType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Randomize:</span>
            <span className="font-semibold">{allData.rules.randomizeQuestions ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Accessibility:</span>
            <span className="font-semibold">
              {Object.values(allData.rules.accessibility).filter(Boolean).length} enabled
            </span>
          </div>
        </div>
      </div>

      {/* Approval Notice */}
      {allData.scope.approvalRequired && (
        <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Approval Required</h4>
              <p className="text-sm text-amber-700">
                This assignment will be sent to school admin for approval before being published to students.
                You will receive a notification once it's reviewed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Publish Ready */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <h4 className="font-bold text-green-900 mb-1">Ready to {allData.scope.approvalRequired ? "Submit" : "Publish"}!</h4>
            <p className="text-sm text-green-700">
              {allData.scope.approvalRequired 
                ? "Your assignment is ready to be submitted for admin approval."
                : "Your assignment is ready to be published to students."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishStep;

