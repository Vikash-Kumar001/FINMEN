import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Download,
    BarChart3,
    Clock,
    Heart,
    Sparkles,
    Award,
    Zap,
} from "lucide-react";
// Removed unused imports
// Using built-in Date methods instead of date-fns

const moodOptions = [
    {
        emoji: "😄",
        label: "Happy",
        value: "😄",
        color: "from-yellow-400 to-orange-400",
        score: 5,
    },
    {
        emoji: "😊",
        label: "Content",
        value: "😊",
        color: "from-green-400 to-emerald-400",
        score: 4,
    },
    {
        emoji: "😐",
        label: "Neutral",
        value: "😐",
        color: "from-gray-400 to-slate-400",
        score: 3,
    },
    {
        emoji: "😢",
        label: "Sad",
        value: "😢",
        color: "from-blue-400 to-indigo-400",
        score: 2,
    },
    {
        emoji: "😠",
        label: "Angry",
        value: "😠",
        color: "from-red-400 to-pink-400",
        score: 1,
    },
    {
        emoji: "😰",
        label: "Anxious",
        value: "😰",
        color: "from-purple-400 to-violet-400",
        score: 1,
    },
];

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState("");
    const [journal, setJournal] = useState("");
    const [moodLogs, setMoodLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");
    const [showJournal, setShowJournal] = useState(false);

    const fetchMoodLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/mood/logs", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            if (response.ok) {
                setMoodLogs(data);
            }
        } catch (error) {
            console.error("❌ Failed to fetch mood logs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMoodLogs();
    }, [fetchMoodLogs]);

    const handleSubmit = async () => {
        if (!selectedMood) return;
        setSubmitLoading(true);
        setWarning("");
        setSuccess("");
        try {
            const response = await fetch("/api/mood/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    emoji: selectedMood,
                    journal: journal || undefined,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess("Mood logged successfully! 🎉");
                setSelectedMood("");
                setJournal("");
                setShowJournal(false);
                fetchMoodLogs();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setWarning(data.error || "Failed to log mood");
            }
        } catch (error) {
            console.error("❌ Error logging mood:", error);
            setWarning("Failed to log mood. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const downloadCSV = () => {
        const csvContent = [
            ["Date", "Mood", "Journal"],
            ...moodLogs.map((log) => [
                new Date(log.date).toLocaleString(),
                log.emoji,
                log.journal || "",
            ]),
        ]
            .map((row) => row.map((value) => `"${value}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mood_history.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Helper functions using native Date methods
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-CA"); // Returns YYYY-MM-DD format
    };

    const isToday = (date) => {
        const today = new Date();
        const checkDate = new Date(date);
        return formatDate(today) === formatDate(checkDate);
    };

    // Generate calendar heatmap data
    const generateCalendarData = () => {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 5);
        const endDate = new Date();

        const days = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days.map((day) => {
            const dayStr = formatDate(day);
            const logForDay = moodLogs.find(
                (log) => formatDate(new Date(log.date)) === dayStr
            );

            return {
                date: dayStr,
                mood: logForDay?.emoji || null,
                hasLog: !!logForDay,
                journal: logForDay?.journal || null,
            };
        });
    };

    const calendarData = generateCalendarData();
    const todaysMood = moodLogs.find((log) => isToday(new Date(log.date)));

    const getCurrentStreak = () => {
        if (!moodLogs.length) return 0;
        // Sort logs by date descending
        const sortedLogs = [...moodLogs].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
        let streak = 0;
        let prevDate = new Date();
        prevDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedLogs.length; i++) {
            const logDate = new Date(sortedLogs[i].date);
            logDate.setHours(0, 0, 0, 0);

            if (i === 0) {
                // Today or yesterday starts the streak
                if (
                    logDate.getTime() === prevDate.getTime() ||
                    logDate.getTime() === prevDate.getTime() - 24 * 60 * 60 * 1000
                ) {
                    streak = 1;
                } else {
                    break;
                }
            } else {
                // Check if previous log is exactly one day after current log
                if (prevDate.getTime() - logDate.getTime() === 24 * 60 * 60 * 1000) {
                    streak++;
                } else {
                    break;
                }
            }
            prevDate = logDate;
        }
        return streak;
    };
    const currentStreak = getCurrentStreak();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl font-black mb-3 flex items-center gap-2 justify-center text-center">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                            Mood Tracker
                        </span>
                        <span className="text-black dark:text-white">🧠✨</span>
                    </h1>

                    <p className="text-gray-600 text-lg font-medium">
                        Track your emotions and build mindful habits
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Streak</h3>
                                <p className="text-2xl font-black text-orange-600">
                                    {currentStreak}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">days in a row</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Total Logs</h3>
                                <p className="text-2xl font-black text-green-600">
                                    {moodLogs.length}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">mood entries</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Today</h3>
                                <p className="text-2xl font-black">
                                    {todaysMood?.emoji || "😊"}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">current mood</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">XP Earned</h3>
                                <p className="text-2xl font-black text-purple-600">
                                    {moodLogs.length * 25}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">experience points</p>
                    </motion.div>
                </div>

                {/* Mood Logger */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        How are you feeling today?
                    </h2>

                    {/* Mood Selection */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {moodOptions.map((mood, index) => (
                            <motion.button
                                key={mood.value}
                                onClick={() => setSelectedMood(mood.value)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-2xl border-2 transition-all ${selectedMood === mood.value
                                    ? `bg-gradient-to-r ${mood.color} text-white border-white shadow-lg`
                                    : "bg-white/50 border-gray-200 hover:border-gray-300 shadow-md"
                                    }`}
                            >
                                <div className="text-3xl mb-2">{mood.emoji}</div>
                                <div className="text-sm font-semibold">{mood.label}</div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Journal Toggle */}
                    <motion.button
                        onClick={() => setShowJournal(!showJournal)}
                        className="mb-4 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Sparkles className="w-4 h-4" />
                        {showJournal ? "Hide" : "Add"} Journal Entry
                    </motion.button>

                    {/* Journal Input */}
                    <AnimatePresence>
                        {showJournal && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6"
                            >
                                <textarea
                                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none transition-all"
                                    rows={4}
                                    placeholder="What's on your mind? (Optional)"
                                    value={journal}
                                    onChange={(e) => setJournal(e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Alerts */}
                    <AnimatePresence>
                        {warning && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl"
                            >
                                {warning}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-xl"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                        onClick={handleSubmit}
                        disabled={!selectedMood || submitLoading}
                        whileHover={{ scale: selectedMood ? 1.02 : 1 }}
                        whileTap={{ scale: selectedMood ? 0.98 : 1 }}
                        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${selectedMood
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {submitLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Logging Mood...
                            </div>
                        ) : (
                            "Log My Mood ✨"
                        )}
                    </motion.button>
                </motion.div>

                {/* Calendar Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-indigo-500" />
                            Mood Calendar
                        </h3>
                        <motion.button
                            onClick={downloadCSV}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </motion.button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-sm font-semibold text-gray-600 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                            {calendarData.map((day, index) => (
                                <motion.div
                                    key={day.date}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.01 }}
                                    className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${day.hasLog
                                        ? "border-indigo-300 bg-gradient-to-r from-indigo-100 to-purple-100 shadow-md"
                                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                        }`}
                                    title={day.hasLog ? `${day.date}: ${day.mood}` : day.date}
                                >
                                    {day.hasLog ? (
                                        <span className="text-lg">{day.mood}</span>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            {new Date(day.date).getDate()}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recent Mood Logs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-8"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-indigo-500" />
                        Recent Mood Logs
                    </h3>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-gray-200 rounded-2xl h-20"
                                ></div>
                            ))}
                        </div>
                    ) : moodLogs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🌟</div>
                            <p className="text-gray-500 text-lg">No mood logs yet!</p>
                            <p className="text-gray-400">
                                Start tracking your emotions above.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {moodLogs.slice(0, 10).map((log, index) => (
                                <motion.div
                                    key={log._id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl shadow-md border border-gray-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">{log.emoji}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-gray-600">
                                                    {new Date(log.date).toLocaleDateString(undefined, {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(log.date).toLocaleTimeString(undefined, {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                </span>
                                            </div>
                                            {log.journal && (
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {log.journal}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MoodTracker;
