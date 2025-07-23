import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

const ITEMS_PER_PAGE = 5;

const PendingEducators = () => {
    const [pending, setPending] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirm, setShowConfirm] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedEducatorId, setSelectedEducatorId] = useState(null);
    const socket = useSocket();
    const { user } = useAuth();

    // Fetch pending educators initially
    const fetchPendingEducators = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/admin/educators/pending");
            setPending(response.data.educators || []);
        } catch (error) {
            console.error("Error fetching pending educators:", error);
            toast.error("Failed to fetch pending educators");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingEducators();
    }, []);

    // Socket real-time updates
    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                socket.socket.emit("admin:join", { adminId: user._id });

                socket.socket.on("educator:registered", (data) => {
                    setPending((prev) => [data.educator, ...prev]);
                    toast.info(`New educator registration: ${data.educator.name}`);
                });

                socket.socket.on("educator:approved", (data) => {
                    setPending((prev) => prev.filter((edu) => edu._id !== data.educator._id));
                    toast.success(`Educator ${data.educator.name} approved`);
                });

                socket.socket.on("educator:rejected", (data) => {
                    setPending((prev) => prev.filter((edu) => edu._id !== data.educator._id));
                    toast.info(`Educator ${data.educator.name} rejected`);
                });

                return () => {
                    try {
                        if (socket && socket.socket) {
                            socket.socket.off("educator:registered");
                            socket.socket.off("educator:approved");
                            socket.socket.off("educator:rejected");
                        }
                    } catch (err) {
                        console.error("❌ Error removing educator listeners:", err.message);
                    }
                };
            } catch (err) {
                console.error("❌ Error setting up educator listeners:", err.message);
            }
        }
    }, [socket, user]);

    const handleApprove = async (id) => {
        try {
            const response = await api.put(`/api/admin/educators/approve/${id}`);
            if (response.data.message) {
                toast.success(response.data.message);
                setPending((prev) => prev.filter((edu) => edu._id !== id));
                if (socket && socket.socket) {
                    try {
                        socket.socket.emit("admin:educator:approved", {
                            educatorId: id,
                            adminId: user._id,
                        });
                    } catch (err) {
                        console.error("❌ Error emitting educator approval:", err.message);
                    }
                }
            }
        } catch (error) {
            console.error("Error approving educator:", error);
            toast.error(error.response?.data?.message || "Failed to approve educator");
        }
        setShowConfirm(null);
    };

    const handleReject = async (id, reason) => {
        try {
            const response = await api.put(`/api/admin/educators/reject/${id}`, {
                reason: reason || "No reason provided",
            });

            if (response.data.message) {
                toast.success(response.data.message);
                setPending((prev) => prev.filter((edu) => edu._id !== id));
                if (socket && socket.socket) {
                    try {
                        socket.socket.emit("admin:educator:rejected", {
                            educatorId: id,
                            adminId: user._id,
                            reason: reason,
                        });
                    } catch (err) {
                        console.error("❌ Error emitting educator rejection:", err.message);
                    }
                }
            }
        } catch (error) {
            console.error("Error rejecting educator:", error);
            toast.error(error.response?.data?.message || "Failed to reject educator");
        }
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedEducatorId(null);
    };

    const openRejectModal = (id) => {
        setSelectedEducatorId(id);
        setShowRejectModal(true);
    };

    const confirmApproval = (id) => {
        setConfirmAction(() => () => handleApprove(id));
        setShowConfirm(id);
    };

    const paginated = Array.isArray(pending)
        ? pending.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : [];

    const totalPages = Math.ceil(pending.length / ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Pending Educator Approvals</h2>
                <button
                    onClick={fetchPendingEducators}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {pending.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">👩‍🏫</div>
                    <p className="text-gray-500 text-lg">No pending educators.</p>
                    <p className="text-gray-400 text-sm mt-2">
                        New educator registrations will appear here automatically.
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-sm text-blue-700">
                                {pending.length} pending educator{pending.length !== 1 ? "s" : ""} • Real-time updates enabled
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {paginated.map((edu) => (
                            <div
                                key={edu._id}
                                className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{edu.name}</h3>
                                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                    Pending
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">{edu.email}</p>
                                            {edu.position && (
                                                <p className="text-sm text-gray-500 mb-1">
                                                    <strong>Position:</strong> {edu.position}
                                                </p>
                                            )}
                                            {edu.subjects && (
                                                <p className="text-sm text-gray-500 mb-1">
                                                    <strong>Subjects:</strong> {edu.subjects}
                                                </p>
                                            )}
                                            {edu.institution && (
                                                <p className="text-sm text-gray-500 mb-1">
                                                    <strong>Institution:</strong> {edu.institution}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-2">
                                                Registered: {new Date(edu.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => confirmApproval(edu._id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                onClick={() => openRejectModal(edu._id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                            >
                                                ❌ Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded border ${currentPage === page
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Confirm Approval Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Approval</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to approve this educator?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Confirm Approval
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Reject Educator</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejection (optional):</p>
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
                                    setSelectedEducatorId(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedEducatorId, rejectionReason)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingEducators;
