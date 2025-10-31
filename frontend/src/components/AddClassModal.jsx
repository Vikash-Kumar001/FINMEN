import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, Plus, Trash2, School, Search, GraduationCap, CheckCircle
} from 'lucide-react';
import api from '../utils/api';

const AddClassModal = ({
  showAddClassModal,
  setShowAddClassModal,
  newClass,
  setNewClass,
  handleAddClass,
  handleAddSection,
  handleRemoveSection,
  streams
}) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddClassModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddClassModal]);

  // Fetch teachers when modal opens
  useEffect(() => {
    if (showAddClassModal) {
      fetchTeachers();
    }
  }, [showAddClassModal]);

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const response = await api.get('/api/school/admin/teachers');
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(teacherSearchTerm.toLowerCase())
  );
  return (
    <AnimatePresence>
      {showAddClassModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddClassModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-start justify-center z-40 p-4 pointer-events-none pt-24"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Create New Class</h2>
                    <p className="text-sm text-white/80">Set up class, sections, and subjects</p>
                  </div>
                  <button
                    onClick={() => setShowAddClassModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                // Include selected teachers in the class data
                const classDataWithTeachers = {
                  ...newClass,
                  selectedTeachers: selectedTeachers
                };
                handleAddClass(e, classDataWithTeachers);
              }} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1 - Basic Information */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <School className="w-5 h-5 text-indigo-600" />
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Class/Grade *
                          </label>
                          <select
                            value={newClass.classNumber}
                            onChange={(e) => setNewClass(prev => ({ ...prev, classNumber: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            required
                          >
                            <option value="">Select Class</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                              <option key={num} value={num}>Class {num}</option>
                            ))}
                          </select>
                        </div>

                        {parseInt(newClass.classNumber) >= 11 && (
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Stream *
                            </label>
                            <select
                              value={newClass.stream}
                              onChange={(e) => setNewClass(prev => ({ ...prev, stream: e.target.value }))}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                              required={parseInt(newClass.classNumber) >= 11}
                            >
                              <option value="">Select Stream</option>
                              {streams.map(stream => (
                                <option key={stream} value={stream}>{stream}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Academic Year *
                          </label>
                          <input
                            type="text"
                            value={newClass.academicYear}
                            onChange={(e) => setNewClass(prev => ({ ...prev, academicYear: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="2024-2025"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 - Sections */}
                  <div className="space-y-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />
                          Sections
                        </h3>
                        <button
                          type="button"
                          onClick={handleAddSection}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>

                      <div className="space-y-4">
                        {newClass.sections.map((section, idx) => (
                          <div key={idx} className="relative bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                            <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">
                              {idx + 1}
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Section Name *
                                </label>
                                <input
                                  type="text"
                                  value={section.name}
                                  onChange={(e) => {
                                    const newSections = [...newClass.sections];
                                    newSections[idx].name = e.target.value;
                                    setNewClass(prev => ({ ...prev, sections: newSections }));
                                  }}
                                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none font-semibold bg-white shadow-sm"
                                  placeholder="A, B, C..."
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Maximum Capacity
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={section.capacity}
                                    onChange={(e) => {
                                      const newSections = [...newClass.sections];
                                      newSections[idx].capacity = parseInt(e.target.value);
                                      setNewClass(prev => ({ ...prev, sections: newSections }));
                                    }}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none font-semibold bg-white shadow-sm"
                                    min="1"
                                    placeholder="40"
                                  />
                                  {newClass.sections.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSection(idx)}
                                      className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                                      title="Remove Section"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 3 - Teacher Assignment */}
                  <div className="space-y-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-indigo-600" />
                          Assign Teachers
                        </h3>
                        <div className="text-sm text-gray-600">
                          {selectedTeachers.length} selected
                        </div>
                      </div>

                      {/* Teacher Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search teachers..."
                          value={teacherSearchTerm}
                          onChange={(e) => setTeacherSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                        />
                      </div>

                      {/* Teachers List */}
                      <div className="max-h-64 overflow-y-auto space-y-2 border-2 border-gray-200 rounded-lg p-3">
                        {loadingTeachers ? (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            Loading teachers...
                          </div>
                        ) : filteredTeachers.length > 0 ? (
                          filteredTeachers.map((teacher) => (
                            <div
                              key={teacher._id}
                              onClick={() => handleTeacherSelect(teacher._id)}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedTeachers.includes(teacher._id)
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900 text-sm">{teacher.name}</div>
                                    <div className="text-xs text-gray-600">
                                      {teacher.email} • {teacher.subject || 'No subject'}
                                    </div>
                                  </div>
                                </div>
                                {selectedTeachers.includes(teacher._id) && (
                                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No teachers found</p>
                            {teacherSearchTerm && (
                              <p className="text-xs">Try a different search term</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(AddClassModal);