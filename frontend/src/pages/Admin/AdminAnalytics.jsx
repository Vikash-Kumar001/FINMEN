import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    AlertCircle,
    Users,
    GraduationCap,
    UserCheck,
    Heart,
} from "lucide-react";

const StatCard = ({ title, value, icon }) => (
    <motion.div
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50"
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-600 font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </motion.div>
);

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit("admin:analytics:subscribe", { adminId: user._id });

            socket.on("admin:analytics:data", (data) => {
                setStats(data);
                setError(null);
            });

            socket.on("admin:analytics:update", (update) => {
                setStats((prev) => ({ ...prev, ...update }));
                setError(null);
            });

            socket.on("admin:analytics:error", (err) => {
                setError(err.message || "Failed to fetch analytics data");
            });

            return () => {
                socket.off("admin:analytics:data");
                socket.off("admin:analytics:update");
                socket.off("admin:analytics:error");
            };
        }
    }, [socket, user]);

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto p-6"
        >
            <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-3"
            >
                <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <TrendingUp className="w-6 h-6" />
                </motion.div>
                Platform Analytics
            </motion.h2>

            <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users className="w-5 h-5" />}
                />
                <StatCard
                    title="Students"
                    value={stats.totalStudents}
                    icon={<GraduationCap className="w-5 h-5" />}
                />
                <StatCard
                    title="Educators"
                    value={stats.totalEducators}
                    icon={<UserCheck className="w-5 h-5" />}
                />
                <StatCard
                    title="Mood Logs"
                    value={stats.totalMoods}
                    icon={<Heart className="w-5 h-5" />}
                />
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 mb-8"
            >
                <h3 className="text-xl font-semibold mb-4 text-slate-800">
                    Mood Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.moodStats}>
                        <XAxis dataKey="_id" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "8px",
                                border: "1px solid rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50"
            >
                <h3 className="text-xl font-semibold mb-4 text-slate-800">
                    Mission Completion (By Level)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.missionStats}>
                        <XAxis dataKey="_id" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "8px",
                                border: "1px solid rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    );
};

export default AdminAnalytics;
