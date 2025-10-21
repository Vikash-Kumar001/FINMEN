import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Activity, FileText, Target, Users, DollarSign, CheckCircle,
  Calendar, MapPin, Award, Brain, Heart, BookOpen, Star
} from 'lucide-react';
import CampaignWizardEnhanced from '../../components/CSR/CampaignWizardEnhanced';
import campaignService from '../../services/campaignService';

const CSRCampaignWizard = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load recent campaigns
  const loadRecentCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignService.getCampaigns({ limit: 3 });
      setRecentCampaigns(response.data || []);
    } catch (error) {
      console.error('Error loading recent campaigns:', error);
      setRecentCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentCampaigns();
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
                className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"
              >
                Campaign Wizard
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <Zap className="w-5 h-5 text-yellow-500" />
                Create and manage comprehensive CSR campaigns with advanced analytics
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:shadow-2xl transition-all font-semibold text-lg"
            >
              <Zap className="w-6 h-6" />
              Create New Campaign
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          {[
            {
              title: 'Step-by-Step Wizard',
              description: '7-step guided campaign creation process with validation and preview',
              icon: Zap,
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'from-blue-50 to-cyan-50',
              borderColor: 'border-blue-200',
              features: ['Scope Definition', 'Template Selection', 'Pilot Configuration', 'Budget Planning']
            },
            {
              title: 'Live Monitoring',
              description: 'Real-time campaign performance tracking with detailed analytics',
              icon: Activity,
              color: 'from-green-500 to-emerald-500',
              bgColor: 'from-green-50 to-emerald-50',
              borderColor: 'border-green-200',
              features: ['Real-time Metrics', 'Progress Tracking', 'Performance Analytics', 'Alert System']
            },
            {
              title: 'Impact Reporting',
              description: 'Comprehensive PDF reports with NEP mapping and stakeholder insights',
              icon: FileText,
              color: 'from-purple-500 to-pink-500',
              bgColor: 'from-purple-50 to-pink-50',
              borderColor: 'border-purple-200',
              features: ['PDF Generation', 'NEP Mapping', 'Stakeholder Reports', 'Custom Branding']
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-8 bg-gradient-to-br ${feature.bgColor} border-2 ${feature.borderColor} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} w-fit mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 font-medium mb-6">{feature.description}</p>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Campaign Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-indigo-500" />
            Campaign Types
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Financial Literacy',
                description: 'Teach money management and financial planning',
                icon: DollarSign,
                color: 'from-emerald-500 to-teal-500',
                students: '0',
                completion: '0%'
              },
              {
                title: 'Mental Wellness',
                description: 'Promote mental health and emotional well-being',
                icon: Heart,
                color: 'from-blue-500 to-indigo-500',
                students: '0',
                completion: '0%'
              },
              {
                title: 'Values Education',
                description: 'Instill ethical values and character development',
                icon: Award,
                color: 'from-purple-500 to-pink-500',
                students: '0',
                completion: '0%'
              },
              {
                title: 'AI & Technology',
                description: 'Introduce coding and digital literacy skills',
                icon: Brain,
                color: 'from-orange-500 to-red-500',
                students: '0',
                completion: '0%'
              }
            ].map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${type.color} w-fit mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{type.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Students: <span className="font-semibold text-gray-800">{type.students}</span></span>
                    <span className="text-gray-500">Completion: <span className="font-semibold text-gray-800">{type.completion}</span></span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-500" />
            Recent Campaigns
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading recent campaigns...</p>
              </div>
            ) : recentCampaigns.length > 0 ? recentCampaigns.map((campaign, index) => {
              const getStatusColor = (status) => {
                switch (status) {
                  case 'active': return 'green';
                  case 'pilot': return 'blue';
                  case 'draft': return 'gray';
                  case 'completed': return 'green';
                  default: return 'gray';
                }
              };

              const getProgress = (campaign) => {
                if (campaign.progress) return campaign.progress;
                if (campaign.status === 'completed') return 100;
                if (campaign.status === 'active') return 75;
                if (campaign.status === 'pilot') return 45;
                return 20;
              };

              return (
                <motion.div
                  key={campaign._id || campaign.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all"
                >
                  <div className={`w-4 h-4 rounded-full bg-${getStatusColor(campaign.status)}-500`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{campaign.name || campaign.title}</h4>
                    <p className="text-sm text-gray-600">
                      {campaign.participants?.length || 0} students • 
                      {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'TBD'} - 
                      {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${getStatusColor(campaign.status)}-100 text-${getStatusColor(campaign.status)}-800`}>
                      {campaign.status}
                    </span>
                    <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r from-${getStatusColor(campaign.status)}-500 to-${getStatusColor(campaign.status)}-600`}
                        style={{ width: `${getProgress(campaign)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{getProgress(campaign)}% complete</p>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Campaigns</h3>
                <p className="text-gray-500">Create your first campaign to get started</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Campaign Wizard Modal */}
        {showWizard && (
          <CampaignWizardEnhanced
            onClose={() => setShowWizard(false)}
            onSuccess={() => {
              setShowWizard(false);
              loadRecentCampaigns(); // Refresh campaigns after creation
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CSRCampaignWizard;
