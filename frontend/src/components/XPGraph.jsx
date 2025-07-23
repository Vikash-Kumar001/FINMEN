import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../utils/api";

const XPGraph = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchXPLogs();
    }, []);

    const fetchXPLogs = async () => {
        try {
            const res = await api.get("/api/stats/xp-logs");
            const formatted = res.data.map((entry) => ({
                date: new Date(entry.date).toLocaleDateString(),
                xp: entry.xp,
            }));
            setData(formatted);
        } catch (err) {
            console.error("Failed to fetch XP logs:", err);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">XP Progression</h2>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default XPGraph;