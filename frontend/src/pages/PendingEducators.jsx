import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const PendingEducators = () => {
    const [pending, setPending] = useState([]);

    const fetchPending = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API}/admin/pending-educators`, {
            withCredentials: true,
        });
        setPending(res.data);
    };

    const approveEducator = async (id) => {
        await axios.put(`${import.meta.env.VITE_API}/admin/approve-educator/${id}`, {}, {
            withCredentials: true,
        });
        fetchPending();
    };

    useEffect(() => {
        fetchPending();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Pending Educator Approvals</h2>
            {pending.length === 0 ? (
                <p className="text-gray-500">No pending educators.</p>
            ) : (
                <ul className="space-y-4">
                    {pending.map((edu) => (
                        <li key={edu._id} className="bg-white shadow p-4 rounded border">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>
                                        <strong>{edu.name}</strong> ({edu.email})
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {edu.position} – {edu.subjects}
                                    </p>
                                </div>
                                <button
                                    onClick={() => approveEducator(edu._id)}
                                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Approve
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingEducators;
