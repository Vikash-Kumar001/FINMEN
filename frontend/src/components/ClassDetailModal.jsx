import React, { useEffect } from 'react';
import {motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, BookOpen, GraduationCap, Calendar, UserPlus, Trash2, UserMinus
} from 'lucide-react';

const ClassDetailModal = ({
  showClassDetailModal,
  setShowClassDetailModal,
  selectedClass,
  teachers,
  setShowAddStudentModal,
  setShowAddTeacherModal,
  onRemoveTeacher,
  onRemoveStudent
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showClassDetailModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showClassDetailModal]);

  return (
    <AnimatePresence>
      {showClassDetailModal && selectedClass && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClassDetailModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-start justify-center z-40 p-4 pointer-events-none pt-24"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">
                      Class {selectedClass.classNumber}{selectedClass.stream && ` - ${selectedClass.stream}`}
                    </h2>
                    <p className="text-sm text-white/80">Academic Year: {selectedClass.academicYear}</p>
                  </div>
                  <button
                    onClick={() => setShowClassDetailModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Sections */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />
                          Sections ({selectedClass.sections?.length || 0})
                        </h3>
                        <button
                          onClick={() => setShowAddTeacherModal(true)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <GraduationCap className="w-4 h-4" />
                          Add Teachers
                        </button>
                      </div>
                      <div className="space-y-4">
                        {selectedClass.sections?.map((section, idx) => (
                          <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-2xl font-black text-blue-600">Section {section.name}</div>
                              <div className="text-sm font-bold text-gray-600">
                                {section.currentStrength || 0}/{section.capacity}
                              </div>
                            </div>
                            {section.classTeacher && (
                              <div className="flex items-center justify-between text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4" />
                                  <span className="font-semibold">
                                    {typeof section.classTeacher === 'object' 
                                      ? section.classTeacher.name 
                                      : teachers.find(t => t._id === section.classTeacher)?.name || 'Not assigned'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => onRemoveTeacher && onRemoveTeacher(
                                    typeof section.classTeacher === 'object' ? section.classTeacher._id : section.classTeacher, 
                                    section.name
                                  )}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Remove teacher from this section"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assigned Teachers */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        Assigned Teachers
                      </h3>
                      {selectedClass.sections?.some(section => section.classTeacher) ? (
                        <div className="space-y-4">
                          {selectedClass.sections
                            .filter(section => section.classTeacher)
                            .map((section, idx) => (
                              <div key={idx} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                      {typeof section.classTeacher === 'object' 
                                        ? section.classTeacher.name?.charAt(0)?.toUpperCase() || 'T'
                                        : 'T'}
                                    </div>
                                    <div>
                                      <div className="font-bold text-gray-900">
                                        {typeof section.classTeacher === 'object' 
                                          ? section.classTeacher.name 
                                          : teachers.find(t => t._id === section.classTeacher)?.name || 'Not assigned'}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Section {section.name} • {typeof section.classTeacher === 'object' 
                                          ? section.classTeacher.subject || 'No subject'
                                          : teachers.find(t => t._id === section.classTeacher)?.subject || 'No subject'}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => onRemoveTeacher && onRemoveTeacher(
                                      typeof section.classTeacher === 'object' ? section.classTeacher._id : section.classTeacher, 
                                      section.name
                                    )}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove teacher from this section"
                                  >
                                    <UserMinus className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-gray-200">
                          <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="font-semibold">No teachers assigned yet</p>
                          <p className="text-sm">Click "Add Teachers" to assign teachers to this class</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Subjects */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Subjects ({selectedClass.subjects?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {selectedClass.subjects?.map((subject, idx) => (
                          <div key={idx} className="p-4 bg-white rounded-xl border-2 border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 text-lg">
                                  {subject.name}
                                  {subject.code && <span className="text-gray-500 ml-2">({subject.code})</span>}
                                  {subject.isOptional && (
                                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Optional</span>
                                  )}
                                </div>
                                {subject.teachers && subject.teachers.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {subject.teachers.map((teacher, tIdx) => (
                                      <div key={tIdx} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
                                        <GraduationCap className="w-4 h-4" />
                                        {typeof teacher === 'object' ? teacher.name : teachers.find(t => t._id === teacher)?.name || 'Unknown'}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Students */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />
                          Students ({selectedClass.students?.length || 0})
                        </h3>
                        <button
                          onClick={() => setShowAddStudentModal(true)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add Students
                        </button>
                      </div>
                      {selectedClass.students && selectedClass.students.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {selectedClass.students.map((student, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">
                                    {typeof student === 'object' ? student.name : student}
                                  </div>
                                  {typeof student === 'object' && student.rollNumber && (
                                    <div className="text-sm text-gray-600">{student.rollNumber}</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => onRemoveStudent && onRemoveStudent(student)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-2"
                                  title="Remove student from this class"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-gray-200">
                          <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="font-semibold">No students assigned yet</p>
                          <p className="text-sm">Click "Add Students" to assign students to this class</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ClassDetailModal);