import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, Shield, Award, Globe, Camera, Upload,
  Download, Eye, Edit, Plus, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import CobrandingLegalComponent from '../../components/CSR/CobrandingLegalComponent';
import cobrandingLegalService from '../../services/cobrandingLegalService';

const CSRCobranding = () => {
  const [legalStats, setLegalStats] = useState({
    activePartnerships: 0,
    legalDocuments: 0,
    brandAssets: 0,
    compliance: 0
  });
  const [loading, setLoading] = useState(true);

  // Load legal statistics
  const loadLegalStats = async () => {
    setLoading(true);
    try {
      const response = await cobrandingLegalService.getComplianceDashboard();
      const data = response.data;
      
      setLegalStats({
        activePartnerships: data.totalPartnerships || 0,
        legalDocuments: data.compliantPartnerships || 0,
        brandAssets: data.partnershipsByStatus?.active || 0,
        compliance: Math.round(data.complianceRate || 0)
      });
    } catch (error) {
      console.error('Error loading legal stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLegalStats();
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
                className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
              >
                Co-branding & Legal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <Users className="w-5 h-5 text-amber-500" />
                Manage co-branding assets, legal documents, and partnership agreements
              </motion.p>
            </div>
          </div>

          {/* Legal Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Active Partnerships',
                value: loading ? '...' : legalStats.activePartnerships.toString(),
                change: '+3 this quarter',
                icon: Users,
                color: 'from-amber-500 to-yellow-500',
                bgColor: 'from-amber-50 to-yellow-50',
                borderColor: 'border-amber-200'
              },
              {
                title: 'Legal Documents',
                value: loading ? '...' : legalStats.legalDocuments.toString(),
                change: 'All up to date',
                icon: FileText,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Brand Assets',
                value: loading ? '...' : legalStats.brandAssets.toString(),
                change: '+12 new',
                icon: Camera,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200'
              },
              {
                title: 'Compliance',
                value: loading ? '...' : `${legalStats.compliance}%`,
                change: 'Excellent',
                icon: Shield,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
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

        {/* Legal Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-500" />
            Legal Document Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Partnership Agreements',
                description: 'CSR partnership contracts and MOUs',
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
                count: '15 documents',
                status: 'Active'
              },
              {
                title: 'Brand Guidelines',
                description: 'Co-branding rules and asset usage',
                icon: Award,
                color: 'from-purple-500 to-pink-500',
                count: '8 guidelines',
                status: 'Updated'
              },
              {
                title: 'Compliance Reports',
                description: 'Legal compliance and audit reports',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500',
                count: '12 reports',
                status: 'Current'
              }
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${category.color}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{category.title}</h4>
                      <p className="text-sm text-gray-600">{category.count}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : category.status === 'Updated'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Brand Assets Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Camera className="w-8 h-8 text-purple-500" />
            Brand Assets Library
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Logos',
                count: '24',
                description: 'CSR partner logos and variations',
                icon: Award,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Banners',
                count: '18',
                description: 'Marketing banners and headers',
                icon: Globe,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Templates',
                count: '32',
                description: 'Report and document templates',
                icon: FileText,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Media',
                count: '54',
                description: 'Images, videos, and graphics',
                icon: Camera,
                color: 'from-orange-500 to-red-500'
              }
            ].map((asset, index) => {
              const Icon = asset.icon;
              return (
                <motion.div
                  key={asset.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${asset.color} w-fit mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">{asset.title}</h4>
                  <p className="text-2xl font-bold text-gray-600 mb-2">{asset.count}</p>
                  <p className="text-gray-600 text-sm">{asset.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Co-branding Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <CobrandingLegalComponent
            onViewPartnership={() => {
              // Handle view partnership logic
            }}
            onEditPartnership={() => {
              // Handle edit partnership logic
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CSRCobranding;
