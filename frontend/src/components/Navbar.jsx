import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const getDashboardLabel = () => {
        switch (user?.role) {
            case "admin":
                return "Admin Dashboard";
            case "educator":
                return "Educator Dashboard";
            case "student":
            default:
                return "Student Dashboard";
        }
    };

    const handleDashboardRedirect = () => {
        if (!user) return;
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "educator") navigate("/educator/dashboard");
        else navigate("/student/dashboard");
    };

    return (
        <header className="w-full bg-white dark:bg-gray-900 shadow p-4 flex items-center justify-between z-50 sticky top-0">
            <div
                className="text-xl font-bold text-indigo-600 dark:text-white cursor-pointer"
                onClick={handleDashboardRedirect}
            >
                🎓 FinMen – {getDashboardLabel()}
            </div>

            {user && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={user.avatar || "/default-avatar.png"}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover border"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                            {user.name || "User"}
                        </span>
                    </div>
                    <button
                        onClick={logoutUser}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;
