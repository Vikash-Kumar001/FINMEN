import { useEffect, useState } from "react";
import {
    getAllUsers,
    deleteUser,
    updateUserByAdmin,
} from "../services/userService";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminPanel() {
    const [pending, setPending] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");

    useEffect(() => {
        fetchPending();
        fetchUsers();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API}/admin/pending-educators`,
                { withCredentials: true }
            );
            setPending(res.data);
        } catch (err) {
            toast.error("Failed to fetch pending educators");
        }
    };

    const approveEducator = async (id) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API}/admin/approve-educator/${id}`,
                {},
                { withCredentials: true }
            );
            toast.success("Educator approved");
            fetchPending();
            fetchUsers();
        } catch (err) {
            toast.error("Approval failed");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res);
        } catch (err) {
            toast.error("Failed to fetch users");
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await updateUserByAdmin(id, { role: newRole });
            toast.success("Role updated");
            fetchUsers();
        } catch (err) {
            toast.error("Role update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            toast.success("User deleted");
            fetchUsers();
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🛠 Admin Panel</h2>

            {/* Tabs */}
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

            {/* Pending Educators Tab */}
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

            {/* All Users Tab */}
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
