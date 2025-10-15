import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Eye, CheckCircle, Clock, User, Calendar, Shield } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminEmergency = () => {
  const [loading, setLoading] = useState(true);
  const [escalationCases, setEscalationCases] = useState([]);
  const [escalationChains, setEscalationChains] = useState([]);

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    try {
      setLoading(true);
      const [casesRes, chainsRes] = await Promise.all([
        api.get('/api/school/admin/escalation/cases'),
        api.get('/api/school/admin/escalation-chains'),
      ]);
      setEscalationCases(casesRes.data.cases || []);
      setEscalationChains(chainsRes.data.chains || []);
    } catch (error) {
      console.error('Error fetching emergency data:', error);
      toast.error('Failed to load emergency data');
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
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <AlertTriangle className="w-10 h-10" />
              Emergency & Escalation
            </h1>
            <p className="text-lg text-white/90">{escalationCases.filter(c => c.status === 'active').length} active cases</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Active Cases
            </h3>
            <div className="space-y-3">
              {escalationCases.filter(c => c.status === 'active').map((cas, idx) => (
                <div key={idx} className="p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-red-600 font-bold">{cas.caseId}</span>
                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg font-black">Level {cas.currentLevel}</span>
                  </div>
                  <p className="font-bold text-gray-900">{cas.triggerDescription}</p>
                  <p className="text-xs text-gray-600 mt-1">Created: {new Date(cas.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {escalationCases.filter(c => c.status === 'active').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <p className="font-semibold">No active escalation cases</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                Escalation Chains
              </h3>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Chain
              </button>
            </div>
            <div className="space-y-3">
              {escalationChains.map((chain, idx) => (
                <div key={idx} className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900">{chain.name}</p>
                    <span className={`px-2 py-1 text-xs rounded-lg font-bold ${chain.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{chain.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-sm text-gray-600">{chain.description}</p>
                  <p className="text-xs text-gray-500 mt-2 font-semibold">{chain.levels?.length || 0} levels configured</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminEmergency;
