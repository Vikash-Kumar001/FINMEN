import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, Calendar, Clock, CheckCircle, AlertCircle,
  Plus, Search, Filter, Download, Eye, Edit, Award, TrendingUp,
  Bell, Settings, User, GraduationCap, BarChart3, Target
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  Title,
  Tooltip,
  Legend
);

const SchoolTeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    attendanceRate: 0,
    assignmentsGraded: 0
  });
  const [classes, setClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, classesRes, assignmentsRes, timetableRes] = await Promise.all([
        api.get('/api/school/teacher/stats'),
        api.get('/api/school/teacher/classes'),
        api.get('/api/school/teacher/assignments'),
        api.get('/api/school/teacher/timetable')
      ]);

      setStats(statsRes.data);
      setClasses(classesRes.data);
      setRecentAssignments(assignmentsRes.data);
      setTimetable(timetableRes.data);
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

  const performanceData = {
    labels: ['Class 6A', 'Class 7B', 'Class 8A', 'Class 9B', 'Class 10A'],
    datasets: [{
      label: 'Average Score',
      data: [85, 78, 92, 88, 95],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Attendance %',
      data: [95, 92, 88, 94, 96],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
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
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your classes and track student progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                View Timetable
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
            change="+8%"
            changeType="increase"
          />
          <StatCard
            title="Active Classes"
            value={stats.totalClasses}
            icon={<BookOpen className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            color="from-purple-500 to-pink-500"
            change="+3.2%"
            changeType="increase"
          />
          <StatCard
            title="Assignments Graded"
            value={stats.assignmentsGraded}
            icon={<Award className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance</h3>
            <Bar data={performanceData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance</h3>
            <Line data={attendanceData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Classes</h3>
            <div className="space-y-3">
              {classes.map((classItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{classItem.name}</p>
                    <p className="text-sm text-gray-500">{classItem.students} students</p>
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

          {/* Recent Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assignments</h3>
            <div className="space-y-3">
              {recentAssignments.map((assignment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{assignment.class} • Due: {assignment.dueDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assignment.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {timetable.map((schedule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Clock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{schedule.subject}</p>
                    <p className="text-sm text-gray-500">{schedule.class} • {schedule.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
              <Plus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">New Assignment</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Mark Attendance</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Grade Assignments</p>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
              <BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-900">View Reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolTeacherDashboard;