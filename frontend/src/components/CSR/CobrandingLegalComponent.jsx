import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Users, FileText, Calendar, AlertCircle, CheckCircle,
  Clock, Edit, Eye, Download, Share, Filter, Search,
  Building, Handshake, Shield, Award, TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import cobrandingLegalService from '../../services/cobrandingLegalService';

const CobrandingLegalComponent = ({ onViewPartnership, onCreatePartnership, onEditPartnership }) => {
  const [partnerships, setPartnerships] = useState([]);
  const [complianceDashboard, setComplianceDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    partnerType: '',
    contractStatus: '',
    page: 1,
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('partnerships');

  // Load partnerships
  const loadPartnerships = async () => {
    setLoading(true);
    try {
      const response = await cobrandingLegalService.getCobrandingPartnerships(filters);
      setPartnerships(response.data);
    } catch (error) {
      console.error('Error loading partnerships:', error);
      toast.error('Failed to load partnerships');
    } finally {
      setLoading(false);
    }
  };

  // Load compliance dashboard
  const loadComplianceDashboard = async () => {
    try {
      const response = await cobrandingLegalService.getComplianceDashboard();
      setComplianceDashboard(response.data);
    } catch (error) {
      console.error('Error loading compliance dashboard:', error);
    }
  };

  useEffect(() => {
    loadPartnerships();
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'compliance') {
      loadComplianceDashboard();
    }
  }, [activeTab]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      'active': { color: 'green', icon: CheckCircle, label: 'Active' },
      'inactive': { color: 'gray', icon: Clock, label: 'Inactive' },
      'suspended': { color: 'yellow', icon: AlertCircle, label: 'Suspended' },
      'terminated': { color: 'red', icon: AlertCircle, label: 'Terminated' },
      'expired': { color: 'orange', icon: Clock, label: 'Expired' }
    };
    return statusMap[status] || statusMap['active'];
  };

  // Get contract status color
  const getContractStatusColor = (status) => {
    const colorMap = {
      'draft': 'gray',
      'under_review': 'yellow',
      'negotiating': 'blue',
      'signed': 'green',
      'active': 'green',
      'expired': 'orange',
      'terminated': 'red',
      'renewed': 'purple'
    };
    return colorMap[status] || 'gray';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get days until expiry
  const getDaysUntilExpiry = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const tabs = [
    { id: 'partnerships', label: 'Partnerships', icon: Handshake },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'assets', label: 'Brand Assets', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Co-branding & Legal Management</h2>
          <p className="text-gray-600">Manage partnerships, contracts, and brand assets</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreatePartnership}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          New Partnership
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'partnerships' && (
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search partnerships..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filters.partnerType}
                    onChange={(e) => setFilters({ ...filters, partnerType: e.target.value, page: 1 })}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Types</option>
                    <option value="corporate">Corporate</option>
                    <option value="ngo">NGO</option>
                    <option value="educational_institution">Educational Institution</option>
                    <option value="government">Government</option>
                  </select>

                  <select
                    value={filters.contractStatus}
                    onChange={(e) => setFilters({ ...filters, contractStatus: e.target.value, page: 1 })}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Contract Status</option>
                    <option value="draft">Draft</option>
                    <option value="signed">Signed</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                  </select>

                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              {/* Partnerships List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  partnerships.map((partnership, index) => {
                    const statusInfo = getStatusInfo(partnership.status);
                    const StatusIcon = statusInfo.icon;
                    const daysUntilExpiry = getDaysUntilExpiry(partnership.contractInfo?.endDate);

                    return (
                      <motion.div
                        key={partnership._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                                <Building className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{partnership.partnerName}</h3>
                                <p className="text-gray-600 capitalize">{partnership.partnerType.replace('_', ' ')}</p>
                              </div>
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                                <StatusIcon className="w-4 h-4" />
                                {statusInfo.label}
                              </div>
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-${getContractStatusColor(partnership.contractInfo?.contractStatus)}-100 text-${getContractStatusColor(partnership.contractInfo?.contractStatus)}-800`}>
                                {partnership.contractInfo?.contractStatus?.replace('_', ' ')}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-gray-600 mb-1">Partnership Type</div>
                                <div className="font-medium capitalize">{partnership.partnershipDetails?.partnershipType?.replace('_', ' ')}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 mb-1">Contract Period</div>
                                <div className="font-medium">
                                  {formatDate(partnership.contractInfo?.startDate)} - {formatDate(partnership.contractInfo?.endDate)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 mb-1">Contract Value</div>
                                <div className="font-medium">
                                  ₹{partnership.contractInfo?.contractValue?.amount?.toLocaleString() || 0}
                                </div>
                              </div>
                            </div>

                            {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-orange-800">
                                  <AlertCircle className="w-4 h-4" />
                                  <span className="font-medium">
                                    Contract expires in {daysUntilExpiry} days
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{partnership.associatedCampaigns?.length || 0} campaigns</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{partnership.legalCompliance?.legalDocuments?.length || 0} documents</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                <span>{partnership.brandAssets?.assetLibrary?.length || 0} assets</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onViewPartnership(partnership)}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEditPartnership(partnership)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Partnership"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="View Metrics"
                            >
                              <TrendingUp className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {complianceDashboard && (
                <>
                  {/* Compliance Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-4">
                        <Building className="w-8 h-8 text-blue-500" />
                        <div className="text-sm text-blue-600 font-medium">Total Partnerships</div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {complianceDashboard.totalPartnerships}
                      </div>
                      <div className="text-gray-600 text-sm">Active partnerships</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                      <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div className="text-sm text-green-600 font-medium">Compliant</div>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {complianceDashboard.compliantPartnerships}
                      </div>
                      <div className="text-gray-600 text-sm">{complianceDashboard.complianceRate.toFixed(1)}% rate</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                      <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-orange-500" />
                        <div className="text-sm text-orange-600 font-medium">Expiring Soon</div>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {complianceDashboard.expiringContracts}
                      </div>
                      <div className="text-gray-600 text-sm">Within 30 days</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <div className="text-sm text-red-600 font-medium">Overdue Reviews</div>
                      </div>
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {complianceDashboard.overdueReviews}
                      </div>
                      <div className="text-gray-600 text-sm">Require attention</div>
                    </div>
                  </div>

                  {/* Partnership Status Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-500" />
                        Partnership Status
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(complianceDashboard.partnershipsByStatus).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <span className="capitalize text-gray-600">{status}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Partnership Types
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(complianceDashboard.partnershipsByType).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="capitalize text-gray-600">{type.replace('_', ' ')}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Brand Assets Management</h3>
                <p className="text-gray-500">Brand assets will be managed within individual partnerships</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CobrandingLegalComponent;
