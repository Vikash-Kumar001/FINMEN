import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Eye, Edit, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import CampaignList from '../../components/CSR/CampaignList';
import campaignService from '../../services/campaignService';

const CSRCampaigns = () => {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalReach: 0,
    budgetAllocated: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  // Load campaign statistics
  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await campaignService.getCampaigns({ status: 'active' });
      const allCampaigns = await campaignService.getCampaigns({});
      
      const activeCampaigns = response.data?.length || 0;
      const totalCampaigns = allCampaigns.data?.length || 0;
      
      // Calculate total reach (sum of all campaign participants)
      const totalReach = allCampaigns.data?.reduce((sum, campaign) => 
        sum + (campaign.participants?.length || 0), 0) || 0;
      
      // Calculate total budget allocated
      const budgetAllocated = allCampaigns.data?.reduce((sum, campaign) => 
        sum + (campaign.budget?.totalAmount || 0), 0) || 0;
      
      // Calculate success rate (completed campaigns / total campaigns)
      const completedCampaigns = allCampaigns.data?.filter(campaign => 
        campaign.status === 'completed').length || 0;
      const successRate = totalCampaigns > 0 ? Math.round((completedCampaigns / totalCampaigns) * 100) : 0;

      setStats({
        activeCampaigns,
        totalReach,
        budgetAllocated,
        successRate
      });
    } catch (error) {
      console.error('Error loading campaign stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
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
                className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >
                CSR Campaigns
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <Target className="w-5 h-5 text-green-500" />
                Manage and monitor all CSR campaigns and initiatives
              </motion.p>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Active Campaigns',
                value: loading ? '...' : stats.activeCampaigns.toString(),
                change: '+0 this month',
                icon: Target,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
              },
              {
                title: 'Total Reach',
                value: loading ? '...' : `${(stats.totalReach / 1000).toFixed(1)}K`,
                change: '+0% growth',
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Budget Allocated',
                value: loading ? '...' : `₹${(stats.budgetAllocated / 100000).toFixed(1)}L`,
                change: '+0% increase',
                icon: DollarSign,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200'
              },
              {
                title: 'Success Rate',
                value: loading ? '...' : `${stats.successRate}%`,
                change: '+0% improvement',
                icon: TrendingUp,
                color: 'from-orange-500 to-red-500',
                bgColor: 'from-orange-50 to-red-50',
                borderColor: 'border-orange-200'
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

        {/* Campaign List Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CampaignList
            onViewCampaign={() => {
              // Handle view campaign logic
            }}
            onCreateCampaign={() => {
              // Handle create campaign logic
            }}
            onEditCampaign={() => {
              // Handle edit campaign logic
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CSRCampaigns;
