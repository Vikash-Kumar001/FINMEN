import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function AdminPanel() {
    const [pending, setPending] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && socket.socket && user) {
            socket.socket.emit('admin:panel:subscribe', { adminId: user._id });
            socket.socket.on('admin:panel:pendingEducators', setPending);
            socket.socket.on('admin:panel:users', setUsers);
            socket.socket.on('admin:panel:update', (update) => {
                if (update.users) setUsers(update.users);
                if (update.pending) setPending(update.pending);
            });

            return () => {
                socket.socket.off('admin:panel:pendingEducators');
                socket.socket.off('admin:panel:users');
                socket.socket.off('admin:panel:update');
            };
        }
    }, [socket, user]);

    const approveEducator = (id) => {
        if (!socket || !socket.socket) {
            console.error("❌ Socket not available for approving educator");
            toast.error("Connection error. Please try again.");
            return;
        }
        
        try {
            socket.socket.emit('admin:panel:approveEducator', { adminId: user._id, educatorId: id });
            toast.success("Educator approved");
            // UI will auto-update from server push
        } catch (err) {
            console.error("❌ Error approving educator:", err.message);
            toast.error("Failed to approve educator");
        }
    };

    const handleRoleChange = (id, newRole) => {
        if (!socket || !socket.socket) {
            console.error("❌ Socket not available for updating role");
            toast.error("Connection error. Please try again.");
            return;
        }
        
        try {
            socket.socket.emit('admin:panel:updateRole', { adminId: user._id, userId: id, newRole });
            toast.success("Role updated");
        } catch (err) {
            console.error("❌ Error updating role:", err.message);
            toast.error("Failed to update role");
        }
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        
        if (!socket || !socket.socket) {
            console.error("❌ Socket not available for deleting user");
            toast.error("Connection error. Please try again.");
            return;
        }
        
        try {
            socket.socket.emit('admin:panel:deleteUser', { adminId: user._id, userId: id });
            toast.success("User deleted");
        } catch (err) {
            console.error("❌ Error deleting user:", err.message);
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🛠 Admin Panel</h2>
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setActiveTab("pending")}
                >
                    Pending Educators
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setActiveTab("users")}
                >
                    All Users
                </button>
            </div>

            {activeTab === "pending" && (
                <>
                    {pending.length === 0 ? (
                        <p className="text-gray-500">No pending educators.</p>
                    ) : (
                        <ul className="space-y-4">
                            {pending.map((edu) => (
                                <li key={edu._id} className="bg-white shadow p-4 rounded border">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">
                                                {edu.name} ({edu.email})
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
                </>
            )}

            {activeTab === "users" && (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto bg-white shadow rounded-xl">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Change Role</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-t text-sm">
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3 font-semibold">{u.role}</td>
                                    <td className="p-3">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value="student">Student</option>
                                            <option value="educator">Educator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}