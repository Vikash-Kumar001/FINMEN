import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
// import StatCard from "../";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('admin:analytics:subscribe', { adminId: user._id });
            socket.on('admin:analytics:data', setStats);
            socket.on('admin:analytics:update', update =>
                setStats(prev => ({ ...prev, ...update }))
            );
            return () => {
                socket.off('admin:analytics:data');
                socket.off('admin:analytics:update');
            };
        }
    }, [socket, user]);

    if (!stats) return <p className="p-4">Loading analytics...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">📊 Platform Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Users" value={stats.totalUsers} />
                <StatCard title="Students" value={stats.totalStudents} />
                <StatCard title="Educators" value={stats.totalEducators} />
                <StatCard title="Mood Logs" value={stats.totalMoods} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-2">Mood Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.moodStats}>
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Mission Completion (By Level)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.missionStats}>
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#22c55e" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminAnalytics;