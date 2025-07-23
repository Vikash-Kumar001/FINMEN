import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import MissionCard from "../MissionCard";

const StudentGame = () => {
    const [level, setLevel] = useState("junior");
    const [missions, setMissions] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                socket.socket.emit('student:missions:subscribe', { studentId: user._id, level });
                socket.socket.on('student:missions:data', data => setMissions(data));
                socket.socket.on('student:progress:data', data => setProgress(data));
                
                return () => {
                    try {
                        if (socket && socket.socket) {
                            socket.socket.off('student:missions:data');
                            socket.socket.off('student:progress:data');
                        }
                    } catch (err) {
                        console.error("❌ Error removing mission listeners:", err.message);
                    }
                };
            } catch (err) {
                console.error("❌ Error setting up mission listeners:", err.message);
            }
        }
    }, [socket, user, level]);

    const handleComplete = async (missionId) => {
        setLoading(true);
        if (socket && socket.socket) {
            try {
                socket.socket.emit('student:missions:complete', { studentId: user._id, missionId });
            } catch (err) {
                console.error("❌ Error completing mission:", err.message);
            }
        } else {
            console.error("❌ Socket not available for completing mission");
        }
        setLoading(false); // Real-time update should come via socket automatically
    };

    const isMissionCompleted = (id) =>
        progress?.completedMissions?.some((m) => m.missionId._id === id);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">🎯 Financial Missions</h2>

            <div className="flex gap-4 mb-6">
                {["junior", "pro"].map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`px-4 py-2 rounded ${level === lvl
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                            }`}
                    >
                        {lvl.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {missions.map((mission) => (
                    <MissionCard
                        key={mission._id}
                        mission={mission}
                        onComplete={handleComplete}
                        isCompleted={isMissionCompleted(mission._id)}
                    />
                ))}
            </div>

            {progress && (
                <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-2">🎉 Your Progress</h3>
                    <p>XP: {progress.xp} | HealCoins: {progress.healCoins}</p>
                    <p>Badges: {progress.badges.join(", ") || "None yet"}</p>
                </div>
            )}
        </div>
    );
};

export default StudentGame;
