import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
    const { user, fetchUser } = useAuth();

    const [form, setForm] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                name: user.name || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const payload = {
                name: form.name,
            };

            // Only send password if filled
            if (form.currentPassword && form.newPassword) {
                payload.currentPassword = form.currentPassword;
                payload.newPassword = form.newPassword;
            }

            await axios.put(`${import.meta.env.VITE_API}/auth/settings`, payload, {
                withCredentials: true,
            });

            toast.success("Settings updated successfully");
            setForm((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
            }));
            fetchUser();
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to update settings";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">⚙️ Settings</h2>

            <div className="space-y-5">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full p-2 border rounded bg-gray-100 text-gray-600"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter current password"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter new password"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default Settings;
