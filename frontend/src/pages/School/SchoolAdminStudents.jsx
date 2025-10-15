import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, Grid, List, Flag, ChevronDown, Download, Eye,
  BookOpen, TrendingUp, Zap, Coins, Star, Activity, MessageSquare, FileText,
  Heart, Clock, Plus, UserPlus, MoreVertical, AlertCircle, CheckCircle, Award,
  X, Mail, Phone, Calendar, MapPin, Shield, Target, Brain, Trophy, Trash2, Key, Copy, Lock
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminStudents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    studentId: '',
    studentName: '',
    newPassword: ''
  });
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', rollNumber: '', grade: '', section: 'A', phone: '', gender: '', password: ''
  });

  const fetchStudentsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'all') params.append('classId', selectedClass);
      if (filterGrade !== 'all') params.append('grade', filterGrade);
      if (filterSection !== 'all') params.append('section', filterSection);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const [studentsRes, classesRes, statsRes] = await Promise.all([
        api.get(`/api/school/admin/students?${params}`),
        api.get('/api/school/admin/classes'),
        api.get('/api/school/admin/students/stats'),
      ]);

      setStudents(studentsRes.data.students || []);
      setClasses(classesRes.data.classes || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, filterGrade, filterSection, filterStatus]);

  useEffect(() => {
    fetchStudentsData();
  }, [fetchStudentsData]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/school/admin/students/create', newStudent);
      toast.success('Student added successfully! Login credentials have been created.');
      setShowAddStudentModal(false);
      setNewStudent({ name: '', email: '', rollNumber: '', grade: '', section: 'A', phone: '', gender: '', password: '' });
      fetchStudentsData();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error(error.response?.data?.message || 'Failed to add student');
    }
  };

  const handleViewStudent = async (student) => {
    try {
      const response = await api.get(`/api/school/admin/students/${student._id}`);
      setSelectedStudent(response.data.student);
      setShowStudentDetail(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details');
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}? This will permanently remove the student account and all associated data.`)) {
      return;
    }

    try {
      await api.delete(`/api/school/admin/students/${studentId}`);
      toast.success('Student deleted successfully!');
      fetchStudentsData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPasswordData.newPassword || resetPasswordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post(`/api/school/admin/students/${resetPasswordData.studentId}/reset-password`, {
        newPassword: resetPasswordData.newPassword
      });
      toast.success('Password reset successfully!');
      setShowResetPasswordModal(false);
      setResetPasswordData({ studentId: '', studentName: '', newPassword: '' });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const openResetPasswordModal = (student) => {
    setResetPasswordData({
      studentId: student._id,
      studentName: student.name,
      newPassword: ''
    });
    setShowResetPasswordModal(true);
  };

  const handleExportStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (filterGrade !== 'all') params.append('grade', filterGrade);
      if (filterSection !== 'all') params.append('section', filterSection);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/api/school/admin/students/export?format=csv&${params}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Students exported successfully!');
    } catch (error) {
      console.error('Error exporting students:', error);
      toast.error('Failed to export students');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Student Modal
const AddStudentModal = ({
  showAddStudentModal,
  setShowAddStudentModal,
  newStudent,
  setNewStudent,
  handleAddStudent
}) => (
  <AnimatePresence>
    {showAddStudentModal && (
      <>
        <motion.div
          key="add-student-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddStudentModal(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
        <motion.div
          key="add-student-modal"
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
                  Roll Number *
                </label>
                <input
                  type="text"
                  value={newStudent.rollNumber}
                  onChange={(e) =>
                    setNewStudent((prev) => ({
                      ...prev,
                      rollNumber: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                  placeholder="ROLL-001"
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
                  value={newStudent.phone}
                  onChange={(e) =>
                    setNewStudent((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                  placeholder="+91 98765 43210"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  value={newStudent.grade}
                  onChange={(e) =>
                    setNewStudent((prev) => ({ ...prev, grade: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                  required
                >
                  <option value="">Select Grade</option>
                  {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Section *
                </label>
                <select
                  value={newStudent.section}
                  onChange={(e) =>
                    setNewStudent((prev) => ({
                      ...prev,
                      section: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                  required
                >
                  {['A', 'B', 'C', 'D', 'E'].map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
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
                  onChange={(e) =>
                    setNewStudent((prev) => ({ ...prev, password: e.target.value }))
                  }
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

  // Student Detail Modal
  const StudentDetailModal = () => (
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

  // Reset Password Modal
  const ResetPasswordModal = () => (
    <AnimatePresence>
      {showResetPasswordModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetPasswordModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto"
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Reset Password</h2>
                    <p className="text-sm text-white/80">
                      {resetPasswordData.studentName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResetPasswordModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-semibold">
                        Set a new password for this student. They can login immediately with the new password.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none font-semibold"
                    placeholder="Enter new password"
                    required
                    minLength="6"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Users className="w-10 h-10" />
              Student Management
            </h1>
            <p className="text-lg text-white/90">
              {filteredStudents.length} students • {stats.active || 0} active this month
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-black text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-black text-gray-900">{stats.active || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Flagged</p>
                <p className="text-2xl font-black text-gray-900">{stats.flagged || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-black text-gray-900">{stats.inactive || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search students by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Grades</option>
                {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>

              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Sections</option>
                {['A', 'B', 'C', 'D', 'E'].map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="flagged">Flagged</option>
              </select>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <button
                onClick={handleExportStudents}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Add Student
              </button>
            </div>
          </div>
        </motion.div>

        {/* Students Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, idx) => (
              <motion.div
                key={student._id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {student.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{student.name || 'Student'}</h3>
                    <p className="text-xs text-gray-600">{student.rollNumber || 'N/A'}</p>
                  </div>
                  {student.wellbeingFlags?.length > 0 && (
                    <Flag className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <p className="text-xs text-gray-600">Grade</p>
                    <p className="text-lg font-black text-blue-600">{student.grade || 'N/A'}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <p className="text-xs text-gray-600">Section</p>
                    <p className="text-lg font-black text-green-600">{student.section || 'A'}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-purple-50">
                    <p className="text-xs text-gray-600">Score</p>
                    <p className="text-lg font-black text-purple-600">{student.avgScore || 0}%</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-bold text-gray-900">{student.avgScore || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (student.avgScore || 0) >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        (student.avgScore || 0) >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                        'bg-gradient-to-r from-red-500 to-pink-600'
                      }`}
                      style={{ width: `${student.avgScore || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewStudent(student)}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStudent(student._id, student.name);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                    title="Delete Student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Student</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Roll No</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Grade</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Section</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Avg Score</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <motion.tr
                    key={student._id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                          {student.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{student.name || 'Student'}</p>
                          <p className="text-xs text-gray-500">{student.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{student.rollNumber || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{student.grade || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{student.section || 'A'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${student.avgScore || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-gray-900">{student.avgScore || 0}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        student.wellbeingFlags?.length > 0 ? 'bg-red-100 text-red-700' :
                        student.isActive ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {student.wellbeingFlags?.length > 0 ? 'Flagged' :
                         student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="p-2 hover:bg-purple-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student._id, student.name)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete Student"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredStudents.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
          >
            <Users className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or add new students</p>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <UserPlus className="w-5 h-5" />
              Add New Student
            </button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddStudentModal
        showAddStudentModal={showAddStudentModal}
        setShowAddStudentModal={setShowAddStudentModal}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        handleAddStudent={handleAddStudent}
      />
      <StudentDetailModal />
      <ResetPasswordModal />
    </div>
  );
};

export default SchoolAdminStudents;
