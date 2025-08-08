import React, { useEffect, useState } from "react";
import api from "../utils/api";

const FilterableMoodHistory = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState("week");

    // Define the fetchLogs function inside the useEffect
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get(`/api/mood/history?filter=${filter}`);
                setLogs(res.data);
            } catch (err) {
                console.error("Failed to fetch mood history:", err);
            }
        };
        
        fetchLogs();
    }, [filter]); // Only include filter as a dependency

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">📅 Mood History</h2>
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mb-4 px-3 py-1 rounded border border-gray-300"
            >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
            </select>

            <ul className="text-sm text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                {logs.map((log, idx) => (
                    <li key={idx} className="flex justify-between">
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                        <span>{log.emoji}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FilterableMoodHistory;
