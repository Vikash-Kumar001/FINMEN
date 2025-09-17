import { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  FileText,
  Users,
  GraduationCap,
  DollarSign,
  Building,
  Award,
  Clock,
  Target,
  Activity,
  Eye,
  RefreshCw,
  Settings,
  Search,
  ChevronDown,
} from "lucide-react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
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
} from "chart.js";
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

const ReportsDashboard = () => {
  const [activeReport, setActiveReport] = useState("academic");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: "2024",
    startDate: "",
    endDate: "",
    department: "",
    course: "",
  });
  // const [availableReports, setAvailableReports] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, [activeReport, filters, fetchReportData]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/${activeReport}?${queryParams}`);
      setReportData(response.data.report);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, [activeReport, filters]);

  const exportReport = async (format = "json") => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        reportType: activeReport,
        format,
      }).toString();

      const response = await api.get(`/api/reports/export?${queryParams}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${activeReport}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  const reportTypes = [
    {
      id: "academic",
      label: "Academic Report",
      icon: <GraduationCap className="w-5 h-5" />,
      description: "Student performance and academic statistics",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "financial",
      label: "Financial Report",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Fee collection and financial analytics",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "attendance",
      label: "Attendance Report",
      icon: <Users className="w-5 h-5" />,
      description: "Student attendance patterns and statistics",
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "placement",
      label: "Placement Report",
      icon: <Award className="w-5 h-5" />,
      description: "Placement statistics and company analytics",
      color: "from-orange-500 to-red-500",
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
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  changeType === "increase" ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm ${
                  changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </motion.div>
  );

  const renderAcademicReport = () => {
    if (!reportData) return null;

    const departmentData = {
      labels: Object.keys(reportData.departmentWiseDistribution || {}),
      datasets: [
        {
          label: "Total Students",
          data: Object.values(reportData.departmentWiseDistribution || {}).map(
            (dept) => dept.totalStudents
          ),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    };

    const cgpaData = {
      labels: ["Excellent (9+)", "Good (7.5-9)", "Average (6-7.5)", "Poor (<6)"],
      datasets: [
        {
          data: [
            reportData.cgpaAnalysis?.excellent || 0,
            reportData.cgpaAnalysis?.good || 0,
            reportData.cgpaAnalysis?.average || 0,
            reportData.cgpaAnalysis?.poor || 0,
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(251, 191, 36, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={reportData.totalStudents || 0}
            icon={<Users className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
            change="+12%"
            changeType="increase"
          />
          <StatCard
            title="Total Departments"
            value={reportData.totalDepartments || 0}
            icon={<Building className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Total Courses"
            value={reportData.totalCourses || 0}
            icon={<FileText className="w-6 h-6" />}
            color="from-purple-500 to-violet-500"
          />
          <StatCard
            title="Average CGPA"
            value={reportData.overallCGPA?.toFixed(2) || "0.00"}
            icon={<Award className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
            change="+0.3"
            changeType="increase"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Department-wise Student Distribution
            </h3>
            <Bar data={departmentData} options={{ responsive: true }} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              CGPA Distribution
            </h3>
            <Doughnut data={cgpaData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department-wise Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average CGPA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(reportData.departmentWiseDistribution || {}).map(
                  ([dept, data]) => (
                    <tr key={dept}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.totalCourses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.averageCGPA?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderFinancialReport = () => {
    if (!reportData) return null;

    const monthlyTrendData = {
      labels: Object.keys(reportData.monthlyTrend || {}),
      datasets: [
        {
          label: "Collection (₹)",
          data: Object.values(reportData.monthlyTrend || {}),
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const paymentModeData = {
      labels: Object.keys(reportData.paymentModeAnalysis || {}),
      datasets: [
        {
          data: Object.values(reportData.paymentModeAnalysis || {}),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(251, 191, 36, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Collection"
            value={`₹${(reportData.summary?.totalCollection || 0).toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
            change="+15%"
            changeType="increase"
          />
          <StatCard
            title="Total Transactions"
            value={reportData.summary?.totalTransactions || 0}
            icon={<Activity className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
            change="+8%"
            changeType="increase"
          />
          <StatCard
            title="Total Discount"
            value={`₹${(reportData.summary?.totalDiscount || 0).toLocaleString()}`}
            icon={<Target className="w-6 h-6" />}
            color="from-purple-500 to-violet-500"
          />
          <StatCard
            title="Net Collection"
            value={`₹${(reportData.summary?.netCollection || 0).toLocaleString()}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
            change="+12%"
            changeType="increase"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Collection Trend
            </h3>
            <Line data={monthlyTrendData} options={{ responsive: true }} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Mode Distribution
            </h3>
            <Pie data={paymentModeData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fee Type Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(reportData.feeTypeBreakdown || {}).map(
              ([type, amount]) => (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    ₹{amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {type.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAttendanceReport = () => {
    if (!reportData) return null;

    const attendanceData = {
      labels: Object.keys(reportData.departmentWiseAttendance || {}),
      datasets: [
        {
          label: "Average Attendance %",
          data: Object.values(reportData.departmentWiseAttendance || {}).map(
            (dept) => dept.averageAttendance
          ),
          backgroundColor: "rgba(147, 51, 234, 0.8)",
          borderColor: "rgba(147, 51, 234, 1)",
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={reportData.totalStudents || 0}
            icon={<Users className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Overall Attendance"
            value={`${reportData.overallAttendance?.toFixed(1) || 0}%`}
            icon={<Activity className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
            change="+2.5%"
            changeType="increase"
          />
          <StatCard
            title="Excellent (>95%)"
            value={Object.values(reportData.departmentWiseAttendance || {}).reduce(
              (sum, dept) => sum + dept.students.filter((s) => s.attendance > 95).length,
              0
            )}
            icon={<Award className="w-6 h-6" />}
            color="from-purple-500 to-violet-500"
          />
          <StatCard
            title="Poor (<75%)"
            value={Object.values(reportData.departmentWiseAttendance || {}).reduce(
              (sum, dept) => sum + dept.students.filter((s) => s.attendance < 75).length,
              0
            )}
            icon={<Clock className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department-wise Average Attendance
          </h3>
          <Bar data={attendanceData} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department-wise Attendance Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Excellent (&gt;95%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poor (&lt;75%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(reportData.departmentWiseAttendance || {}).map(
                  ([dept, data]) => (
                    <tr key={dept}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.averageAttendance?.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {data.students.filter((s) => s.attendance > 95).length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {data.students.filter((s) => s.attendance < 75).length}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPlacementReport = () => {
    if (!reportData) return null;

    const companyData = {
      labels: Object.keys(reportData.companyWiseStats || {}),
      datasets: [
        {
          label: "Selected Students",
          data: Object.values(reportData.companyWiseStats || {}).map(
            (company) => company.selected
          ),
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 2,
        },
      ],
    };

    const placementData = {
      labels: Object.keys(reportData.departmentWisePlacement || {}),
      datasets: [
        {
          label: "Placement %",
          data: Object.values(reportData.departmentWisePlacement || {}).map(
            (dept) => dept.placementPercentage
          ),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={reportData.summary?.totalApplications || 0}
            icon={<FileText className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
            change="+20%"
            changeType="increase"
          />
          <StatCard
            title="Placed Students"
            value={reportData.summary?.placedStudents || 0}
            icon={<Award className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
            change="+15%"
            changeType="increase"
          />
          <StatCard
            title="Placement Rate"
            value={`${reportData.summary?.placementPercentage?.toFixed(1) || 0}%`}
            icon={<Target className="w-6 h-6" />}
            color="from-purple-500 to-violet-500"
            change="+5%"
            changeType="increase"
          />
          <StatCard
            title="Average Package"
            value={`₹${reportData.summary?.averagePackage?.toFixed(1) || 0}L`}
            icon={<DollarSign className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
            change="+8%"
            changeType="increase"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company-wise Selections
            </h3>
            <Bar data={companyData} options={{ responsive: true }} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Department-wise Placement Rate
            </h3>
            <Bar data={placementData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department-wise Placement Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placement %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Package
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(reportData.departmentWisePlacement || {}).map(
                  ([dept, data]) => (
                    <tr key={dept}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.placed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.placementPercentage?.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{data.averagePackage?.toFixed(1) || 0}L
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case "academic":
        return renderAcademicReport();
      case "financial":
        return renderFinancialReport();
      case "attendance":
        return renderAttendanceReport();
      case "placement":
        return renderPlacementReport();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analytics and reporting system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => exportReport("csv")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => exportReport("json")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </button>
              <button
                onClick={fetchReportData}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((report) => (
              <motion.button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  activeReport === report.id
                    ? `border-blue-500 bg-gradient-to-r ${report.color} text-white shadow-lg`
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {report.icon}
                  <div className="text-left">
                    <div className="font-semibold">{report.label}</div>
                    <div
                      className={`text-sm ${
                        activeReport === report.id ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {report.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <select
                  value={filters.academicYear}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, academicYear: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, department: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() =>
                setFilters({
                  academicYear: "2024",
                  startDate: "",
                  endDate: "",
                  department: "",
                  course: "",
                })
              }
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Report Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderReportContent()
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;