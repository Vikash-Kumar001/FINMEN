import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, Eye, Download, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminCompliance = () => {
  const [loading, setLoading] = useState(true);
  const [complianceData, setComplianceData] = useState({});
  const [retentionPolicies, setRetentionPolicies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, policiesRes, logsRes] = await Promise.all([
        api.get('/api/school/admin/compliance/dashboard'),
        api.get('/api/school/admin/compliance/policies'),
        api.get('/api/school/admin/compliance/audit-logs?limit=20'),
      ]);
      setComplianceData(dashboardRes.data);
      setRetentionPolicies(policiesRes.data.policies || []);
      setAuditLogs(logsRes.data.logs || []);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
      toast.error('Failed to load compliance data');
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
              <Shield className="w-10 h-10" />
              Policy & Compliance
            </h1>
            <p className="text-lg text-white/90">Manage data policies, consents, and audit logs</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 mb-6 flex gap-2">
          {['overview', 'policies', 'audit'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-xl font-bold transition-all capitalize ${activeTab === tab ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}>{tab}</button>
          ))}
        </motion.div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                <div>
                  <p className="text-sm text-gray-600">Active Consents</p>
                  <p className="text-3xl font-black text-gray-900">{complianceData.summary?.totalConsents || 0}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl"><Database className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-gray-600">Data Policies</p>
                  <p className="text-3xl font-black text-gray-900">{retentionPolicies.length}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl"><Eye className="w-6 h-6 text-purple-600" /></div>
                <div>
                  <p className="text-sm text-gray-600">Audit Logs</p>
                  <p className="text-3xl font-black text-gray-900">{auditLogs.length}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-4">
            {retentionPolicies.map((policy, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{policy.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Type: <span className="font-bold">{policy.dataType}</span></span>
                      <span className="text-gray-600">Retention: <span className="font-bold">{policy.retentionPeriod?.value} {policy.retentionPeriod?.unit}</span></span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${policy.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{policy.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Timestamp</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Action</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">User</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Target</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{log.action}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{log.userName}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{log.targetName || log.targetType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolAdminCompliance;
