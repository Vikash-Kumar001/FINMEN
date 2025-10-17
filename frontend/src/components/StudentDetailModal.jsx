import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Phone, Calendar, Activity, Lock, Copy, AlertCircle, Target, Trash2, Key, User
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentDetailModal = ({
  showStudentDetail,
  setShowStudentDetail,
  selectedStudent,
  openResetPasswordModal,
  handleDeleteStudent
}) => {
  return (
    <AnimatePresence>
      {showStudentDetail && selectedStudent && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStudentDetail(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {selectedStudent.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black mb-1">{selectedStudent.name || 'Student'}</h2>
                      <p className="text-sm text-white/80">Roll No: {selectedStudent.rollNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStudentDetail(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Grade</p>
                    <p className="text-2xl font-black text-blue-600">{selectedStudent.grade || 'N/A'}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Section</p>
                    <p className="text-2xl font-black text-green-600">{selectedStudent.section || 'A'}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Avg Score</p>
                    <p className="text-2xl font-black text-purple-600">{selectedStudent.avgScore || 0}%</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Attendance</p>
                    <p className="text-2xl font-black text-orange-600">{selectedStudent.attendance?.percentage || 0}%</p>
                  </div>
                </div>

                {/* Login Credentials */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Login Credentials
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Login Email</p>
                          <p className="font-bold text-gray-900">{selectedStudent.email || 'N/A'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedStudent.email);
                          toast.success('Email copied to clipboard!');
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Copy Email"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-gray-700">
                        Student can login using this email and their password
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-purple-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-900">{selectedStudent.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-semibold text-gray-900">{selectedStudent.gender || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Last Active:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedStudent.lastActive ? new Date(selectedStudent.lastActive).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        selectedStudent.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedStudent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pillar Mastery */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Pillar Mastery
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedStudent.pillars || {}).map(([pillar, score]) => (
                      <div key={pillar}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-gray-700 uppercase">{pillar}</span>
                          <span className="text-sm font-black text-gray-900">{score || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              score >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                              score >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                              'bg-gradient-to-r from-red-500 to-pink-600'
                            }`}
                            style={{ width: `${score || 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wellbeing Flags */}
                {selectedStudent.wellbeingFlags?.length > 0 && (
                  <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Wellbeing Flags ({selectedStudent.wellbeingFlags.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedStudent.wellbeingFlags.map((flag, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-red-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900">{flag.type || 'Flag'}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              flag.severity === 'high' ? 'bg-red-100 text-red-700' :
                              flag.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {flag.severity || 'Low'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{flag.description || 'No description'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowStudentDetail(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowStudentDetail(false);
                      openResetPasswordModal(selectedStudent);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Reset Password
                  </button>
                  <button
                    onClick={() => {
                      setShowStudentDetail(false);
                      handleDeleteStudent(selectedStudent._id, selectedStudent.name);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Student
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(StudentDetailModal);
