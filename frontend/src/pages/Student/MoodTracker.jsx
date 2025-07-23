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
    Info,
    Settings,
    HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logActivity } from "../../services/activityService";
import { toast } from "react-toastify";
import api from "../../utils/api";

const MoodTracker = () => {
    const navigate = useNavigate();

    const [moodOptions, setMoodOptions] = useState([
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
    ]);
    
    const [selectedMood, setSelectedMood] = useState("");
    const [journal, setJournal] = useState("");
    const [moodLogs, setMoodLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    
    useEffect(() => {
        // Fetch mood options from API
        const fetchMoodOptions = async () => {
            try {
                const response = await api.get('/api/moods/options');
                setMoodOptions(response.data);
            } catch (error) {
                console.error('Error fetching mood options:', error);
                // Default options are already set in the state
            }
        };
        
        fetchMoodOptions();
    }, []);

    const fetchMoodLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/mood/logs");
            setMoodLogs(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch mood logs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Log page view when component mounts
        logActivity({
            activityType: "page_view",
            description: "Viewed mood tracker page"
        });
        
        fetchMoodLogs();
    }, [fetchMoodLogs]);

    const handleSubmit = async () => {
        if (!selectedMood) return;
        setSubmitLoading(true);
        try {
            const response = await api.post("/api/mood/log", {
                emoji: selectedMood,
                journal: journal || undefined,
            });
            
            if (response.status === 200 || response.status === 201) {
                // Find the mood option details for the selected mood
                const selectedMoodDetails = moodOptions.find(option => option.value === selectedMood);
                
                // Log mood tracking activity
                logActivity({
                    activityType: "wellness_activity",
                    description: `Logged mood: ${selectedMoodDetails?.label || selectedMood}`,
                    metadata: {
                        action: "log_mood",
                        mood: selectedMood,
                        moodLabel: selectedMoodDetails?.label || '',
                        moodScore: selectedMoodDetails?.score || 0,
                        hasJournal: !!journal,
                        journalLength: journal ? journal.length : 0,
                        timestamp: new Date().toISOString()
                    }
                });
                
                toast.success("Mood logged successfully! 🎉");
                setSelectedMood("");
                setJournal("");
                setShowJournal(false);
                fetchMoodLogs();
            } else {
                toast.error(response.data?.error || "Failed to log mood");
            }
        } catch (error) {
            console.error("❌ Error logging mood:", error);
            toast.error("Failed to log mood. Please try again.");
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
        const fileName = "mood_history.csv";
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Log download activity
        logActivity({
            activityType: "wellness_activity",
            description: "Downloaded mood history",
            metadata: {
                action: "download_mood_history",
                fileName: fileName,
                entryCount: moodLogs.length,
                dateRange: {
                    oldest: moodLogs.length > 0 ? new Date(Math.min(...moodLogs.map(log => new Date(log.date)))).toISOString() : null,
                    newest: moodLogs.length > 0 ? new Date(Math.max(...moodLogs.map(log => new Date(log.date)))).toISOString() : null
                }
            }
        });
        
        toast.success("Mood history downloaded successfully!");
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-CA"); // Returns YYYY-MM-DD format
    };

    const isToday = (date) => {
        const today = new Date();
        const checkDate = new Date(date);
        return formatDate(today) === formatDate(checkDate);
    };

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
                if (
                    logDate.getTime() === prevDate.getTime() ||
                    logDate.getTime() === prevDate.getTime() - 24 * 60 * 60 * 1000
                ) {
                    streak = 1;
                } else {
                    break;
                }
            } else {
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
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div
                        className="rounded-full bg-gray-200 p-2 cursor-pointer hover:bg-gray-300"
                        onClick={() => setShowHelp(!showHelp)}
                        title="Need help?"
                    >
                        <HelpCircle className="w-5 h-5 text-gray-600" />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl font-black mb-3 flex items-center gap-2 justify-center">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                            Mood Tracker
                        </span>
                        <span className="text-black">🧠✨</span>
                    </h1>
                    <p className="text-gray-600 text-lg font-medium">
                        Track your emotions and build mindful habits
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/90 backdrop-blur-sm p-6 border border-white/40 rounded-lg">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Streak</h3>
                                    <p className="text-2xl font-black text-orange-600">{currentStreak}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">days in a row</p>
                        </motion.div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-6 border border-white/40 rounded-lg">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Total Logs</h3>
                                    <p className="text-2xl font-black text-green-600">{moodLogs.length}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">mood entries</p>
                        </motion.div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-6 border border-white/40 rounded-lg">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Today</h3>
                                    <p className="text-2xl font-black">{todaysMood?.emoji || "😊"}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">current mood</p>
                        </motion.div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-6 border border-white/40 rounded-lg">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">XP Earned</h3>
                                    <p className="text-2xl font-black text-purple-600">{moodLogs.length * 25}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">experience points</p>
                        </motion.div>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-xl p-8 border border-white/50 mb-8 rounded-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            How are you feeling today?
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                            {moodOptions.map((mood, index) => (
                                <motion.div
                                    key={mood.value}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <button
                                        onClick={() => setSelectedMood(mood.value)}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedMood === mood.value
                                            ? `bg-gradient-to-r ${mood.color} text-white border-white shadow-lg`
                                            : "bg-white/50 border-gray-200 hover:border-gray-300 shadow-md"
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{mood.emoji}</div>
                                        <div className="text-sm font-semibold">{mood.label}</div>
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowJournal(!showJournal)}
                            className="mb-4 text-indigo-600 hover:text-indigo-700 flex items-center gap-2 p-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            {showJournal ? "Hide" : "Add"} Journal Entry
                        </button>

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

                        <AnimatePresence>
                            {showHelp && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl"
                                >
                                    <div className="flex items-start gap-3">
                                        <HelpCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold mb-2">How to use the Mood Tracker</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                <li>Select an emoji that best represents your current mood</li>
                                                <li>Optionally add a journal entry to record your thoughts</li>
                                                <li>Track your mood daily to maintain your streak</li>
                                                <li>View your mood patterns in the calendar view</li>
                                                <li>Earn XP points for consistent tracking</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleSubmit}
                            disabled={!selectedMood || submitLoading}
                            className="w-full py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 rounded-lg"
                        >
                            {submitLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Logging Mood...</span>
                                </div>
                            ) : (
                                <span>Log My Mood ✨</span>
                            )}
                        </button>
                    </motion.div>
                </div>

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
                        <button
                            onClick={downloadCSV}
                            className="flex items-center gap-2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
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
                            <p className="text-gray-400">Start tracking your emotions above.</p>
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