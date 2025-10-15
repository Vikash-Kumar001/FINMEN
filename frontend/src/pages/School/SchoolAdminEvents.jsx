import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Download, Users, BarChart3, TrendingUp, Award, Target } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminEvents = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsDashboard, setAnalyticsDashboard] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(dateRange);
      const response = await api.get(`/api/analytics/dashboard?${params}`);
      setAnalyticsDashboard(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Activity className="w-10 h-10" />
              Analytics Events
            </h1>
            <p className="text-lg text-white/90">Track user activity and engagement metrics</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6 flex gap-4">
          <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))} className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold" />
          <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))} className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl"><Activity className="w-6 h-6 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-4xl font-black text-blue-600">{analyticsDashboard?.summary?.totalEvents || 0}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl"><Users className="w-6 h-6 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-4xl font-black text-green-600">{analyticsDashboard?.summary?.totalUsers || 0}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl"><BarChart3 className="w-6 h-6 text-purple-600" /></div>
              <div>
                <p className="text-sm text-gray-600">Event Types</p>
                <p className="text-4xl font-black text-purple-600">{analyticsDashboard?.summary?.uniqueEventTypes || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Event Types</h3>
          <div className="space-y-3">
            {analyticsDashboard?.eventCounts?.slice(0, 10).map((event, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-700">{event.eventName}</span>
                  <span className="text-sm font-black text-gray-900">{event.count} events</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${(event.count / analyticsDashboard.eventCounts[0].count) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolAdminEvents;
