import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import {
    Users,
    GraduationCap,
    ShoppingBag,
    Building,
    Heart,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Mail,
    Calendar,
    User,
    Briefcase,
    School,
    Filter,
    RefreshCw
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const PendingApprovals = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("all");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionType, setActionType] = useState("");
    const socket = useSocket();
    const { user } = useAuth();

    const roleConfig = {
        parent: {
            icon: <Heart className="w-5 h-5" />,
            color: "from-pink-500 to-rose-500",
            bgColor: "bg-pink-50",
            textColor: "text-pink-700",
            borderColor: "border-pink-200",
            label: "Parent"
        },
        seller: {
            icon: <ShoppingBag className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700",
            borderColor: "border-green-200",
            label: "Seller"
        },
        csr: {
            icon: <Building className="w-5 h-5" />,
            color: "from-purple-500 to-violet-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            label: "CSR"
        }
    };

    // Fetch all pending users
    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/admin/pending-approvals");
            setPendingUsers(response.data.users || []);
        } catch (error) {
            console.error("Error fetching pending users:", error);
            toast.error("Failed to fetch pending approvals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    // Filter users by role
    useEffect(() => {
        if (selectedRole === "all") {
            setFilteredUsers(pendingUsers);
        } else {
            setFilteredUsers(pendingUsers.filter(user => user.role === selectedRole));
        }
        setCurrentPage(1);
    }, [pendingUsers, selectedRole]);

    // Socket real-time updates
    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                socket.socket.emit("admin:join", { adminId: user._id });

                // Listen for new registrations
                socket.socket.on("stakeholder:registered", (data) => {
                    setPendingUsers((prev) => [data.user, ...prev]);
                    toast.info(`New ${data.user.role} registration: ${data.user.name}`);
                });

                // Listen for approvals
                socket.socket.on("stakeholder:approved", (data) => {
                    setPendingUsers((prev) => prev.filter((u) => u._id !== data.user._id));
                    toast.success(`${data.user.role} ${data.user.name} approved`);
                });

                // Listen for rejections
                socket.socket.on("stakeholder:rejected", (data) => {
                    setPendingUsers((prev) => prev.filter((u) => u._id !== data.user._id));
                    toast.info(`${data.user.role} ${data.user.name} rejected`);
                });

                return () => {
                    try {
                        if (socket && socket.socket) {
                            socket.socket.off("stakeholder:registered");
                            socket.socket.off("stakeholder:approved");
                            socket.socket.off("stakeholder:rejected");
                        }
                    } catch (err) {
                        console.error("❌ Error removing stakeholder listeners:", err.message);
                    }
                };
            } catch (err) {
                console.error("❌ Error setting up stakeholder listeners:", err.message);
            }
        }
    }, [socket, user]);

    const handleApprove = async (userId) => {
        try {
            const response = await api.put(`/api/admin/approve-stakeholder/${userId}`);
            if (response.data.message) {
                toast.success(response.data.message);
                setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
                
                if (socket && socket.socket) {
                    socket.socket.emit("admin:stakeholder:approved", {
                        userId: userId,
                        adminId: user._id,
                    });
                }
            }
        } catch (error) {
            console.error("Error approving user:", error);
            toast.error(error.response?.data?.message || "Failed to approve user");
        }
        setShowConfirmModal(false);
        setSelectedUser(null);
    };

    const handleReject = async (userId, reason) => {
        try {
            const response = await api.put(`/api/admin/reject-stakeholder/${userId}`, {
                reason: reason || "No reason provided",
            });

            if (response.data.message) {
                toast.success(response.data.message);
                setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
                
                if (socket && socket.socket) {
                    socket.socket.emit("admin:stakeholder:rejected", {
                        userId: userId,
                        adminId: user._id,
                        reason: reason,
                    });
                }
            }
        } catch (error) {
            console.error("Error rejecting user:", error);
            toast.error(error.response?.data?.message || "Failed to reject user");
        }
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedUser(null);
    };

    const openConfirmModal = (user, action) => {
        setSelectedUser(user);
        setActionType(action);
        if (action === "approve") {
            setShowConfirmModal(true);
        } else {
            setShowRejectModal(true);
        }
    };

    const renderUserDetails = (user) => {
        const config = roleConfig[user.role];
        
        return (
            <div className="space-y-2">
                
                {user.role === "parent" && user.childEmail && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <strong>Child Email:</strong> {user.childEmail}
                    </p>
                )}
                
                {user.role === "seller" && (
                    <>
                        {user.businessName && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                <strong>Business:</strong> {user.businessName}
                            </p>
                        )}
                        {user.shopType && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                <strong>Shop Type:</strong> {user.shopType}
                            </p>
                        )}
                    </>
                )}
                
                {user.role === "csr" && user.organization && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <strong>Organization:</strong> {user.organization}
                    </p>
                )}
            </div>
        );
    };

    const paginated = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const roleStats = {
        all: pendingUsers.length,
        parent: pendingUsers.filter(u => u.role === "parent").length,
        seller: pendingUsers.filter(u => u.role === "seller").length,
        csr: pendingUsers.filter(u => u.role === "csr").length,
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-indigo-600" />
                        Pending Approvals
                    </h2>
                    <p className="text-gray-600 mt-1">Review and approve stakeholder registrations</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchPendingUsers}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedRole("all")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                        selectedRole === "all"
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{roleStats.all}</div>
                        <div className="text-sm text-gray-600">All Pending</div>
                    </div>
                </motion.button>

                {Object.entries(roleConfig).map(([role, config]) => (
                    <motion.button
                        key={role}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedRole(role)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            selectedRole === role
                                ? `${config.borderColor} ${config.bgColor}`
                                : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                        <div className="text-center">
                            <div className={`flex justify-center mb-2 ${config.textColor}`}>
                                {config.icon}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{roleStats[role]}</div>
                            <div className="text-sm text-gray-600">{config.label}s</div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Users List */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">👥</div>
                    <p className="text-gray-500 text-lg">
                        {selectedRole === "all" 
                            ? "No pending approvals." 
                            : `No pending ${roleConfig[selectedRole]?.label.toLowerCase()}s.`
                        }
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        New registrations will appear here automatically.
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-sm text-indigo-700">
                                {filteredUsers.length} pending {selectedRole === "all" ? "user" : roleConfig[selectedRole]?.label.toLowerCase()}{filteredUsers.length !== 1 ? "s" : ""} • Real-time updates enabled
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {paginated.map((user) => {
                            const config = roleConfig[user.role];
                            return (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center text-white`}>
                                                    {config.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                Pending
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <p className="text-gray-600 flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </p>
                                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Registered: {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                            {renderUserDetails(user)}
                                        </div>

                                        <div className="flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => openConfirmModal(user, "approve")}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => openConfirmModal(user, "reject")}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentPage === page
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Confirm Approval Modal */}
            {showConfirmModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Approval</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to approve <strong>{selectedUser.name}</strong> as a {roleConfig[selectedUser.role]?.label.toLowerCase()}?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleApprove(selectedUser._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Confirm Approval
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Reject {roleConfig[selectedUser.role]?.label}</h3>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting <strong>{selectedUser.name}</strong> (optional):
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows="4"
                            placeholder="Enter reason for rejection..."
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason("");
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedUser._id, rejectionReason)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default PendingApprovals;