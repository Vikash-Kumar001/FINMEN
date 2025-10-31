import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Phone, Calendar, Activity, GraduationCap, BookOpen, Target, Trash2
} from 'lucide-react';

const TeacherDetailModal = ({
  showTeacherDetail,
  setShowTeacherDetail,
  selectedTeacher,
  handleDeleteTeacher,
  onViewClass
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showTeacherDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTeacherDetail]);

  return (
    <AnimatePresence>
      {showTeacherDetail && selectedTeacher && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTeacherDetail(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-start justify-center z-40 p-4 pointer-events-none pt-24"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {selectedTeacher.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black mb-1">{selectedTeacher.name || 'Teacher'}</h2>
                      <p className="text-sm text-white/80">{selectedTeacher.subject || 'N/A'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTeacherDetail(false)}
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
                    <p className="text-xs text-gray-600 mb-1">Classes</p>
                    <p className="text-2xl font-black text-blue-600">{selectedTeacher.totalClasses || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Students</p>
                    <p className="text-2xl font-black text-green-600">{selectedTeacher.totalStudents || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Experience</p>
                    <p className="text-2xl font-black text-purple-600">{selectedTeacher.experience || 0} yrs</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Attendance</p>
                    <p className="text-2xl font-black text-orange-600">{selectedTeacher.attendance || 0}%</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold text-gray-900">{selectedTeacher.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-900">{selectedTeacher.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Qualification:</span>
                      <span className="font-semibold text-gray-900">{selectedTeacher.qualification || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Joining Date:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTeacher.joiningDate ? new Date(selectedTeacher.joiningDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Last Active:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTeacher.lastActive ? new Date(selectedTeacher.lastActive).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Classes Assigned */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Assigned Classes
                  </h3>
                  {selectedTeacher.assignedClasses && selectedTeacher.assignedClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedTeacher.assignedClasses.map((cls, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => onViewClass && onViewClass(cls._id)}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                        >
                          <div className="font-bold text-gray-900 group-hover:text-blue-800">
                            Class {cls.classNumber}{cls.stream ? ` - ${cls.stream}` : ''}
                            {cls.sections && cls.sections.length > 0 && (
                              <span className="text-sm text-blue-600 ml-2">
                                ({cls.sections.map(s => s.name).join(', ')})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 group-hover:text-blue-700">
                            {cls.students || 0} students • Academic Year: {cls.academicYear}
                          </div>
                          <div className="text-xs text-blue-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view class details →
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No classes assigned yet</p>
                      <p className="text-sm">This teacher can be assigned to classes from the class management page</p>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                {selectedTeacher.metrics && (
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Performance Metrics
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(selectedTeacher.metrics).map(([metric, value]) => (
                        <div key={metric}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-gray-700 capitalize">
                              {metric.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm font-black text-gray-900">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                value >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                value >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                                'bg-gradient-to-r from-red-500 to-pink-600'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowTeacherDetail(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowTeacherDetail(false);
                      handleDeleteTeacher(selectedTeacher._id, selectedTeacher.name);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Teacher
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

export default React.memo(TeacherDetailModal);