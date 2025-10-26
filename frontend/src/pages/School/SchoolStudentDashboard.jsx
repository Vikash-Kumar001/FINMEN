import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Calendar, Clock, CheckCircle, AlertCircle, Award,
  TrendingUp, Target, Users, Bell, Settings, Download, Eye,
  FileText, GraduationCap, Star, Trophy, BarChart3
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import Navbar from '../../components/Navbar';

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

const SchoolStudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendance: 0,
    assignmentsCompleted: 0,
    averageScore: 0,
    rank: 0
  });
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, assignmentsRes, timetableRes, gradesRes, announcementsRes] = await Promise.all([
        api.get('/api/school/student/stats'),
        api.get('/api/school/student/assignments'),
        api.get('/api/school/student/timetable'),
        api.get('/api/school/student/grades'),
        api.get('/api/school/student/announcements')
      ]);

      setStats(statsRes.data);
      setAssignments(assignmentsRes.data);
      setTimetable(timetableRes.data);
      setRecentGrades(gradesRes.data);
      setAnnouncements(announcementsRes.data);
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
    labels: ['Math', 'Science', 'English', 'History', 'Geography'],
    datasets: [{
      label: 'Scores',
      data: [85, 92, 78, 88, 95],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Attendance %',
      data: [100, 95, 100, 90, 100],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  const gradeDistributionData = {
    labels: ['A+', 'A', 'B+', 'B', 'C'],
    datasets: [{
      data: [3, 5, 2, 1, 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(107, 114, 128, 0.8)'
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
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your academic progress and stay updated</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                View Timetable
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Attendance"
            value={`${stats.attendance}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
            change="+2.5%"
            changeType="increase"
          />
          <StatCard
            title="Assignments"
            value={stats.assignmentsCompleted}
            icon={<FileText className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
            change="+3"
            changeType="increase"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            icon={<Award className="w-6 h-6" />}
            color="from-purple-500 to-pink-500"
            change="+5.2%"
            changeType="increase"
          />
          <StatCard
            title="Class Rank"
            value={`#${stats.rank}`}
            icon={<Trophy className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
            <Bar data={performanceData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance</h3>
            <Line data={attendanceData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
            <Doughnut data={gradeDistributionData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upcoming Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{assignment.subject} • Due: {assignment.dueDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Today's Timetable */}
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
                    <p className="text-sm text-gray-500">{schedule.time} • {schedule.teacher}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {schedule.room}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Grades & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Grades */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{grade.subject}</p>
                    <p className="text-sm text-gray-500">{grade.assignment}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                      grade.score >= 90 ? 'bg-green-100 text-green-800' :
                      grade.score >= 80 ? 'bg-blue-100 text-blue-800' :
                      grade.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {grade.score}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h3>
            <div className="space-y-3">
              {announcements.map((announcement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{announcement.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{announcement.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{announcement.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolStudentDashboard;