import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminRedemptionsPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRedemptions = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/admin/redemptions`, {
                withCredentials: true,
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to load redemptions", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API}/admin/redemptions/approve/${id}`, {}, {
                withCredentials: true,
            });
            fetchRedemptions();
        } catch (err) {
            console.error("Approval failed", err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API}/admin/redemptions/reject/${id}`, {}, {
                withCredentials: true,
            });
            fetchRedemptions();
        } catch (err) {
            console.error("Rejection failed", err);
        }
    };

    useEffect(() => {
        fetchRedemptions();
    }, []);

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
