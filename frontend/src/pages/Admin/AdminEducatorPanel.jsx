import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const AdminEducatorPanel = () => {
    const [educators, setEducators] = useState([]);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('admin:educator:pending:subscribe', { adminId: user._id });
            socket.on('admin:educator:pending:data', setEducators);
            socket.on('admin:educator:pending:update', setEducators);
            return () => {
                socket.off('admin:educator:pending:data');
                socket.off('admin:educator:pending:update');
            };
        }
    }, [socket, user]);

    const handleApprove = (id) => {
        socket.emit('admin:educator:approve', { adminId: user._id, educatorId: id });
    };

    const handleBlock = (id) => {
        socket.emit('admin:educator:block', { adminId: user._id, educatorId: id });
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