import React, { useEffect, useState } from "react";
import api from "../utils/api";

const MoodTimeline = () => {
    const [moods, setMoods] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get("/api/mood/my-logs");
                setMoods(res.data);
            } catch (err) {
                console.error("Failed to load mood logs", err);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mt-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                Mood History Timeline
            </h3>
            <div className="space-y-4 max-h-72 overflow-y-auto">
                {moods.map((log) => (
                    <div key={log._id} className="flex items-start space-x-4">
                        <div className="text-2xl">{log.emoji}</div>
                        <div>
                            <div className="text-sm font-medium text-gray-700 dark:text-white">
                                {new Date(log.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-300">
                                {log.journal || "No journal entry"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodTimeline;
