import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  RefreshCw,
  Download,
  Mail,
  Phone,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye,
  Bell,
  Shield,
  Database,
  Wifi,
  ChevronDown,
  MoreHorizontal,
  Check,
  X,
  User,
  CreditCard,
  Activity,
} from "lucide-react";

const RedemptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [refreshing, setRefreshing] = useState(false);

  // Simulated socket context (replace with actual implementation)
  const socket = {
    emit: (event, data) => console.log("Socket emit:", event, data),
    on: (event, callback) => console.log("Socket on:", event),
    off: (event) => console.log("Socket off:", event),
  };

  const user = { _id: "user123" }; // Replace with actual user context

  useEffect(() => {
    if (socket && socket.socket && user) {
      try {
        socket.socket.emit("student:redemption:subscribe", { studentId: user._id });

        socket.socket.on("student:redemption:data", (data) => {
          setRequests(data || []);
          setLoading(false);
        });

        socket.socket.on("student:redemption:update", (data) => {
          setRequests(data || []);
        });

        socket.socket.on("student:redemption:approved", (data) => {
          showToast(`Redemption approved for ₹${data.amount}`, "success");
        });

        socket.socket.on("student:redemption:rejected", (data) => {
          showToast(`Redemption rejected for ₹${data.amount}`, "error");
        });

        return () => {
          try {
            if (socket && socket.socket) {
              socket.socket.off("student:redemption:data");
              socket.socket.off("student:redemption:update");
              socket.socket.off("student:redemption:approved");
              socket.socket.off("student:redemption:rejected");
            }
          } catch (err) {
            console.error("❌ Error removing redemption listeners:", err.message);
          }
        };
      } catch (err) {
        console.error("❌ Error setting up redemption listeners:", err.message);
        setLoading(false);
      }
    }
  }, [socket, user]);

  const showToast = (message, type) => {
    // Replace with actual toast implementation
    console.log(`Toast: ${message} (${type})`);
  };

  const handleApprove = (id) => {
    socket.socket.emit("student:redemption:approve", {
      studentId: user._id,
      requestId: id,
    });
    setConfirmId(null);
  };

  const handleReject = (id) => {
    socket.socket.emit("student:redemption:reject", {
      studentId: user._id,
      requestId: id,
    });
    setRejectId(null);
  };

  const handleBulkAction = (action) => {
    selectedRequests.forEach((id) => {
      if (action === "approve") {
        handleApprove(id);
      } else if (action === "reject") {
        handleReject(id);
      }
    });
    setSelectedRequests([]);
    setShowBulkActions(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (socket && socket.socket) {
      try {
        socket.socket.emit("student:redemption:subscribe", { studentId: user._id });
      } catch (err) {
        console.error("❌ Error refreshing redemption requests:", err.message);
      }
    } else {
      console.error("❌ Socket not available for refreshing redemption requests");
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      req.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.upiId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "amount-high":
        return b.amount - a.amount;
      case "amount-low":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "from-yellow-400 to-orange-400";
      case "approved":
        return "from-green-400 to-emerald-400";
      case "rejected":
        return "from-red-400 to-rose-400";
      default:
        return "from-gray-400 to-slate-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center items-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="text-xl font-semibold text-gray-800">
              Loading redemption requests...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative inline-block"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <h1 className="text-4xl sm:text-5xl font-black flex items-center gap-3">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                    Redemption Management
                  </span>
                  <span className="text-4xl">💸</span>
                </h1>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">Export</span>
              </motion.button>
            </div>
          </div>

          <motion.p
            className="text-gray-600 text-lg font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Monitor and manage student redemption requests with advanced
            analytics ✨
          </motion.p>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    Real-time Updates Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Secure</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Total Requests: {requests.length}
                </div>
                <div className="text-sm text-gray-600">
                  Pending:{" "}
                  {requests.filter((r) => r.status === "pending").length}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or UPI ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount-high">Amount: High to Low</option>
                    <option value="amount-low">Amount: Low to High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {selectedRequests.length} request
                      {selectedRequests.length > 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBulkAction("approve")}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
                    >
                      Approve All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBulkAction("reject")}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors"
                    >
                      Reject All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRequests([])}
                      className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl transition-colors"
                    >
                      Clear
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Requests Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden"
        >
          {sortedRequests.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No redemption requests found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "New redemption requests will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedRequests.length ===
                          sortedRequests.filter((r) => r.status === "pending")
                            .length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRequests(
                              sortedRequests
                                .filter((r) => r.status === "pending")
                                .map((r) => r._id)
                            );
                          } else {
                            setSelectedRequests([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="p-4 text-left font-semibold">Student</th>
                    <th className="p-4 text-left font-semibold">Amount</th>
                    <th className="p-4 text-left font-semibold">UPI ID</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRequests.map((req, index) => (
                    <motion.tr
                      key={req._id}
                      variants={itemVariants}
                      className="border-t border-gray-100 hover:bg-white/60 transition-all duration-200"
                    >
                      <td className="p-4">
                        {req.status === "pending" && (
                          <input
                            type="checkbox"
                            checked={selectedRequests.includes(req._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRequests([
                                  ...selectedRequests,
                                  req._id,
                                ]);
                              } else {
                                setSelectedRequests(
                                  selectedRequests.filter(
                                    (id) => id !== req._id
                                  )
                                );
                              }
                            }}
                            className="rounded"
                          />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {req.user?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {req.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-xl font-bold text-gray-800">
                            ₹{req.amount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span className="font-mono text-gray-700">
                            {req.upiId}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white font-semibold bg-gradient-to-r ${getStatusColor(
                            req.status
                          )}`}
                        >
                          {getStatusIcon(req.status)}
                          <span className="capitalize">{req.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            {new Date(
                              req.createdAt || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {req.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setConfirmId(req._id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setRejectId(req._id)}
                              className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </motion.button>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            {req.status === "approved"
                              ? "Processed"
                              : "Declined"}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Confirm Approve Modal */}
        <AnimatePresence>
          {confirmId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Approval
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to approve this redemption request?
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConfirmId(null)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(confirmId)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      Approve
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Reject Modal */}
        <AnimatePresence>
          {rejectId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Rejection
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to reject this redemption request?
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRejectId(null)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(rejectId)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      Reject
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RedemptionRequests;
