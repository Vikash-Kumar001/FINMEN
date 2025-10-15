import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, Grid, List, ChevronDown, Download, Eye,
  BookOpen, TrendingUp, Zap, Coins, Star, Activity, MessageSquare, FileText,
  Heart, Clock, Plus, UserPlus, MoreVertical, AlertCircle, CheckCircle, Award,
  X, Mail, Phone, Calendar, MapPin, Shield, Target, Brain, Trophy, GraduationCap, Trash2
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminTeachers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showTeacherDetail, setShowTeacherDetail] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '', 
    email: '', 
    phone: '', 
    subject: '', 
    qualification: '',
    experience: '',
    joiningDate: ''
  });

  const subjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education',
    'Arts', 'Music', 'Other'
  ];

  const fetchTeachersData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterSubject !== 'all') params.append('subject', filterSubject);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const [teachersRes, statsRes] = await Promise.all([
        api.get(`/api/school/admin/teachers?${params}`),
        api.get('/api/school/admin/teachers/stats'),
      ]);

      setTeachers(teachersRes.data.teachers || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }, [filterSubject, filterStatus]);

  useEffect(() => {
    fetchTeachersData();
  }, [fetchTeachersData]);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/school/admin/teachers/create', newTeacher);
      toast.success('Teacher added successfully!');
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
      fetchTeachersData();
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to add teacher');
    }
  };

  const handleViewTeacher = async (teacher) => {
    try {
      const response = await api.get(`/api/school/admin/teachers/${teacher._id}`);
      setSelectedTeacher(response.data.teacher);
      setShowTeacherDetail(true);
    } catch (error) {
      console.error('Error fetching teacher details:', error);
      toast.error('Failed to load teacher details');
    }
  };

  const handleDeleteTeacher = async (teacherId, teacherName) => {
    if (!window.confirm(`Are you sure you want to delete ${teacherName}? This will permanently remove the teacher account and all associated data.`)) {
      return;
    }

    try {
      await api.delete(`/api/school/admin/teachers/${teacherId}`);
      toast.success('Teacher deleted successfully!');
      fetchTeachersData();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to delete teacher');
    }
  };

  const handleExportTeachers = async () => {
    try {
      const params = new URLSearchParams();
      if (filterSubject !== 'all') params.append('subject', filterSubject);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/api/school/admin/teachers/export?format=csv&${params}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `teachers-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Teachers exported successfully!');
    } catch (error) {
      console.error('Error exporting teachers:', error);
      toast.error('Failed to export teachers');
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Teacher Modal
  const AddTeacherModal = ({
    showAddTeacherModal,
    setShowAddTeacherModal,
    newTeacher,
    setNewTeacher,
    handleAddTeacher
  }) => (
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

  // Teacher Detail Modal
  const TeacherDetailModal = () => (
    <AnimatePresence>
      {showTeacherDetail && selectedTeacher && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTeacherDetail(false)}
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
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {selectedTeacher.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black mb-1">{selectedTeacher.name || 'Teacher'}</h2>
                      <p className="text-sm text-white/80">{selectedTeacher.subject || 'N/A'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTeacherDetail(false)}
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
                    <p className="text-xs text-gray-600 mb-1">Classes</p>
                    <p className="text-2xl font-black text-blue-600">{selectedTeacher.totalClasses || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Students</p>
                    <p className="text-2xl font-black text-green-600">{selectedTeacher.totalStudents || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Experience</p>
                    <p className="text-2xl font-black text-purple-600">{selectedTeacher.experience || 0} yrs</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Attendance</p>
                    <p className="text-2xl font-black text-orange-600">{selectedTeacher.attendance || 0}%</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold text-gray-900">{selectedTeacher.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-900">{selectedTeacher.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Qualification:</span>
                      <span className="font-semibold text-gray-900">{selectedTeacher.qualification || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Joining Date:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTeacher.joiningDate ? new Date(selectedTeacher.joiningDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Last Active:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTeacher.lastActive ? new Date(selectedTeacher.lastActive).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        selectedTeacher.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedTeacher.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Classes Assigned */}
                {selectedTeacher.assignedClasses && selectedTeacher.assignedClasses.length > 0 && (
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Assigned Classes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedTeacher.assignedClasses.map((cls, idx) => (
                        <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="font-bold text-gray-900">{cls.name || `Class ${cls.grade}-${cls.section}`}</div>
                          <div className="text-sm text-gray-600">{cls.students || 0} students</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                {selectedTeacher.metrics && (
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Performance Metrics
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(selectedTeacher.metrics).map(([metric, value]) => (
                        <div key={metric}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-gray-700 capitalize">
                              {metric.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm font-black text-gray-900">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                value >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                value >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                                'bg-gradient-to-r from-red-500 to-pink-600'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowTeacherDetail(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowTeacherDetail(false);
                      handleDeleteTeacher(selectedTeacher._id, selectedTeacher.name);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Teacher
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <GraduationCap className="w-10 h-10" />
              Teacher Management
            </h1>
            <p className="text-lg text-white/90">
              {filteredTeachers.length} teachers • {stats.active || 0} active this month
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
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
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
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalClasses || 0}</p>
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
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Experience</p>
                <p className="text-2xl font-black text-gray-900">{stats.avgExperience || 0} yrs</p>
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
                placeholder="Search teachers by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                onClick={handleExportTeachers}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Add Teacher
              </button>
            </div>
          </div>
        </motion.div>

        {/* Teachers Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher, idx) => (
              <motion.div
                key={teacher._id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {teacher.name?.charAt(0) || 'T'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{teacher.name || 'Teacher'}</h3>
                    <p className="text-xs text-gray-600">{teacher.subject || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <p className="text-xs text-gray-600">Classes</p>
                    <p className="text-lg font-black text-blue-600">{teacher.totalClasses || 0}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <p className="text-xs text-gray-600">Students</p>
                    <p className="text-lg font-black text-green-600">{teacher.totalStudents || 0}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-purple-50">
                    <p className="text-xs text-gray-600">Exp</p>
                    <p className="text-lg font-black text-purple-600">{teacher.experience || 0}y</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold text-gray-900 truncate max-w-[150px]">{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-semibold text-gray-900">{teacher.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewTeacher(teacher)}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTeacher(teacher._id, teacher.name);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                    title="Delete Teacher"
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
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Teacher</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Subject</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Classes</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Students</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Experience</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher, idx) => (
                  <motion.tr
                    key={teacher._id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                          {teacher.name?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{teacher.name || 'Teacher'}</p>
                          <p className="text-xs text-gray-500">{teacher.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{teacher.subject || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{teacher.totalClasses || 0}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{teacher.totalStudents || 0}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{teacher.experience || 0} yrs</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        teacher.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {teacher.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewTeacher(teacher)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher._id, teacher.name)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete Teacher"
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

        {filteredTeachers.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
          >
            <GraduationCap className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Teachers Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or add new teachers</p>
            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <UserPlus className="w-5 h-5" />
              Add New Teacher
            </button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddTeacherModal
        showAddTeacherModal={showAddTeacherModal}
        setShowAddTeacherModal={setShowAddTeacherModal}
        newTeacher={newTeacher}
        setNewTeacher={setNewTeacher}
        handleAddTeacher={handleAddTeacher}
      />
      <TeacherDetailModal />
    </div>
  );
};

export default SchoolAdminTeachers;

