import React from "react";
import { useEffect, useState } from "react";
import AdminStatsPanel from "../components/AdminStatsPanel";
import AdminEducatorPanel from "../components/AdminEducatorPanel";
import AdminUsersPanel from "../components/AdminUsersPanel";
import AllRedemptions from "./AdminRedemptions";
import AllStudents from "./AllStudents";
import axios from "axios";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("stats");
    const [data, setData] = useState({
        students: 0,
        educators: 0,
        pending: 0,
        redemptions: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API}/admin/dashboard-stats`,
                    { withCredentials: true }
                );
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };

        fetchCounts();
    }, []);

    const renderTab = () => {
        switch (activeTab) {
            case "stats":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card title="Total Students" count={data.students} />
                        <Card title="Total Educators" count={data.educators} />
                        <Card title="Pending Educators" count={data.pending} />
                        <Card title="Redemption Requests" count={data.redemptions} />
                    </div>
                );
            case "educators":
                return <AdminEducatorPanel />;
            case "students":
                return <AllStudents />;
            case "redemptions":
                return <AllRedemptions />;
            case "users":
                return <AdminUsersPanel />;
            default:
                return <AdminStatsPanel />;
        }
    };

    const navItems = [
        { label: "📊 Dashboard Stats", key: "stats" },
        { label: "🧑‍🏫 Educator Approvals", key: "educators" },
        { label: "👩‍🎓 Student List", key: "students" },
        { label: "💸 Redemption Requests", key: "redemptions" },
        { label: "👥 Users Management", key: "users" },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
                <h2 className="text-xl font-bold mb-4">🛠️ Admin Panel</h2>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`block w-full text-left px-2 py-1 rounded ${activeTab === item.key
                                    ? "bg-yellow-500 text-black font-semibold"
                                    : "hover:text-yellow-400"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Panel */}
            <main className="flex-1 bg-gray-50 p-8">
                <h1 className="text-3xl font-bold mb-6">🛠️ Admin Dashboard</h1>
                <div className="bg-white p-6 rounded shadow">{renderTab()}</div>
            </main>
        </div>
    );
};

const Card = ({ title, count }) => (
    <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-blue-600">{count}</p>
    </div>
);

export default AdminDashboard;
