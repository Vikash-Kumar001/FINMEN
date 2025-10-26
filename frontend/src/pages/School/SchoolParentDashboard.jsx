import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, BookOpen, DollarSign, CheckCircle, AlertCircle,
  TrendingUp, Award, Bell, Calendar, Clock, Eye, Download, MessageCircle,
  BarChart3, Target, Star, Trophy, FileText, Settings
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

const SchoolParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState([]);
  const [childStats, setChildStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [feeStatus, setFeeStatus] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [childrenRes, activitiesRes, feesRes, announcementsRes] = await Promise.all([
        api.get('/api/school/parent/children'),
        api.get('/api/school/parent/activities'),
        api.get('/api/school/parent/fees'),
        api.get('/api/school/parent/announcements')
      ]);

      setChildren(childrenRes.data);
      setRecentActivities(activitiesRes.data);
      setFeeStatus(feesRes.data);
      setAnnouncements(announcementsRes.data);
      
      if (childrenRes.data.length > 0) {
        setSelectedChild(childrenRes.data[0]);
        fetchChildStats(childrenRes.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildStats = async (childId) => {
    try {
      const response = await api.get(`/api/school/parent/child/${childId}/stats`);
      setChildStats(response.data);
    } catch (error) {
      console.error('Error fetching child stats:', error);
    }
  };

  const handleChildChange = (child) => {
    setSelectedChild(child);
    fetchChildStats(child.id);
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
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Attendance %',
      data: [95, 92, 88, 94],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  const feeStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      data: [3, 1, 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
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
              <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your child's academic progress and school activities</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Teacher
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Child Selection */}
        {children.length > 1 && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Child</h3>
            <div className="flex space-x-4">
              {children.map((child) => (
                <div key={child.id} className="flex items-center gap-2">
                  <button
                    onClick={() => handleChildChange(child)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedChild?.id === child.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {child.name} - {child.class}
                  </button>
                  <button
                    onClick={() => window.location.href = `/school-parent/student/${child.id}/chat`}
                    className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                    title="Chat with teacher"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {selectedChild && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Child Performance</h3>
              <button
                onClick={() => window.location.href = `/school-parent/student/${selectedChild.id}/chat`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Teacher
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Attendance"
              value={`${childStats.attendance || 0}%`}
              icon={<CheckCircle className="w-6 h-6" />}
              color="from-green-500 to-emerald-500"
              change="+2.5%"
              changeType="increase"
            />
            <StatCard
              title="Average Score"
              value={`${childStats.averageScore || 0}%`}
              icon={<Award className="w-6 h-6" />}
              color="from-blue-500 to-cyan-500"
              change="+5.2%"
              changeType="increase"
            />
            <StatCard
              title="Assignments"
              value={childStats.assignmentsCompleted || 0}
              icon={<FileText className="w-6 h-6" />}
              color="from-purple-500 to-pink-500"
              change="+3"
              changeType="increase"
            />
            <StatCard
              title="Class Rank"
              value={`#${childStats.rank || 0}`}
              icon={<Trophy className="w-6 h-6" />}
              color="from-orange-500 to-red-500"
            />
            </div>
          </div>
        )}

        {/* Charts Row */}
        {selectedChild && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <Bar data={performanceData} options={{ responsive: true }} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance</h3>
              <Line data={attendanceData} options={{ responsive: true }} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Status</h3>
              <Doughnut data={feeStatusData} options={{ responsive: true }} />
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

          {/* Fee Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Status</h3>
            <div className="space-y-3">
              {feeStatus.map((fee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{fee.description}</p>
                    <p className="text-sm text-gray-500">Due: {fee.dueDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      fee.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      fee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {fee.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">₹{fee.amount}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* School Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School Announcements</h3>
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <MessageCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">Contact Teacher</p>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">Pay Fees</p>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
                <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">View Calendar</p>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
                <Download className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-orange-900">Download Report</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolParentDashboard;