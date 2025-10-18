import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';

const AddStudentModal = ({
  showAddStudentModal,
  setShowAddStudentModal,
  newStudent,
  setNewStudent,
  handleAddStudent
}) => {
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  // Reset form when modal is closed
  React.useEffect(() => {
    if (!showAddStudentModal) {
      setConfirmPassword('');
      setPasswordError('');
    }
  }, [showAddStudentModal]);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (showAddStudentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddStudentModal]);

  return (
    <AnimatePresence>
      {showAddStudentModal && (
        <>
          <motion.div
            key="add-student-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddStudentModal(false)}
            className="fixed inset-0 bg-black/70 bg-opacity-70 backdrop-blur-sm z-40"
          />
          <motion.div
            key="add-student-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-start justify-center z-40 p-4 pointer-events-none pt-24"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add New Student</h2>
                    <p className="text-sm text-white/80">
                      Fill in the student details below
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddStudentModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newStudent.password !== confirmPassword) {
                    setPasswordError('Passwords do not match');
                    return;
                  }
                  if (newStudent.password.length < 6) {
                    setPasswordError('Password must be at least 6 characters');
                    return;
                  }
                  setPasswordError('');
                  handleAddStudent(e);
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
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      placeholder="Enter student name"
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
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      placeholder="student@example.com"
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) =>
                        setNewStudent((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      placeholder="+91 98765 43210"
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={newStudent.gender}
                      onChange={(e) =>
                        setNewStudent((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => {
                        setNewStudent((prev) => ({ ...prev, password: e.target.value }));
                        if (passwordError) setPasswordError('');
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      placeholder="Enter login password"
                      required
                      autoComplete="new-password"
                      minLength="6"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Student will use this password to login (min. 6 characters)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-semibold ${
                        passwordError ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                      placeholder="Confirm password"
                      required
                      autoComplete="new-password"
                    />
                    {passwordError && (
                      <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">Login Credentials</h4>
                      <p className="text-sm text-gray-600">
                        The student can login using their email and the password you set here. 
                        They can change their password later from their profile.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Add Student
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

export default React.memo(AddStudentModal);