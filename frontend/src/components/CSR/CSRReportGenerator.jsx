import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Share2, Eye, Calendar, Settings,
  BarChart3, Users, Award, DollarSign, Brain, CheckCircle,
  Clock, AlertCircle, RefreshCw, Filter, Plus, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import csrReportService from '../../services/csrReportService';

const CSRReportGenerator = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState({
    reportType: 'quarterly',
    reportName: '',
    startDate: '',
    endDate: '',
    campaignIds: [],
    branding: {
      logoUrl: '',
      primaryColor: '#8B5CF6',
      secondaryColor: '#10B981',
      fontFamily: 'Helvetica'
    },
    includeTestimonials: true
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await csrReportService.getReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await csrReportService.generateReport(reportData);
      toast.success('Report generation started! You will be notified when ready.');
      onSuccess(response.data);
      onClose();
    } catch (error) {
      toast.error('Failed to generate report');
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      await csrReportService.downloadReportPDF(reportId);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleShareReport = async (reportId) => {
    const email = prompt('Enter email to share with:');
    if (email) {
      try {
        await csrReportService.shareReport(reportId, { email, role: 'viewer' });
        toast.success('Report shared successfully');
      } catch (error) {
        toast.error('Failed to share report');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ReportTypeStep data={reportData} updateData={setReportData} />;
      case 2:
        return <ReportPeriodStep data={reportData} updateData={setReportData} />;
      case 3:
        return <ReportContentStep data={reportData} updateData={setReportData} />;
      case 4:
        return <ReportBrandingStep data={reportData} updateData={setReportData} />;
      case 5:
        return <ReportReviewStep data={reportData} onSubmit={handleGenerateReport} loading={loading} />;
      default:
        return null;
    }
  };

  if (selectedReport) {
    return (
      <ReportPreview
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onDownload={handleDownloadReport}
        onShare={handleShareReport}
      />
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">CSR Report Generator</h2>
              <p className="text-gray-600">Generate comprehensive branded PDF reports</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step <= currentStep ? 'bg-purple-500 border-purple-500 text-white' : 'border-gray-300 text-gray-400'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 5 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      step < currentStep ? 'bg-purple-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Step 1: Report Type
const ReportTypeStep = ({ data, updateData }) => {
  const reportTypes = [
    { value: 'quarterly', label: 'Quarterly Report', icon: Calendar, description: 'Q1, Q2, Q3, Q4 reports' },
    { value: 'annual', label: 'Annual Report', icon: FileText, description: 'Year-end comprehensive report' },
    { value: 'campaign', label: 'Campaign Report', icon: BarChart3, description: 'Specific campaign analysis' },
    { value: 'custom', label: 'Custom Report', icon: Settings, description: 'Custom date range report' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Report Type</h3>
        <p className="text-gray-600 mb-6">Choose the type of CSR report you want to generate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.value}
              onClick={() => updateData({ ...data, reportType: type.value })}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                data.reportType === type.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  data.reportType === type.value ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    data.reportType === type.value ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{type.label}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
        <input
          type="text"
          value={data.reportName}
          onChange={(e) => updateData({ ...data, reportName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter custom report name"
        />
      </div>
    </div>
  );
};

// Step 2: Report Period
const ReportPeriodStep = ({ data, updateData }) => {
  const getDefaultDates = (reportType) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    switch (reportType) {
      case 'quarterly':
        const quarter = Math.floor(currentMonth / 3);
        const quarterStart = new Date(currentYear, quarter * 3, 1);
        const quarterEnd = new Date(currentYear, quarter * 3 + 3, 0);
        return {
          startDate: quarterStart.toISOString().split('T')[0],
          endDate: quarterEnd.toISOString().split('T')[0]
        };
      case 'annual':
        return {
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`
        };
      default:
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0]
        };
    }
  };

  useEffect(() => {
    if (!data.startDate || !data.endDate) {
      const dates = getDefaultDates(data.reportType);
      updateData({ ...data, ...dates });
    }
  }, [data.reportType]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Report Period</h3>
        <p className="text-gray-600 mb-6">Select the time period for your CSR report.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => updateData({ ...data, startDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => updateData({ ...data, endDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Report Duration</h4>
            <p className="text-sm text-blue-700">
              {data.startDate && data.endDate && (
                <>
                  This report will cover {Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24))} days
                  from {new Date(data.startDate).toLocaleDateString()} to {new Date(data.endDate).toLocaleDateString()}.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Report Content
const ReportContentStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Report Content</h3>
        <p className="text-gray-600 mb-6">Select what to include in your CSR report.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-gray-800">Schools & Students Reached</h4>
              <p className="text-sm text-gray-600">Coverage metrics and demographics</p>
            </div>
          </div>
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-gray-800">Completion Rates</h4>
              <p className="text-sm text-gray-600">Student completion statistics</p>
            </div>
          </div>
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-gray-800">Learning Improvements</h4>
              <p className="text-sm text-gray-600">Academic progress and skill development</p>
            </div>
          </div>
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-gray-800">Certificates Issued</h4>
              <p className="text-sm text-gray-600">Achievement and completion certificates</p>
            </div>
          </div>
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-gray-800">Financial Metrics</h4>
              <p className="text-sm text-gray-600">Spend per student and budget analysis</p>
            </div>
          </div>
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-gray-800">NEP Competency Mapping</h4>
              <p className="text-sm text-gray-600">National Education Policy alignment</p>
            </div>
          </div>
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-purple-600" />
          <div>
            <h4 className="font-medium text-gray-800">Testimonials</h4>
            <p className="text-sm text-gray-600">Include quotes from teachers and students</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={data.includeTestimonials}
            onChange={(e) => updateData({ ...data, includeTestimonials: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>
    </div>
  );
};

// Step 4: Report Branding
const ReportBrandingStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Report Branding</h3>
        <p className="text-gray-600 mb-6">Customize the visual appearance of your report.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
          <input
            type="url"
            value={data.branding.logoUrl}
            onChange={(e) => updateData({ 
              ...data, 
              branding: { ...data.branding, logoUrl: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={data.branding.fontFamily}
            onChange={(e) => updateData({ 
              ...data, 
              branding: { ...data.branding, fontFamily: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Arial">Arial</option>
            <option value="Times">Times New Roman</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <input
            type="color"
            value={data.branding.primaryColor}
            onChange={(e) => updateData({ 
              ...data, 
              branding: { ...data.branding, primaryColor: e.target.value }
            })}
            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
          <input
            type="color"
            value={data.branding.secondaryColor}
            onChange={(e) => updateData({ 
              ...data, 
              branding: { ...data.branding, secondaryColor: e.target.value }
            })}
            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Preview</h4>
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: data.branding.primaryColor }}
          >
            LOGO
          </div>
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: data.branding.primaryColor }}
            >
              CSR Impact Report
            </div>
            <div 
              className="text-sm"
              style={{ color: data.branding.secondaryColor }}
            >
              Sample subtitle text
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Review and Generate
const ReportReviewStep = ({ data, onSubmit, loading }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Report Settings</h3>
        <p className="text-gray-600 mb-6">Review your report configuration before generating.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Report Type</label>
            <p className="text-gray-800 capitalize">{data.reportType} Report</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Report Name</label>
            <p className="text-gray-800">{data.reportName || `${data.reportType} CSR Report`}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Start Date</label>
            <p className="text-gray-800">{new Date(data.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">End Date</label>
            <p className="text-gray-800">{new Date(data.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Include Testimonials</label>
            <p className="text-gray-800">{data.includeTestimonials ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Primary Color</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: data.branding.primaryColor }}
              ></div>
              <span className="text-gray-800">{data.branding.primaryColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 mb-1">Ready to Generate</h4>
            <p className="text-sm text-green-700">
              Your CSR report will be generated as a branded PDF with all the selected metrics and content. 
              The generation process typically takes 2-3 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Report Preview Component
const ReportPreview = ({ report, onClose, onDownload, onShare }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{report.reportName}</h2>
            <p className="text-gray-600">Report ID: {report.reportId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Status</h4>
                <p className="text-blue-600 capitalize">{report.status}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Generated</h4>
                <p className="text-green-600">
                  {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : 'Not yet'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Downloads</h4>
                <p className="text-purple-600">{report.sharing?.downloadCount || 0}</p>
              </div>
            </div>

            {report.files?.pdfUrl && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF Ready</h3>
                <p className="text-gray-600 mb-4">Your branded CSR report is ready for download</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onDownload(report.reportId)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => onShare(report.reportId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            )}

            {report.status === 'generating' && (
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating Report</h3>
                <p className="text-gray-600 mb-4">Your report is being generated. This usually takes 2-3 minutes.</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CSRReportGenerator;
