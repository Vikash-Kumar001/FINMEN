import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

const AddStudentsModal = ({
  showAddStudentsModal,
  setShowAddStudentsModal,
  selectedClass,
  students,
  selectedStudentsToAdd,
  setSelectedStudentsToAdd,
  handleAddStudentsToClass
}) => {
  return (
    <AnimatePresence>
      {showAddStudentsModal && selectedClass && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddStudentsModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add Students to Class</h2>
                    <p className="text-sm text-white/80">
                      Class {selectedClass.classNumber}{selectedClass.stream && ` - ${selectedClass.stream}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddStudentsModal(false)}
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
                    placeholder="Search students..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.filter(s => s.grade === selectedClass.classNumber).map((student) => (
                    <div
                      key={student._id}
                      onClick={() => {
                        setSelectedStudentsToAdd(prev =>
                          prev.includes(student._id)
                            ? prev.filter(id => id !== student._id)
                            : [...prev, student._id]
                        );
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedStudentsToAdd.includes(student._id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">
                            Roll: {student.rollNumber} • Grade: {student.grade}
                          </div>
                        </div>
                        {selectedStudentsToAdd.includes(student._id) && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-600">
                    {selectedStudentsToAdd.length} student(s) selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddStudentsModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddStudentsToClass}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                      disabled={selectedStudentsToAdd.length === 0}
                    >
                      Add Students
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

export default React.memo(AddStudentsModal);
