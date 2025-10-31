import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, CheckCircle, Mail, User, Phone, GraduationCap } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const AddStudentToClassModal = ({
  showAddStudentModal,
  setShowAddStudentModal,
  selectedClass,
  onSuccess
}) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');

  // Fetch students when modal opens
  useEffect(() => {
    if (showAddStudentModal) {
      fetchStudents();
      // Set default section to first available section
      if (selectedClass?.sections?.length > 0) {
        setSelectedSection(selectedClass.sections[0].name);
      }
    }
  }, [showAddStudentModal, selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/school/admin/students/available');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching available students:', error);
      toast.error('Failed to load available students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    if (!selectedSection) {
      toast.error('Please select a section');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/api/school/admin/classes/${selectedClass._id}/students`, {
        studentIds: selectedStudents,
        section: selectedSection
      });
      
      toast.success(`${selectedStudents.length} student(s) added to Class ${selectedClass.classNumber} - Section ${selectedSection}`);
      setShowAddStudentModal(false);
      setSelectedStudents([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error adding students:', error);
      toast.error(error.response?.data?.message || 'Failed to add students');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowAddStudentModal(false);
    setSelectedStudents([]);
    setSearchTerm('');
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {showAddStudentModal && selectedClass && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add Students to Class</h2>
                    <p className="text-sm text-white/80">
                      Class {selectedClass.classNumber}{selectedClass.stream && ` - ${selectedClass.stream}`}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Section Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Section *
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                    required
                  >
                    <option value="">Choose Section</option>
                    {selectedClass.sections?.map((section, idx) => (
                      <option key={idx} value={section.name}>
                        Section {section.name} ({section.currentStrength || 0}/{section.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students by name, email, or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                {/* Students List */}
                <div className="max-h-96 overflow-y-auto space-y-2 border-2 border-gray-200 rounded-lg p-4">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading students...
                    </div>
                  ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        onClick={() => handleStudentSelect(student._id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedStudents.includes(student._id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                              {student.name?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {student.email}
                                </span>
                                {student.rollNumber && (
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" />
                                    {student.rollNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {selectedStudents.includes(student._id) && (
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No students found</p>
                      {searchTerm && (
                        <p className="text-sm">Try a different search term</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Selection Summary */}
                {selectedStudents.length > 0 && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-blue-900">Selection Summary</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      {selectedStudents.length} student(s) selected for Section {selectedSection}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStudents}
                    disabled={selectedStudents.length === 0 || !selectedSection || submitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add {selectedStudents.length} Student(s)
                      </>
                    )}
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

export default React.memo(AddStudentToClassModal);
