import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Share2, Star, Users, CheckCircle, TrendingUp,
  Award, BookOpen, DollarSign, Calendar, Eye, Edit, Plus
} from 'lucide-react';
import CSRReportGenerator from '../../components/CSR/CSRReportGenerator';
import csrReportService from '../../services/csrReportService';

const CSRReports = () => {
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [reportMetrics, setReportMetrics] = useState({
    schoolsReached: 0,
    studentsReached: 0,
    completionRate: 0,
    learningImprovement: 0,
    certificatesIssued: 0,
    spendPerStudent: 0,
    nepAlignment: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load report metrics and recent reports
  const loadReportData = async () => {
    setLoading(true);
    try {
      const [reports, kpiData] = await Promise.all([
        csrReportService.getReports({ limit: 4 }),
        // We can use the CSR KPI data for metrics
        fetch('/api/csr-kpis/kpis?period=month&region=all').then(res => res.json())
      ]);

      setRecentReports(reports.data || []);

      if (kpiData.success && kpiData.data) {
        const data = kpiData.data;
        setReportMetrics({
          schoolsReached: data.schoolsReached?.totalSchools || 0,
          studentsReached: data.studentsReached?.totalStudents || 0,
          completionRate: data.campaigns?.length > 0 
            ? Math.round(data.campaigns.reduce((sum, c) => sum + (c.completionRate || 0), 0) / data.campaigns.length)
            : 0,
          learningImprovement: data.engagementMetrics?.engagementLift || 0,
          certificatesIssued: data.certificates?.totalIssued || 0,
          spendPerStudent: data.budgetMetrics?.totalBudget && data.studentsReached?.totalStudents
            ? Math.round(data.budgetMetrics.totalBudget / data.studentsReached.totalStudents)
            : 0,
          nepAlignment: data.nepCompetencies?.alignmentScore || 0
        });
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
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
                className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                CSR Reports
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <FileText className="w-5 h-5 text-purple-500" />
                Generate comprehensive branded PDF reports with all CSR metrics and insights
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReportGenerator(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-2xl transition-all font-semibold text-lg"
            >
              <Plus className="w-6 h-6" />
              Generate Report
            </motion.button>
          </div>
        </motion.div>

        {/* Report Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {[
            {
              title: 'Schools & Students Reached',
              description: 'Coverage metrics and demographics',
              icon: Users,
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'from-blue-50 to-cyan-50',
              borderColor: 'border-blue-200',
              value: loading ? '...' : `${reportMetrics.schoolsReached} schools`,
              students: loading ? '...' : `${(reportMetrics.studentsReached / 1000).toFixed(1)}K students`
            },
            {
              title: 'Completion Rates',
              description: 'Student completion statistics',
              icon: CheckCircle,
              color: 'from-green-500 to-emerald-500',
              bgColor: 'from-green-50 to-emerald-50',
              borderColor: 'border-green-200',
              value: loading ? '...' : `${reportMetrics.completionRate}% avg`,
              students: 'Across all modules'
            },
            {
              title: 'Learning Improvements',
              description: 'Academic progress and skill development',
              icon: TrendingUp,
              color: 'from-purple-500 to-pink-500',
              bgColor: 'from-purple-50 to-pink-50',
              borderColor: 'border-purple-200',
              value: loading ? '...' : `${reportMetrics.learningImprovement}% avg`,
              students: 'Skill improvement'
            },
            {
              title: 'Certificates Issued',
              description: 'Achievement and completion certificates',
              icon: Award,
              color: 'from-yellow-500 to-orange-500',
              bgColor: 'from-yellow-50 to-orange-50',
              borderColor: 'border-yellow-200',
              value: loading ? '...' : `${(reportMetrics.certificatesIssued / 1000).toFixed(1)}K`,
              students: 'Certificates'
            },
            {
              title: 'Spend per Student',
              description: 'Financial efficiency metrics',
              icon: DollarSign,
              color: 'from-red-500 to-pink-500',
              bgColor: 'from-red-50 to-pink-50',
              borderColor: 'border-red-200',
              value: loading ? '...' : `₹${reportMetrics.spendPerStudent}`,
              students: 'Per student'
            },
            {
              title: 'NEP Mapping',
              description: 'National Education Policy alignment',
              icon: BookOpen,
              color: 'from-indigo-500 to-blue-500',
              bgColor: 'from-indigo-50 to-blue-50',
              borderColor: 'border-indigo-200',
              value: loading ? '...' : `${reportMetrics.nepAlignment}%`,
              students: 'NEP aligned'
            }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 bg-gradient-to-br ${metric.bgColor} border-2 ${metric.borderColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${metric.color} w-fit mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">{metric.title}</h4>
                <p className="text-gray-600 font-medium mb-4">{metric.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Value:</span>
                    <span className="text-sm font-semibold text-gray-800">{metric.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scope:</span>
                    <span className="text-sm font-semibold text-gray-800">{metric.students}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Report Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            Report Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Branded PDF with CSR logo and custom colors',
              'Executive summary with key highlights',
              'Comprehensive metrics and visualizations',
              'NEP competency mapping and alignment',
              'Financial analysis and cost efficiency',
              'Testimonials and success stories',
              'Recommendations and next steps',
              'Interactive charts and graphs'
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-3 text-gray-700 font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            Recent Reports
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading recent reports...</p>
              </div>
            ) : recentReports.length > 0 ? recentReports.map((report, index) => (
              <motion.div
                key={report._id || report.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800">{report.name || report.title}</h4>
                  <p className="text-sm text-gray-600">
                    {report.type || 'Report'} • 
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown date'} • 
                    {report.fileSize || 'Unknown size'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    report.status === 'completed' || report.status === 'Generated'
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-purple-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Reports</h3>
                <p className="text-gray-500">Generate your first report to get started</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Report Generator Modal */}
        {showReportGenerator && (
          <CSRReportGenerator
            onClose={() => setShowReportGenerator(false)}
            onSuccess={() => {
              setShowReportGenerator(false);
              loadReportData(); // Refresh reports after generation
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CSRReports;
