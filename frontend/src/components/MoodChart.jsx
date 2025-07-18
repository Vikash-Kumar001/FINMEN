import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import api from "../utils/api";

// 🎨 Mood config
const getMoodMeta = (score) => {
    if (score >= 8) return { emoji: "🥳", color: "#22c55e", label: "Great" };
    if (score >= 6) return { emoji: "😊", color: "#3b82f6", label: "Good" };
    if (score >= 4) return { emoji: "😐", color: "#facc15", label: "Meh" };
    if (score >= 2) return { emoji: "😟", color: "#f97316", label: "Low" };
    return { emoji: "😢", color: "#ef4444", label: "Bad" };
};

const MoodChart = () => {
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState("bar");
    const [average, setAverage] = useState(0);

    useEffect(() => {
        fetchMoodStats();
    }, []);

    const fetchMoodStats = async () => {
        try {
            const res = await api.get("/api/mood/week");

            if (!Array.isArray(res.data)) {
                console.error("❌ Unexpected mood data format:", res.data);
                return;
            }

            const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            const transformed = weekDays.map((day) => {
                const entry = res.data.find((d) => d.day === day);
                const score = entry?.score ?? 0;
                const mood = getMoodMeta(score);
                return {
                    day,
                    moodScore: score,
                    emoji: mood.emoji,
                    fill: mood.color,
                    label: mood.label,
                };
            });

            const avg =
                transformed.reduce((sum, item) => sum + item.moodScore, 0) /
                transformed.length;

            setData(transformed);
            setAverage(avg.toFixed(2));
        } catch (err) {
            console.error("❌ Failed to fetch mood stats:", err);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            const { moodScore, emoji, label: moodLabel } = payload[0].payload;
            return (
                <div className="p-2 bg-white border rounded shadow">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-sm">
                        Mood: {moodScore} {emoji} ({moodLabel})
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Weekly Mood Overview</h2>

                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="text-sm p-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
                >
                    <option value="bar">📊 Bar Chart</option>
                    <option value="line">📈 Line Chart</option>
                </select>
            </div>

            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis
                                dataKey="day"
                                tick={({ x, y, payload }) => {
                                    const mood = data.find((d) => d.day === payload.value);
                                    return (
                                        <g transform={`translate(${x},${y + 10})`}>
                                            <text x={0} y={0} dy={16} textAnchor="middle" fill="#8884d8">
                                                {payload.value}
                                            </text>
                                            {mood && (
                                                <text x={0} y={16} dy={16} textAnchor="middle" fontSize={16}>
                                                    {mood.emoji}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }}
                            />
                            <YAxis domain={[0, 10]} stroke="#8884d8" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="moodScore">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    ) : (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis dataKey="day" stroke="#8884d8" />
                            <YAxis domain={[0, 10]} stroke="#8884d8" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="moodScore"
                                stroke="#6366f1"
                                strokeWidth={2}
                                dot={{
                                    r: 6,
                                    stroke: "#fff",
                                    strokeWidth: 1,
                                    fill: "#6366f1",
                                }}
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                📊 Weekly Average Mood Score: <span className="font-bold">{average}</span>
            </div>
        </div>
    );
};

export default MoodChart;
