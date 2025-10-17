import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AddTeacherModal = ({
  showAddTeacherModal,
  setShowAddTeacherModal,
  newTeacher,
  setNewTeacher,
  handleAddTeacher,
  subjects
}) => {
  return (
    <AnimatePresence>
      {showAddTeacherModal && (
        <>
          <motion.div
            key="add-teacher-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddTeacherModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            key="add-teacher-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add New Teacher</h2>
                    <p className="text-sm text-white/80">
                      Fill in the teacher details below
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddTeacherModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTeacher(e);
                }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="Enter teacher name"
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="teacher@example.com"
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newTeacher.phone}
                      onChange={(e) =>
                        setNewTeacher((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="+91 98765 43210"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={newTeacher.subject}
                      onChange={(e) =>
                        setNewTeacher((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={newTeacher.qualification}
                      onChange={(e) =>
                        setNewTeacher((prev) => ({ ...prev, qualification: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="B.Ed, M.A., etc."
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      value={newTeacher.experience}
                      onChange={(e) =>
                        setNewTeacher((prev) => ({ ...prev, experience: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="5"
                      min="0"
                      autoComplete="off"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={newTeacher.joiningDate}
                      onChange={(e) =>
                        setNewTeacher((prev) => ({ ...prev, joiningDate: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddTeacherModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Add Teacher
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

export default React.memo(AddTeacherModal);
