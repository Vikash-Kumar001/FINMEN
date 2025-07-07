import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const PendingEducators = () => {
    const [pending, setPending] = useState([]);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('admin:pending-educators:subscribe', { adminId: user._id });
            socket.on('admin:pending-educators:data', setPending);
            socket.on('admin:pending-educators:update', setPending);
            return () => {
                socket.off('admin:pending-educators:data');
                socket.off('admin:pending-educators:update');
            };
        }
    }, [socket, user]);

    const approveEducator = (id) => {
        socket.emit('admin:pending-educators:approve', { adminId: user._id, educatorId: id });
    };

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