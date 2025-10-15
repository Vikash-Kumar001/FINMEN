import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Download, Calendar, Filter, Award, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminNEPTracking = () => {
  const [loading, setLoading] = useState(true);
  const [nepDashboard, setNepDashboard] = useState(null);
  const [nepCompetencies, setNepCompetencies] = useState([]);
  const [exportFilters, setExportFilters] = useState({ startDate: '', endDate: '', grade: '', format: 'csv' });

  useEffect(() => {
    fetchNEPData();
  }, []);

  const fetchNEPData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, competenciesRes] = await Promise.all([
        api.get('/api/school/admin/nep/dashboard'),
        api.get('/api/school/admin/nep/competencies'),
      ]);
      setNepDashboard(dashboardRes.data);
      setNepCompetencies(competenciesRes.data.competencies || []);
    } catch (error) {
      console.error('Error fetching NEP data:', error);
      toast.error('Failed to load NEP tracking data');
    } finally {
      setLoading(false);
    }
  };

  const exportNEPReport = async () => {
    try {
      const params = new URLSearchParams(exportFilters);
      const response = await api.get(`/api/school/admin/nep/coverage/export/${exportFilters.format}?${params}`, {
        responseType: exportFilters.format === 'csv' ? 'blob' : 'json'
      });
      if (exportFilters.format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `nep-coverage-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      toast.success('NEP report exported!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Target className="w-10 h-10" />
              NEP 2020 Competency Tracking
            </h1>
            <p className="text-lg text-white/90">
              {nepDashboard?.summary?.competenciesCovered || 0} competencies covered • {nepDashboard?.summary?.coveragePercentage || 0}% alignment
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Competencies Covered</p>
                <p className="text-3xl font-black text-gray-900">{nepDashboard?.summary?.competenciesCovered || 0}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Coverage Percentage</p>
                <p className="text-3xl font-black text-gray-900">{nepDashboard?.summary?.coveragePercentage || 0}%</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Coverage Hours</p>
                <p className="text-3xl font-black text-gray-900">{nepDashboard?.summary?.totalHours || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Export NEP Coverage Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="date" value={exportFilters.startDate} onChange={(e) => setExportFilters(prev => ({ ...prev, startDate: e.target.value }))} className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold" placeholder="Start Date" />
            <input type="date" value={exportFilters.endDate} onChange={(e) => setExportFilters(prev => ({ ...prev, endDate: e.target.value }))} className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold" placeholder="End Date" />
            <select value={exportFilters.grade} onChange={(e) => setExportFilters(prev => ({ ...prev, grade: e.target.value }))} className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold">
              <option value="">All Grades</option>
              {[6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
            <button onClick={exportNEPReport} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nepCompetencies.slice(0, 12).map((comp, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-xl shadow border-2 border-gray-100 p-4 hover:shadow-lg hover:border-purple-300 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg font-mono font-bold">{comp.competencyId}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg capitalize font-bold">{comp.pillar}</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{comp.title}</h4>
              <p className="text-xs text-gray-600">{comp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminNEPTracking;
