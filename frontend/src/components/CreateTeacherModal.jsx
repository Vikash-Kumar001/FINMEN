import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Mail, Phone, BookOpen, Award, Calendar, User } from 'lucide-react';

const CreateTeacherModal = ({
  showAddTeacherModal,
  setShowAddTeacherModal,
  newTeacher,
  setNewTeacher,
  handleAddTeacher,
  subjects
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleAddTeacher(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddTeacherModal(false);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      subject: '',
      qualification: '',
      experience: '',
      joiningDate: ''
    });
  };

  return (
    <AnimatePresence>
      {showAddTeacherModal && (
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add New Teacher</h2>
                    <p className="text-sm text-white/80">Create a new teacher account</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newTeacher.name}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        placeholder="Enter teacher's full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={newTeacher.email}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                          placeholder="teacher@school.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={newTeacher.phone}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        value={newTeacher.subject}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Qualification
                      </label>
                      <div className="relative">
                        <Award className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={newTeacher.qualification}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, qualification: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                          placeholder="B.Ed, M.A, Ph.D, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newTeacher.experience}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        placeholder="0"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Joining Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={newTeacher.joiningDate}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, joiningDate: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Login Credentials
                  </h3>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-semibold mb-3">
                      <strong>Default Login Credentials:</strong>
                    </p>
                    <div className="space-y-2 text-sm text-blue-900">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Email:</span>
                        <span className="font-mono bg-white px-2 py-1 rounded">
                          {newTeacher.email || 'teacher@example.com'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Password:</span>
                        <span className="font-mono bg-white px-2 py-1 rounded">teacher123</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-3">
                      The teacher can change their password after logging in.
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        Create Teacher
                      </>
                    )}
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

export default React.memo(CreateTeacherModal);
