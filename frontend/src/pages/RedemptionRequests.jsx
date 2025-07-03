import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const RedemptionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/admin/redemptions`, {
                withCredentials: true,
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching redemption requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API}/admin/redemptions/${id}/approve`,
                {},
                { withCredentials: true }
            );
            fetchRequests();
        } catch (err) {
            console.error("Failed to approve:", err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API}/admin/redemptions/${id}/reject`,
                {},
                { withCredentials: true }
            );
            fetchRequests();
        } catch (err) {
            console.error("Failed to reject:", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

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
