import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, BookOpen, CheckCircle,
  UserPlus, Bell, Plus, Download, TrendingUp, Award
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SchoolAdminDashboard = () => {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', classId: '', section: '', academicYear: '', admissionNumber: '', password: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', subject: '', password: '' });
  const [parentForm, setParentForm] = useState({ name: '', email: '', studentCode: '', password: '' });
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [classForm, setClassForm] = useState({ name: '', section: '' });
  const [recentActivities, setRecentActivities] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalParents: 0,
    totalFees: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Add event listener for ESC key to close modals
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowStudentModal(false);
        setShowTeacherModal(false);
        setShowParentModal(false);
        setShowClassModal(false);
        setCreatedCredentials(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activitiesRes] = await Promise.all([
        api.get('/api/school/stats'),
        api.get('/api/school/activities')
      ]);

      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!validateEmail(studentForm.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (studentForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!studentForm.classId || !studentForm.section || !studentForm.academicYear || !studentForm.admissionNumber) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const res = await api.post('/api/school/student', {
        name: studentForm.name,
        email: studentForm.email,
        password: studentForm.password,
        classId: studentForm.classId,
        section: studentForm.section,
        academicYear: studentForm.academicYear,
        admissionNumber: studentForm.admissionNumber
      });
      setCreatedCredentials({
        role: 'Student',
        email: res.data.user.email,
        password: studentForm.password,
        studentCode: res.data.user.studentCode
      });
      setShowStudentModal(false);
      setStudentForm({ name: '', email: '', classId: '', section: '', academicYear: '', admissionNumber: '', password: '' });
      toast.success('Student created!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create student');
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!validateEmail(teacherForm.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (teacherForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await api.post('/api/school/teacher', {
        name: teacherForm.name,
        email: teacherForm.email,
        password: teacherForm.password,
        subject: teacherForm.subject
      });
      setCreatedCredentials({ 
        role: 'Teacher', 
        email: res.data.user.email, 
        password: teacherForm.password 
      });
      setShowTeacherModal(false);
      setTeacherForm({ name: '', email: '', subject: '', password: '' });
      toast.success('Teacher created!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create teacher');
    }
  };

  const handleAddParent = async (e) => {
    e.preventDefault();
    if (!validateEmail(parentForm.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (parentForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await api.post('/api/school/parent', {
        name: parentForm.name,
        email: parentForm.email,
        password: parentForm.password,
        studentCode: parentForm.studentCode
      });
      setCreatedCredentials({ 
        role: 'Parent', 
        email: res.data.user.email, 
        password: parentForm.password 
      });
      setShowParentModal(false);
      setParentForm({ name: '', email: '', studentCode: '', password: '' });
      toast.success('Parent created!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create parent');
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!classForm.name || !classForm.section) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await api.post('/api/school/class', {
        name: classForm.name,
        section: classForm.section
      });
      toast.success('Class created!');
      setShowClassModal(false);
      setClassForm({ name: '', section: '' });
      fetchDashboardData(); // Refresh stats after creating class
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create class');
    }
  };

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 mr-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-br ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      }
    }
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Attendance %',
      data: [95, 92, 88, 94, 96, 90],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const classDistributionData = {
    labels: ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'],
    datasets: [{
      data: [120, 150, 180, 200],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {createdCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <h2 className="text-xl font-bold mb-4">{createdCredentials.role} Account Created</h2>
            <p className="mb-2">Share these credentials with the user for login:</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4 text-left">
              <div><span className="font-semibold">Email:</span> {createdCredentials.email}</div>
              <div><span className="font-semibold">Password:</span> {createdCredentials.password}</div>
              {createdCredentials.studentCode && (
                <div><span className="font-semibold">Student Code:</span> {createdCredentials.studentCode}</div>
              )}
            </div>
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => setCreatedCredentials(null)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Modals */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Add Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={studentForm.name} 
                onChange={e => setStudentForm(f => ({ ...f, name: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={studentForm.email} 
                onChange={e => setStudentForm(f => ({ ...f, email: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              {/* Class Dropdown (ObjectId) */}
              <select
                value={studentForm.classId}
                onChange={e => setStudentForm(f => ({ ...f, classId: e.target.value }))}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Class</option>
                {/* TODO: Map available classes from backend here */}
              </select>
              <input
                type="text"
                placeholder="Section (e.g. A, B)"
                value={studentForm.section}
                onChange={e => setStudentForm(f => ({ ...f, section: e.target.value }))}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Academic Year (e.g. 2025-2026)"
                value={studentForm.academicYear}
                onChange={e => setStudentForm(f => ({ ...f, academicYear: e.target.value }))}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Admission Number"
                value={studentForm.admissionNumber}
                onChange={e => setStudentForm(f => ({ ...f, admissionNumber: e.target.value }))}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={studentForm.password} 
                onChange={e => setStudentForm(f => ({ ...f, password: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowStudentModal(false)} 
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Similar updates for other modals (Teacher, Parent, Class) with same improvements */}
      {/* Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={teacherForm.name} 
                onChange={e => setTeacherForm(f => ({ ...f, name: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={teacherForm.email} 
                onChange={e => setTeacherForm(f => ({ ...f, email: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                required 
              />
              <input 
                type="text" 
                placeholder="Subject" 
                value={teacherForm.subject} 
                onChange={e => setTeacherForm(f => ({ ...f, subject: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={teacherForm.password} 
                onChange={e => setTeacherForm(f => ({ ...f, password: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                required 
              />
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowTeacherModal(false)} 
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Parent Modal */}
      {showParentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Add Parent</h2>
            <form onSubmit={handleAddParent} className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={parentForm.name} 
                onChange={e => setParentForm(f => ({ ...f, name: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={parentForm.email} 
                onChange={e => setParentForm(f => ({ ...f, email: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" 
                required 
              />
              <input 
                type="text" 
                placeholder="Student Code" 
                value={parentForm.studentCode} 
                onChange={e => setParentForm(f => ({ ...f, studentCode: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={parentForm.password} 
                onChange={e => setParentForm(f => ({ ...f, password: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" 
                required 
              />
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowParentModal(false)} 
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Create Class</h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <input 
                type="text" 
                placeholder="Class Name" 
                value={classForm.name} 
                onChange={e => setClassForm(f => ({ ...f, name: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                required 
              />
              <input 
                type="text" 
                placeholder="Section" 
                value={classForm.section} 
                onChange={e => setClassForm(f => ({ ...f, section: e.target.value }))} 
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                required 
              />
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowClassModal(false)} 
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">School Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your school operations and monitor performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowStudentModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </button>
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<Users className="w-6 h-6 text-white" />}
            color="from-blue-500 to-cyan-500"
            change="+12%"
            changeType="increase"
          />
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={<GraduationCap className="w-6 h-6 text-white" />}
            color="from-green-500 to-emerald-500"
            change="+5%"
            changeType="increase"
          />
          <StatCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={<BookOpen className="w-6 h-6 text-white" />}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            color="from-orange-500 to-red-500"
            change="+2.5%"
            changeType="increase"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance Trend</h3>
            <div style={{ height: '300px' }}>
              <Line data={attendanceData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Distribution</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={classDistributionData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Activities and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Bell className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center" 
                onClick={() => setShowStudentModal(true)}
              >
                <UserPlus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">Add Student</p>
              </button>
              <button 
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center" 
                onClick={() => setShowTeacherModal(true)}
              >
                <GraduationCap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">Add Teacher</p>
              </button>
              <button 
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center" 
                onClick={() => setShowParentModal(true)}
              >
                <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">Add Parent</p>
              </button>
              <button 
                className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center" 
                onClick={() => setShowClassModal(true)}
              >
                <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-orange-900">Create Class</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;