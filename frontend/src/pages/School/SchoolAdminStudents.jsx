import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Grid, List, Flag, ChevronDown, Download, Eye,
  BookOpen, TrendingUp, Zap, Coins, Star, Activity, MessageSquare, FileText,
  Heart, Clock, Plus, UserPlus, MoreVertical, AlertCircle, CheckCircle, Award,
  X, Mail, Phone, Calendar, MapPin, Shield, Target, Brain, Trophy, Trash2, Key, Copy, Lock, User
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import AddStudentModal from '../../components/AddStudentModal';
import StudentDetailModal from '../../components/StudentDetailModal';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import LimitReachedModal from '../../components/LimitReachedModal';
import { useSocket } from '../../context/SocketContext';

const SchoolAdminStudents = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
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
    name: '', email: '', phone: '', gender: '', password: '', dateOfBirth: ''
  });
  const [limitModal, setLimitModal] = useState({ open: false, message: '', type: 'student' });
  const { socket } = useSocket();

  const fetchStudentsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'all') params.append('classId', selectedClass);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const [studentsRes, statsRes] = await Promise.all([
        api.get(`/api/school/admin/students?${params}`),
        api.get('/api/school/admin/students/stats'),
      ]);

      setStudents(studentsRes.data.students || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, filterStatus]);

  useEffect(() => {
    fetchStudentsData();
  }, [fetchStudentsData]);

  useEffect(() => {
    if (!socket) return;
    const handleRealtimeStudentUpdate = () => {
      fetchStudentsData();
    };
    socket.on('school:students:updated', handleRealtimeStudentUpdate);
    return () => {
      socket.off('school:students:updated', handleRealtimeStudentUpdate);
    };
  }, [socket, fetchStudentsData]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/school/admin/students/create', newStudent);
      toast.success('Student added successfully! Login credentials have been created.');
      setShowAddStudentModal(false);
      setNewStudent({ name: '', email: '', phone: '', gender: '', password: '', dateOfBirth: '' });
      fetchStudentsData();
    } catch (error) {
      console.error('Error adding student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add student';
      if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('student limit reached')) {
        setLimitModal({ open: true, message: errorMessage, type: 'student' });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleViewStudent = async (student) => {
    try {
      const response = await api.get(`/api/school/admin/students/${student._id}`);
      const studentData = response.data.student || {};

      // Fetch real-time pillar mastery for this student using the User ID (same as student dashboard)
      try {
        const userId = studentData.userId;
        
        if (userId) {
          // Use the same endpoint as student dashboard for real-time pillar data
          const masteryRes = await api.get(`/api/stats/pillar-mastery/${userId}`);
          const mastery = masteryRes.data || {};

          // Store the full pillars array from real-time data (all 10 pillars from UnifiedGameProgress)
          if (mastery.pillars && Array.isArray(mastery.pillars)) {
            studentData.pillarMasteryArray = mastery.pillars;
          }
          
          // Update avgScore from overallMastery (real-time calculation from game progress)
          if (typeof mastery.overallMastery === 'number') {
            studentData.avgScore = mastery.overallMastery;
          }
        }
      } catch (pillarsErr) {
        console.error('Failed to fetch real-time pillar mastery for student:', pillarsErr);
        // Don't fail the whole request, just log the error - will use fallback static data
      }

      setSelectedStudent(studentData);
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
    student.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Users className="w-10 h-10" />
              Student Management
            </h1>
            <p className="text-lg text-white/90">
              {filteredStudents.length} students • {stats.active || 0} active this month
            </p>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Motion.div
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
          </Motion.div>

          <Motion.div
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
          </Motion.div>

          <Motion.div
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
          </Motion.div>

          <Motion.div
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
          </Motion.div>
        </div>

        {/* Search & Filters */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search students by name, email, or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
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
          </Motion.div>

        {/* Students Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, idx) => (
              <Motion.div
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
                    <p className="text-xs text-gray-600">{student.email || 'N/A'}</p>
                  </div>
                  {student.wellbeingFlags?.length > 0 && (
                    <Flag className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900 truncate">{student.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold text-gray-900">{student.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-semibold text-gray-900">{student.gender || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-600">Linked Parent:</span>{' '}
                      {student.parents && student.parents.length > 0 ? (
                        <div className="mt-1 space-y-1">
                          <div className="font-semibold text-gray-900 truncate">
                            {student.parents[0].name || 'Parent'}
                          </div>
                          <div className="text-xs text-gray-600 truncate">{student.parents[0].email || 'N/A'}</div>
                          {student.parents.length > 1 && (
                            <div className="text-xs text-gray-500">+{student.parents.length - 1} more linked</div>
                          )}
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">N/A</span>
                      )}
                    </div>
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
              </Motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Student</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Phone</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Gender</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Linked Parent</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <Motion.tr
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
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{student.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{student.gender || 'N/A'}</td>
                    <td className="py-4 px-6">
                      {student.parents && student.parents.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-gray-900">{student.parents[0].name || 'N/A'}</p>
                          <p className="text-xs text-gray-600">{student.parents[0].email || 'N/A'}</p>
                          {student.parents.length > 1 && (
                            <p className="text-xs text-gray-500">+{student.parents.length - 1} more</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-500">N/A</span>
                      )}
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
                  </Motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredStudents.length === 0 && !loading && (
          <Motion.div
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
            </Motion.div>
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
      <StudentDetailModal
        showStudentDetail={showStudentDetail}
        setShowStudentDetail={setShowStudentDetail}
        selectedStudent={selectedStudent}
        openResetPasswordModal={openResetPasswordModal}
        handleDeleteStudent={handleDeleteStudent}
      />
      <ResetPasswordModal
        showResetPasswordModal={showResetPasswordModal}
        setShowResetPasswordModal={setShowResetPasswordModal}
        resetPasswordData={resetPasswordData}
        setResetPasswordData={setResetPasswordData}
        handleResetPassword={handleResetPassword}
      />
      <LimitReachedModal
        open={limitModal.open}
        message={limitModal.message}
        type={limitModal.type}
        onClose={() => setLimitModal((prev) => ({ ...prev, open: false }))}
        onRequest={() => {
          setLimitModal((prev) => ({ ...prev, open: false }));
        }}
      />
    </div>
  );
};

export default SchoolAdminStudents;
