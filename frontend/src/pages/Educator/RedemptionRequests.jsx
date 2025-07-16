import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

const RedemptionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmId, setConfirmId] = useState(null);
    const [rejectId, setRejectId] = useState(null);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit("student:redemption:subscribe", { studentId: user._id });

            socket.on("student:redemption:data", (data) => {
                setRequests(data);
                setLoading(false);
            });

            socket.on("student:redemption:update", (data) => {
                setRequests(data);
            });

            socket.on("student:redemption:approved", (data) => {
                toast.success(`Redemption approved for ₹${data.amount}`);
            });

            socket.on("student:redemption:rejected", (data) => {
                toast.error(`Redemption rejected for ₹${data.amount}`);
            });

            return () => {
                socket.off("student:redemption:data");
                socket.off("student:redemption:update");
                socket.off("student:redemption:approved");
                socket.off("student:redemption:rejected");
            };
        }
    }, [socket, user]);

    const handleApprove = (id) => {
        socket.emit("student:redemption:approve", {
            studentId: user._id,
            requestId: id,
        });
        setConfirmId(null);
    };

    const handleReject = (id) => {
        socket.emit("student:redemption:reject", {
            studentId: user._id,
            requestId: id,
        });
        setRejectId(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                💸 Redemption Requests
            </h2>

            {requests.length === 0 ? (
                <p className="text-gray-500">No redemption requests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto bg-white border shadow rounded">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Student</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-left">UPI ID</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{req.user?.name}</td>
                                    <td className="p-3">₹{req.amount}</td>
                                    <td className="p-3">{req.upiId}</td>
                                    <td className="p-3 capitalize">{req.status}</td>
                                    <td className="p-3">
                                        {req.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                    onClick={() => setConfirmId(req._id)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                    onClick={() => setRejectId(req._id)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirm Approve Modal */}
            {confirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-3 text-gray-900">
                            Confirm Approval
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                            Are you sure you want to approve this redemption request?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleApprove(confirmId)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Reject Modal */}
            {rejectId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-3 text-gray-900">
                            Confirm Rejection
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                            Are you sure you want to reject this redemption request?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setRejectId(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(rejectId)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RedemptionRequests;
