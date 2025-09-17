import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  Plus,
  FileText,
  Award,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import api from "../../utils/api";
import { toast } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PlacementOfficerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchCompanies();
    fetchApplications();
    fetchStats();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/placement/dashboard");
      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/api/placement/companies");
      setCompanies(response.data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get("/api/placement/applications");
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/placement/stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Chart data
  const placementTrendData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Placement %',
        data: [78, 82, 75, 88, 92, 85],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average Package (LPA)',
        data: [4.5, 5.2, 4.8, 6.1, 7.2, 6.8],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const companyTypeData = {
    labels: ['Product', 'Service', 'Startup', 'MNC', 'Government'],
    datasets: [
      {
        data: [35, 25, 15, 20, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const departmentPlacementData = {
    labels: ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EEE'],
    datasets: [
      {
        label: 'Placement %',
        data: [95, 88, 75, 70, 92, 82],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  const quickActions = [
    {
      title: "Add Company",
      icon: <Building className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      action: () => setActiveTab("companies"),
    },
    {
      title: "Schedule Drive",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      action: () => setActiveTab("drives"),
    },
    {
      title: "View Applications",
      icon: <FileText className="w-6 h-6" />,
      color: "from-purple-500 to-violet-500",
      action: () => setActiveTab("applications"),
    },
    {
      title: "Generate Report",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      action: () => setActiveTab("reports"),
    },
  ];

  const statCards = [
    {
      title: "Total Companies",
      value: stats.totalCompanies || 0,
      icon: <Building className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Active Drives",
      value: stats.activeDrives || 0,
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Applications",
      value: stats.totalApplications || 0,
      icon: <FileText className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-r from-purple-500 to-violet-500",
      change: "+15%",
      changeType: "increase",
    },
    {
      title: "Placement Rate",
      value: `${stats.placementRate || 0}%`,
      icon: <Award className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      change: "+5%",
      changeType: "increase",
    },
  ];

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 mr-1 ${
                changeType === 'increase' ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className={`text-sm ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const CompanyCard = ({ company }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {company.companyName}
            </h3>
            <p className="text-sm text-gray-600">{company.industry}</p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{company.companySize}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-600">Package: </span>
            <span className="font-medium text-gray-900">
              ₹{company.packageDetails?.min || 0}L - ₹{company.packageDetails?.max || 0}L
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {company.contactInfo?.email && (
              <a
                href={`mailto:${company.contactInfo.email}`}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {company.contactInfo?.phone && (
              <a
                href={`tel:${company.contactInfo.phone}`}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ApplicationCard = ({ application }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={application.userId?.profilePicture || "/default-avatar.png"}
            alt={application.userId?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {application.userId?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {application.companyId?.companyName}
            </p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{application.overallStatus}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            application.overallStatus === 'Selected' 
              ? 'bg-green-100 text-green-800'
              : application.overallStatus === 'Rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {application.overallStatus}
          </span>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3">
                      {action.icon}
                      <span className="font-medium">{action.title}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Placement Trends
                </h3>
                <Line data={placementTrendData} options={{ responsive: true }} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Company Types
                </h3>
                <Doughnut data={companyTypeData} options={{ responsive: true }} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Department-wise Placement
              </h3>
              <Bar data={departmentPlacementData} options={{ responsive: true }} />
            </div>
          </div>
        );

      case "companies":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>
          </div>
        );

      case "applications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map((application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Placement Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive placement statistics and analytics
                </p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Report
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Company Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Company-wise hiring statistics and trends
                </p>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Generate Report
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Student Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Student-wise application and placement status
                </p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Placement Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage placements and track student progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "companies", label: "Companies", icon: <Building className="w-4 h-4" /> },
              { id: "applications", label: "Applications", icon: <FileText className="w-4 h-4" /> },
              { id: "reports", label: "Reports", icon: <PieChart className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PlacementOfficerDashboard;