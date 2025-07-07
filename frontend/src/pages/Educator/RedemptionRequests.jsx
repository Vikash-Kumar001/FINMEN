import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const RedemptionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('student:redemption:subscribe', { studentId: user._id });
            socket.on('student:redemption:data', data => {
                setRequests(data);
                setLoading(false);
            });
            socket.on('student:redemption:update', setRequests);
            return () => {
                socket.off('student:redemption:data');
                socket.off('student:redemption:update');
            };
        }
    }, [socket, user]);

    const handleApprove = (id) => {
        socket.emit('student:redemption:approve', { studentId: user._id, requestId: id });
    };

    const handleReject = (id) => {
        socket.emit('student:redemption:reject', { studentId: user._id, requestId: id });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">💸 Redemption Requests</h2>
            {requests.length === 0 ? (
                <p className="text-gray-500">No redemption requests found.</p>
            ) : (
                <table className="w-full table-auto bg-white border shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Student</th>
                            <th>Amount</th>
                            <th>UPI ID</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id} className="border-t">
                                <td className="p-2">{req.user?.name}</td>
                                <td>₹{req.amount}</td>
                                <td>{req.upiId}</td>
                                <td className="capitalize">{req.status}</td>
                                <td>
                                    {req.status === "pending" && (
                                        <>
                                            <button
                                                className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                                                onClick={() => handleApprove(req._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="px-2 py-1 bg-red-600 text-white rounded"
                                                onClick={() => handleReject(req._id)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RedemptionRequests;