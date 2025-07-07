import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; 
import {
    getMyProfile,
    updateMyProfile,
    updateMyAvatar,
    updateMyPassword
} from "../../services/userService";
import { toast } from "react-toastify";

export default function Profile() {
    const { user, fetchUser } = useAuth(); 
    const [form, setForm] = useState({ name: "", email: "" });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [passwords, setPasswords] = useState({ current: "", newPass: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile();
                setForm({ name: data.name || "", email: data.email || "" });
                setAvatarPreview(data.picture);
            } catch (err) {
                toast.error("Failed to fetch profile.");
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            await updateMyProfile(form);
            toast.success("Profile updated.");
            fetchUser();
        } catch (err) {
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return toast.warning("No image selected.");
        try {
            const formData = new FormData();
            formData.append("avatar", avatarFile);
            await updateMyAvatar(formData);
            toast.success("Avatar updated.");
            fetchUser();
        } catch (err) {
            toast.error("Failed to upload avatar.");
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.newPass)
            return toast.warning("Enter both passwords.");

        try {
            await updateMyPassword(passwords);
            toast.success("Password changed.");
            setPasswords({ current: "", newPass: "" });
        } catch (err) {
            toast.error("Password change failed.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl mt-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">👤 My Profile</h2>

            {/* Avatar Preview + Upload */}
            <div className="mb-6 text-center">
                <img
                    src={avatarPreview || "/default-avatar.png"}
                    alt="avatar"
                    className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border"
                />
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                <button
                    className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    onClick={handleUploadAvatar}
                >
                    Upload Avatar
                </button>
            </div>

            {/* Name & Email */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                    />
                </div>
                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        className="w-full p-2 border rounded mt-1 bg-gray-100"
                        disabled
                    />
                </div>
                <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Change Password */}
            <div className="space-y-4 border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-700">🔐 Change Password</h3>
                <input
                    type="password"
                    placeholder="Current password"
                    value={passwords.current}
                    onChange={(e) =>
                        setPasswords((prev) => ({ ...prev, current: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="New password"
                    value={passwords.newPass}
                    onChange={(e) =>
                        setPasswords((prev) => ({ ...prev, newPass: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleChangePassword}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    Change Password
                </button>
            </div>

            {/* Role-Specific Info */}
            <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-500">
                    Logged in as:{" "}
                    <span className="font-semibold text-indigo-600">{user?.role}</span>
                </p>
            </div>
        </div>
    );
}
