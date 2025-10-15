import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaSmile,
    FaGamepad,
    FaBook,
    FaWallet,
    FaGift,
    FaBell,
    FaChartLine,
    FaUser,
    FaCogs,
    FaTools,
    FaUsers,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaChartPie,
    FaHourglassHalf,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
    const { user } = useAuth();

    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${isActive
            ? "bg-indigo-500 text-white"
            : "text-gray-600 hover:bg-gray-200"
        }`;

    const studentLinks = [
        { to: "/student/dashboard", label: "Dashboard", icon: <FaHome /> },
        { to: "/student/mood-tracker", label: "Mood Tracker", icon: <FaSmile /> },
        { to: "/student/journal", label: "Journal", icon: <FaBook /> },
        { to: "/student/games", label: "Games", icon: <FaGamepad /> },
        { to: "/student/wallet", label: "Wallet", icon: <FaWallet /> },
        { to: "/student/rewards", label: "Rewards", icon: <FaGift /> },
        { to: "/student/redeem", label: "Redeem", icon: <FaGift /> },
        { to: "/student/leaderboard", label: "Leaderboard", icon: <FaChartLine /> },
        { to: "/student/notifications", label: "Notifications", icon: <FaBell /> },
        { to: "/student/profile", label: "Profile", icon: <FaUser /> },
        { to: "/student/setting", label: "Settings", icon: <FaCogs /> },
    ];


    const adminLinks = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <FaChartPie /> },
        { to: "/admin/students", label: "All Students", icon: <FaUserGraduate /> },
        { to: "/admin/redemptions", label: "Redemptions", icon: <FaGift /> },
        { to: "/admin/analytics", label: "Analytics", icon: <FaChartLine /> },
        { to: "/admin/users", label: "Users Panel", icon: <FaUsers /> },
    ];

    const getLinksByRole = () => {
        if (user?.role === "admin") return adminLinks;
        return studentLinks;
    };

    return (
        <aside className="w-full md:w-64 h-full bg-white shadow-md p-4 sticky top-0 z-40">
            <h2 className="text-xl font-bold text-indigo-600 mb-4">
                🎓 WiseStudent
            </h2>

            <nav className="space-y-1">
                {getLinksByRole().map(({ to, label, icon }) => (
                    <NavLink key={to} to={to} className={linkClass}>
                        {icon}
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
