import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useNotification } from "../../context/NotificationContext";

import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaGift,
    FaUsers,
    FaChartPie,
} from "react-icons/fa";

import AdminStatsPanel from "./AdminStatsPanel";
import AllStudents from "./AllStudents";
import AllEducator from "./AllEducator";
import AdminRedemptions from "./AdminRedemptions";
import AdminAnalytics from "./AdminAnalytics";
import AdminUsersPanel from "./AdminUsersPanel";
import PendingEducators from "./PendingEducators";

const AdminDashboard = () => {
    const socket = useSocket();               // ✅ Fixed: Socket hook
    const { notify } = useNotification();     // ✅ Fixed: Notification hook

    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (!socket) return;

        socket.on("admin-notification", (data) => {
            notify(data?.message || "🔔 Admin notification received");
        });

        return () => {
            socket.off("admin-notification");
        };
    }, [socket, notify]);

    const renderSection = () => {
        switch (activeTab) {
            case "overview":
                return <AdminStatsPanel />;
            case "students":
                return <AllStudents />;
            case "educators":
                return <AllEducator />;
            case "pending":
                return <PendingEducators />;
            case "redemptions":
                return <AdminRedemptions />;
            case "analytics":
                return <AdminAnalytics />;
            case "users":
                return <AdminUsersPanel />;
            default:
                return <AdminStatsPanel />;
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-white">
                📊 Admin Dashboard
            </h1>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`btn-tab ${activeTab === "overview" ? "bg-indigo-600 text-white" : ""}`}
                >
                    <FaChartPie className="mr-2" /> Overview
                </button>
                <button
                    onClick={() => setActiveTab("students")}
                    className={`btn-tab ${activeTab === "students" ? "bg-indigo-600 text-white" : ""}`}
                >
                    <FaUserGraduate className="mr-2" /> Students
                </button>
                <button
                    onClick={() => setActiveTab("educators")}
                    className={`btn-tab ${activeTab === "educators" ? "bg-indigo-600 text-white" : ""}`}
                >
                    <FaChalkboardTeacher className="mr-2" /> Educators
                </button>
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`btn-tab ${activeTab === "pending" ? "bg-indigo-600 text-white" : ""}`}
                >
                    ⏳ Pending
                </button>
                <button
                    onClick={() => setActiveTab("redemptions")}
                    className={`btn-tab ${activeTab === "redemptions" ? "bg-indigo-600 text-white" : ""}`}
                >
                    <FaGift className="mr-2" /> Redemptions
                </button>
                <button
                    onClick={() => setActiveTab("analytics")}
                    className={`btn-tab ${activeTab === "analytics" ? "bg-indigo-600 text-white" : ""}`}
                >
                    📈 Analytics
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`btn-tab ${activeTab === "users" ? "bg-indigo-600 text-white" : ""}`}
                >
                    <FaUsers className="mr-2" /> Admin Users
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminDashboard;
