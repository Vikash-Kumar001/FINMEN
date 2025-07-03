import { useEffect, useState } from "react";
import {
    getMissionsByLevel,
    completeMission,
    getUserProgress,
} from "../services/gameService";
import MissionCard from "./MissionCard";

const StudentGame = () => {
    const [level, setLevel] = useState("junior");
    const [missions, setMissions] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMissions();
        loadProgress();
    }, [level]);

    const loadMissions = async () => {
        const res = await getMissionsByLevel(level);
        setMissions(res.data);
    };

    const loadProgress = async () => {
        const res = await getUserProgress();
        setProgress(res.data);
    };

    const handleComplete = async (missionId) => {
        setLoading(true);
        await completeMission(missionId);
        await loadProgress();
        await loadMissions();
        setLoading(false);
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
