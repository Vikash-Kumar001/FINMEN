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
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
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
            <motion.div
                className="flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                    animate={{
                        boxShadow: [
                            '0 4px 20px rgba(139, 92, 246, 0.3)',
                            '0 4px 40px rgba(139, 92, 246, 0.5)',
                            '0 4px 20px rgba(139, 92, 246, 0.3)'
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Zap className="w-5 h-5" />
                </motion.div>
                <h2 className="text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                    WiseStudent
                </h2>
            </motion.div>

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
