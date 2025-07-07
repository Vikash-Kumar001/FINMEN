import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, parseISO } from "date-fns";
import { saveAs } from "file-saver";
import { Tooltip } from "react-tooltip";

const moodOptions = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😠", label: "Angry" },
    { emoji: "😰", label: "Anxious" },
];

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState("");
    const [note, setNote] = useState("");
    const [moodLogs, setMoodLogs] = useState([]);
    const [warning, setWarning] = useState("");

    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('student:mood:subscribe', { studentId: user._id });
            socket.on('student:mood:data', data => setMoodLogs(data));
            socket.on('student:mood:added', log => setMoodLogs(prev => [log, ...prev]));
            return () => {
                socket.off('student:mood:data');
                socket.off('student:mood:added');
            };
        }
    }, [socket, user]);
    const handleSubmit = () => {
        if (!selectedMood) {
            setWarning("Please select a mood.");
            return;
        }
        setWarning("");
        socket.emit('student:mood:add', { studentId: user._id, mood: selectedMood, note });
        setNote("");
        setSelectedMood("");
    };

    const downloadCSV = () => {
        const csvContent = [
            ["Date", "Mood", "Note"],
            ...moodLogs.map((log) => [
                new Date(log.createdAt).toLocaleString(),
                log.mood,
                log.note || "",
            ]),
        ]
            .map((row) => row.map((value) => `"${value}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "mood_history.csv");
    };

    const heatmapData = moodLogs.map((log) => ({
        date: format(parseISO(log.createdAt), "yyyy-MM-dd"),
        count: moodOptions.findIndex((opt) => opt.label === log.mood) + 1,
    }));

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">🧘 Mood Tracker</h2>

            <div className="mb-4">
                <div className="flex gap-4 flex-wrap">
                    {moodOptions.map((mood) => (
                        <button
                            key={mood.label}
                            onClick={() => setSelectedMood(mood.label)}
                            className={`text-3xl p-3 rounded-full border transition ${selectedMood === mood.label
                                ? "bg-blue-200 border-blue-500"
                                : "bg-gray-100"
                                }`}
                        >
                            {mood.emoji}
                        </button>
                    ))}
                </div>
                {warning && <p className="text-sm text-red-500 mt-2">{warning}</p>}
            </div>

            <textarea
                className="w-full p-2 border rounded mb-4"
                rows={3}
                placeholder="Optional: Why do you feel this way?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded text-white ${selectedMood
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                disabled={!selectedMood}
            >
                Submit Mood
            </button>

            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-2">📅 Mood Heatmap</h3>
                {heatmapData.length > 0 ? (
                    <div className="relative">
                        <CalendarHeatmap
                            startDate={new Date(new Date().setMonth(new Date().getMonth() - 5))}
                            endDate={new Date()}
                            values={heatmapData}
                            classForValue={(value) => {
                                if (!value || value.count === 0) return "mood-empty";
                                return `mood-${value.count}`;
                            }}
                            showWeekdayLabels
                            gutterSize={4}
                            horizontal
                            tooltipDataAttrs={(value) =>
                                value.date
                                    ? {
                                        "data-tooltip-id": "tooltip",
                                        "data-tooltip-content": `${value.date}: ${moodOptions[value.count - 1]?.emoji
                                            } ${moodOptions[value.count - 1]?.label}`,
                                    }
                                    : {}
                            }
                            renderBlockContent={(value) => {
                                if (!value || value.count === 0) return null;
                                const mood = moodOptions[value.count - 1];
                                return (
                                    <text
                                        x="50%"
                                        y="50%"
                                        dominantBaseline="central"
                                        textAnchor="middle"
                                        fontSize="10"
                                    >
                                        {mood.emoji}
                                    </text>
                                );
                            }}
                        />
                        <Tooltip id="tooltip" place="top" />
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No mood data yet.</p>
                )}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">📄 Your Mood History</h3>
                <button
                    onClick={downloadCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                    Export CSV
                </button>
            </div>

            <ul className="space-y-2 max-h-64 overflow-y-auto mt-2">
                {moodLogs.length === 0 ? (
                    <p className="text-sm text-gray-500">No mood logs yet.</p>
                ) : (
                    moodLogs.map((log) => (
                        <li
                            key={log._id}
                            className="p-3 border rounded bg-white shadow-sm"
                        >
                            <div className="text-sm text-gray-600">
                                {new Date(log.createdAt).toLocaleString()}
                            </div>
                            <div className="text-lg">
                                {log.mood} —{" "}
                                {log.note || (
                                    <span className="text-gray-400 italic">No note</span>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default MoodTracker;
