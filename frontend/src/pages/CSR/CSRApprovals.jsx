import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, Clock, XCircle, AlertTriangle, Users, Building,
  Calendar, Target, TrendingUp, FileText, Eye, Edit
} from 'lucide-react';
import CampaignApprovalManager from '../../components/CSR/CampaignApprovalManager';
import campaignApprovalService from '../../services/campaignApprovalService';

const CSRApprovals = () => {
  const [approvalStats, setApprovalStats] = useState({
    totalApprovals: 0,
    pendingReview: 0,
    approved: 0,
    pilotMode: 0
  });
  const [loading, setLoading] = useState(true);

  // Load approval statistics
  const loadApprovalStats = async () => {
    setLoading(true);
    try {
      const response = await campaignApprovalService.getApprovalStats();
      const stats = response.data;
      
      setApprovalStats({
        totalApprovals: stats.statusBreakdown?.reduce((sum, item) => sum + (item.count || 0), 0) || 0,
        pendingReview: stats.statusBreakdown?.find(s => s._id === 'pending')?.count || 0,
        approved: stats.statusBreakdown?.find(s => s._id === 'approved')?.count || 0,
        pilotMode: stats.approvalTypes?.find(t => t._id === 'pilot')?.count || 0
      });
    } catch (error) {
      console.error('Error loading approval stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovalStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
              >
                Campaign Approvals
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-indigo-500" />
                Manage campaign approval workflows and school consent processes
              </motion.p>
            </div>
          </div>

          {/* Approval Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Total Approvals',
                value: loading ? '...' : approvalStats.totalApprovals.toString(),
                change: '+0 this week',
                icon: FileText,
                color: 'from-indigo-500 to-blue-500',
                bgColor: 'from-indigo-50 to-blue-50',
                borderColor: 'border-indigo-200'
              },
              {
                title: 'Pending Review',
                value: loading ? '...' : approvalStats.pendingReview.toString(),
                change: '0 urgent',
                icon: Clock,
                color: 'from-yellow-500 to-orange-500',
                bgColor: 'from-yellow-50 to-orange-50',
                borderColor: 'border-yellow-200'
              },
              {
                title: 'Approved',
                value: loading ? '...' : approvalStats.approved.toString(),
                change: '0% success rate',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
              },
              {
                title: 'Pilot Mode',
                value: loading ? '...' : approvalStats.pilotMode.toString(),
                change: 'Active pilots',
                icon: Target,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${stat.bgColor} border-2 ${stat.borderColor} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.title}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Approval Workflow Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-500" />
            Approval Workflow Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'School Admin Review',
                description: 'Initial review by school administration',
                icon: Building,
                color: 'from-blue-500 to-cyan-500',
                status: 'Completed'
              },
              {
                step: '2',
                title: 'Infrastructure Assessment',
                description: 'Technical and resource evaluation',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500',
                status: 'In Progress'
              },
              {
                step: '3',
                title: 'Final Approval',
                description: 'Central admin approval for launch',
                icon: Target,
                color: 'from-purple-500 to-pink-500',
                status: 'Pending'
              }
            ].map((workflow, index) => {
              const Icon = workflow.icon;
              return (
                <motion.div
                  key={workflow.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${workflow.color} text-white font-bold text-lg`}>
                      {workflow.step}
                    </div>
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${workflow.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{workflow.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{workflow.description}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    workflow.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : workflow.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Approval Manager Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <CampaignApprovalManager />
        </motion.div>
      </div>
    </div>
  );
};

export default CSRApprovals;
