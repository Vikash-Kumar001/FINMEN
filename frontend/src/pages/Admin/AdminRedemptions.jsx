import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const AdminRedemptionsPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('admin:redemptions:subscribe', { adminId: user._id });
            socket.on('admin:redemptions:data', (data) => {
                setRequests(data);
                setLoading(false);
            });
            socket.on('admin:redemptions:update', setRequests);
            return () => {
                socket.off('admin:redemptions:data');
                socket.off('admin:redemptions:update');
            };
        }
    }, [socket, user]);

    const handleApprove = (id) => {
        socket.emit('admin:redemptions:approve', { adminId: user._id, redemptionId: id });
    };

    const handleReject = (id) => {
        socket.emit('admin:redemptions:reject', { adminId: user._id, redemptionId: id });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">💸 Redemption Requests</h2>
            {loading ? (
                <p>Loading...</p>
            ) : requests.length === 0 ? (
                <p className="text-gray-600">No pending redemption requests.</p>
            ) : (
                <table className="w-full bg-white border shadow rounded">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">User</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">UPI ID</th>
                            <th className="p-2">Requested At</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id} className="border-t">
                                <td className="p-2">{req.userId.name} ({req.userId.email})</td>
                                <td className="p-2">₹{req.amount}</td>
                                <td className="p-2">{req.upiId}</td>
                                <td className="p-2">{new Date(req.createdAt).toLocaleString()}</td>
                                <td className="p-2 flex gap-2">
                                    <button
                                        onClick={() => handleApprove(req._id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminRedemptionsPanel;