import React from "react";
import { useEffect, useState } from "react";
import {
    getPendingEducators,
    approveEducator,
    blockEducator,
} from "../services/adminService";

const AdminEducatorPanel = () => {
    const [educators, setEducators] = useState([]);

    const fetchData = async () => {
        const res = await getPendingEducators();
        setEducators(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id) => {
        await approveEducator(id);
        fetchData();
    };

    const handleBlock = async (id) => {
        await blockEducator(id);
        fetchData();
    };

    return (
        <div className="bg-white shadow p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-4">🎓 Pending Educators</h2>
            {educators.length === 0 ? (
                <p className="text-gray-500">No pending educators</p>
            ) : (
                <ul className="divide-y">
                    {educators.map((edu) => (
                        <li key={edu._id} className="py-2 flex justify-between items-center">
                            <span>{edu.name} ({edu.email})</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleApprove(edu._id)}
                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleBlock(edu._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                >
                                    Block
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminEducatorPanel;
