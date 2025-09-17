import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, Building, DollarSign, BarChart3, TrendingUp,
  Settings, Bell, Plus, Search, Filter, Download, Eye, Edit, Trash2,
  UserPlus, Calendar, CheckCircle, AlertCircle, Award, Clock, Target,
  BookOpen, FileText, Activity, PieChart
} from 'lucide-react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CollegeAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    totalCourses: 0,
    totalFees: 0,
    placementRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [placementStats, setPlacementStats] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activitiesRes, departmentsRes, studentsRes, facultyRes, placementRes] = await Promise.all([
        api.get('/api/college/admin/stats'),
        api.get('/api/college/admin/activities'),
        api.get('/api/college/admin/departments'),
        api.get('/api/college/admin/students'),
        api.get('/api/college/admin/faculty'),
        api.get('/api/college/admin/placement-stats')
      ]);

      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
      setDepartments(departmentsRes.data);
      setStudents(studentsRes.data);
      setFaculty(facultyRes.data);
      setPlacementStats(placementRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </motion.div>
  );

  const studentEnrollmentData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [{
      label: 'Students Enrolled',
      data: [1200, 1350, 1100, 1500, 1600],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const departmentDistributionData = {
    labels: ['Engineering', 'Management', 'Arts', 'Science', 'Commerce'],
    datasets: [{
      data: [800, 400, 200, 300, 250],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  };

  const placementData = {
    labels: ['Placed', 'Unplaced', 'Higher Studies'],
    datasets: [{
      data: [85, 10, 5],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ]
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">College Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your college operations and monitor performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
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
            icon={<Users className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
            change="+15%"
            changeType="increase"
          />
          <StatCard
            title="Total Faculty"
            value={stats.totalFaculty}
            icon={<GraduationCap className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
            change="+8%"
            changeType="increase"
          />
          <StatCard
            title="Departments"
            value={stats.totalDepartments}
            icon={<Building className="w-6 h-6" />}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Placement Rate"
            value={`${stats.placementRate}%`}
            icon={<Award className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
            change="+5.2%"
            changeType="increase"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Enrollment Trend</h3>
            <Line data={studentEnrollmentData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
            <Doughnut data={departmentDistributionData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Placement Status</h3>
            <Pie data={placementData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Departments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
            <div className="space-y-3">
              {departments.map((dept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-500">{dept.students} students • {dept.faculty} faculty</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-indigo-600 hover:bg-indigo-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
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
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
              <UserPlus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Add Student</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
              <GraduationCap className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Add Faculty</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <Building className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Manage Departments</p>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
              <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-900">Manage Fees</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;