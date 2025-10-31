import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Plus, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const AddTeacherModal = ({
  showAddTeacherModal,
  setShowAddTeacherModal,
  selectedClass,
  onSuccess
}) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Fetch available teachers when modal opens
  useEffect(() => {
    if (showAddTeacherModal) {
      fetchAvailableTeachers();
    }
  }, [showAddTeacherModal]);

  const fetchAvailableTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const response = await api.get('/api/school/admin/teachers/available');
      setTeachers(response.data || []);
    } catch (error) {
      console.error('Error fetching available teachers:', error);
      toast.error('Failed to load available teachers');
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

  const handleAddTeachers = async () => {
    if (selectedTeachers.length === 0) {
      toast.error('Please select at least one teacher');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/school/admin/classes/${selectedClass._id}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherIds: selectedTeachers
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Teachers added successfully!');
        setShowAddTeacherModal(false);
        setSelectedTeachers([]);
        onSuccess?.();
      } else {
        toast.error(data.message || 'Failed to add teachers');
      }
    } catch (error) {
      console.error('Error adding teachers:', error);
      toast.error('Failed to add teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddTeacherModal(false);
    setSelectedTeachers([]);
  };

  return (
    <AnimatePresence>
      {showAddTeacherModal && selectedClass && (
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add Teachers to Class</h2>
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

              <div className="p-6">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none font-semibold"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher._id}
                      onClick={() => handleTeacherSelect(teacher._id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTeachers.includes(teacher._id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                            {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{teacher.name}</div>
                            <div className="text-sm text-gray-600">
                              {teacher.email} • {teacher.profile?.subject || 'No subject specified'}
                            </div>
                          </div>
                        </div>
                        {selectedTeachers.includes(teacher._id) && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {teachers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No teachers available</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-600">
                    {selectedTeachers.length} teacher(s) selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTeachers}
                      disabled={selectedTeachers.length === 0 || loading}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Adding...' : 'Add Teachers'}
                    </button>
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

export default React.memo(AddTeacherModal);