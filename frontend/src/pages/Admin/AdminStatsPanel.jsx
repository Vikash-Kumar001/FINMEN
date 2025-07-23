import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

export default function AdminStatsPanel() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalEducators: 0,
        pendingEducators: 0,
        redemptions: 0,
    });
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                try {
                    socket.socket.emit('admin:stats:subscribe', { adminId: user._id });
                } catch (err) {
                    console.error("❌ Error subscribing to admin stats:", err.message);
                }
                
                socket.socket.on('admin:stats:data', setStats);
                socket.socket.on('admin:stats:update', update =>
                    setStats(prev => ({ ...prev, ...update }))
                );
            } catch (err) {
                console.error("❌ Error setting up admin stats socket listeners:", err.message);
            }
            
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('admin:stats:data');
                        socket.socket.off('admin:stats:update');
                    }
                } catch (err) {
                    console.error("❌ Error cleaning up admin stats socket listeners:", err.message);
                }
            };
        }
    }, [socket, user]);

    const cards = [
        { label: "👥 Total Users", value: stats.totalUsers },
        { label: "👩‍🎓 Total Students", value: stats.totalStudents },
        { label: "🧑‍🏫 Approved Educators", value: stats.totalEducators },
        { label: "⏳ Pending Educators", value: stats.pendingEducators },
        { label: "💸 Total Redemptions", value: stats.redemptions },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">📊 Platform Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white shadow rounded p-4">
                        <p className="text-sm text-gray-600">{card.label}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}