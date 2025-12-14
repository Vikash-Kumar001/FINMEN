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
    TrendingUp,
    Star,
    Globe,
    X,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logActivity } from "../../services/activityService";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { getHolidays, getAvailableCountries, getHolidayEmoji, getHolidayColor } from "../../services/holidaysService";

const MoodTracker = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const socketContext = useSocket();
    const socket = socketContext?.socket || null;

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
    const [currentStreak, setCurrentStreak] = useState(0);
    const [totalLogs, setTotalLogs] = useState(0);
    const [todaysMoodState, setTodaysMoodState] = useState(null);
    const [totalXP, setTotalXP] = useState(0);
    const [holidays, setHolidays] = useState(new Map());
    const [availableCountries, setAvailableCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([
        'US', 'IN', 'GB', 'CA', 'AU', // Original popular countries
        'DE', 'FR', 'JP', 'CN', 'BR', // Major economies
        'MX', 'IT', 'ES', 'KR', 'AE', // More diverse regions
        'NL', 'SE', 'NO', 'DK', 'FI', // Nordic countries
        'SG', 'MY', 'TH', 'PH', 'VN', // Southeast Asia
        'ZA', 'EG', 'NG', 'KE', 'MA', // Africa
        'AR', 'CL', 'CO', 'PE', 'CH', // Latin America & Switzerland
        'NZ', 'IE', 'PT', 'GR', 'TR', // More diverse
        'PL', 'CZ', 'HU', 'RO', 'BE'  // Eastern Europe
    ]); // Default: 40 countries for maximum festival coverage
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [loadingHolidays, setLoadingHolidays] = useState(false);
    const [showCountrySelector, setShowCountrySelector] = useState(false);
    
    useEffect(() => {
        // Fetch mood options from API
        const fetchMoodOptions = async () => {
            try {
                const response = await api.get('/api/mood/options');
                setMoodOptions(response.data);
            } catch (error) {
                console.error('Error fetching mood options:', error);
                // Default options are already set in the state
            }
        };
        
        fetchMoodOptions();
    }, []);

    // Helper function to calculate streak from mood logs
    const calculateStreakFromLogs = useCallback((logs) => {
        if (!logs || logs.length === 0) return 0;
        
        // Get unique dates (one mood per day counts)
        const dateSet = new Set();
        logs.forEach(log => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);
            dateSet.add(logDate.getTime());
        });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        
        // Check if we have a log for today or yesterday
        const hasToday = dateSet.has(todayTime);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayTime = yesterday.getTime();
        const hasYesterday = dateSet.has(yesterdayTime);
        
        // If no log for today or yesterday, streak is 0
        if (!hasToday && !hasYesterday) return 0;
        
        // Start counting from today or yesterday
        let streak = 0;
        let checkDate = hasToday ? new Date(today) : new Date(yesterday);
        
        // Count consecutive days going backwards
        while (true) {
            const checkTime = checkDate.getTime();
            
            if (dateSet.has(checkTime)) {
                streak++;
                // Move to previous day
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // Streak broken - missing day found
                break;
            }
            
            // Safety check to prevent infinite loop
            if (streak > 365) break;
        }
        
        return streak;
    }, []);

    // Fetch user's actual total XP
    const fetchUserXP = useCallback(async () => {
        try {
            const response = await api.get("/api/stats/student");
            if (response.data && response.data.xp !== undefined) {
                setTotalXP(response.data.xp);
            }
        } catch (error) {
            console.error("❌ Failed to fetch user XP:", error);
            // Fallback to progress endpoint
            try {
                const progressResponse = await api.get("/api/progress");
                if (progressResponse.data && progressResponse.data.xp !== undefined) {
                    setTotalXP(progressResponse.data.xp);
                }
            } catch (progressError) {
                console.error("❌ Failed to fetch user progress:", progressError);
            }
        }
    }, []);

    const fetchMoodLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/mood/logs");
            const logs = response.data;
            setMoodLogs(logs);
            setTotalLogs(logs.length);
            
            // Calculate streak from logs (will be updated by socket if available)
            const calculatedStreak = calculateStreakFromLogs(logs);
            if (calculatedStreak > 0 || currentStreak === 0) {
                setCurrentStreak(calculatedStreak);
            }
            
            // Find today's mood
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayMood = logs.find((log) => {
                const logDate = new Date(log.date);
                logDate.setHours(0, 0, 0, 0);
                return logDate.getTime() === today.getTime();
            });
            setTodaysMoodState(todayMood || null);
        } catch (error) {
            console.error("❌ Failed to fetch mood logs:", error);
        } finally {
            setLoading(false);
        }
    }, [calculateStreakFromLogs, currentStreak]);

    // Real-time socket integration
    useEffect(() => {
        if (!socket || !user?._id) return;

        // Subscribe to mood updates
        const subscribeToMood = () => {
            if (socket && socket.connected && user?._id) {
                socket.emit('student:mood:subscribe', { studentId: user._id });
            } else if (socket) {
                socket.on('connect', () => {
                    if (user?._id) {
                        socket.emit('student:mood:subscribe', { studentId: user._id });
                    }
                });
            }
        };

        subscribeToMood();

        // Handle real-time stats updates (XP, level, etc.)
        const handleStatsUpdate = (data) => {
            if (data.userId === (user?._id || user?.id)) {
                if (data.xp !== undefined) {
                    setTotalXP(data.xp);
                }
            }
        };

        // Handle mood data updates
        const handleMoodData = (data) => {
            if (data.recentMoods) {
                setMoodLogs(data.recentMoods);
            }
            if (data.streak !== undefined) {
                setCurrentStreak(data.streak);
            }
            if (data.totalLogs !== undefined) {
                setTotalLogs(data.totalLogs);
            }
            if (data.todayMood !== undefined) {
                setTodaysMoodState(data.todayMood);
            }
        };

        // Handle new mood logged
        const handleMoodLogged = (data) => {
            if (data.userId === (user?._id || user?.id)) {
                // Update streak and total logs
                if (data.streak !== undefined) {
                    setCurrentStreak(data.streak);
                }
                if (data.totalLogs !== undefined) {
                    setTotalLogs(data.totalLogs);
                }
                
                // Update today's mood if available
                if (data.todayMood) {
                    setTodaysMoodState(data.todayMood);
                } else if (data.mood) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const moodDate = new Date(data.mood.date);
                    moodDate.setHours(0, 0, 0, 0);
                    
                    if (moodDate.getTime() === today.getTime()) {
                        setTodaysMoodState(data.mood);
                    }
                }
                
                // Refresh mood logs and XP
                fetchMoodLogs();
                fetchUserXP();
            }
        };

        socket.on('stats:updated', handleStatsUpdate);
        socket.on('student:mood:data', handleMoodData);
        socket.on('mood:logged', handleMoodLogged);

        return () => {
            socket.off('stats:updated', handleStatsUpdate);
            socket.off('student:mood:data', handleMoodData);
            socket.off('mood:logged', handleMoodLogged);
            socket.off('connect', subscribeToMood);
        };
    }, [socket, user, fetchMoodLogs]);

    // Fetch holidays
    const fetchHolidays = useCallback(async () => {
        try {
            setLoadingHolidays(true);
            const year = new Date().getFullYear();
            const holidayMap = new Map();
            let successCount = 0;
            let failCount = 0;
            
            // Fetch holidays for each selected country
            for (const countryCode of selectedCountries) {
                try {
                    const countryHolidays = await getHolidays(countryCode, year);
                    if (countryHolidays && countryHolidays.length > 0) {
                        countryHolidays.forEach(holiday => {
                            const dateKey = formatDate(holiday.date);
                            if (!holidayMap.has(dateKey)) {
                                holidayMap.set(dateKey, []);
                            }
                            holidayMap.get(dateKey).push({
                                ...holiday,
                                countryCode,
                                emoji: getHolidayEmoji(holiday.name),
                                color: getHolidayColor(holiday.name),
                            });
                        });
                        successCount++;
                    } else {
                        failCount++;
                    }
                } catch (countryError) {
                    // Individual country error - continue with others
                    failCount++;
                    console.warn(`Failed to fetch holidays for ${countryCode}:`, countryError);
                }
            }
            
            setHolidays(holidayMap);
            
            // Only show error if all countries failed
            if (successCount === 0 && failCount > 0) {
                toast.error("Unable to load holidays. Please try again later.");
            } else if (failCount > 0) {
                toast.success(`Loaded holidays from ${successCount} ${successCount === 1 ? 'country' : 'countries'}`);
            }
        } catch (error) {
            console.error("Error fetching holidays:", error);
            // Don't show error toast if it's just API issues - calendar still works
        } finally {
            setLoadingHolidays(false);
        }
    }, [selectedCountries]);

    // Fetch available countries
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countries = await getAvailableCountries();
                setAvailableCountries(countries);
            } catch (error) {
                console.error("Error loading countries:", error);
            }
        };
        loadCountries();
    }, []);

    useEffect(() => {
        // Log page view when component mounts
        logActivity({
            activityType: "page_view",
            description: "Viewed mood tracker page"
        });
        
        fetchMoodLogs();
        fetchUserXP();
        fetchHolidays();
    }, [fetchMoodLogs, fetchUserXP, fetchHolidays]);

    const handleSubmit = async () => {
        if (!selectedMood) {
            toast.error("Please select a mood first!");
            return;
        }
        
        if (!journal || journal.trim() === "") {
            toast.error("Journal entry is required! Please share what's on your mind.");
            return;
        }
        
        setSubmitLoading(true);
        try {
            const response = await api.post("/api/mood/log", {
                emoji: selectedMood,
                journal: journal.trim(),
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
                
                // Update stats immediately for instant feedback
                if (response.data.mood) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const moodDate = new Date(response.data.mood.date);
                    moodDate.setHours(0, 0, 0, 0);
                    
                    if (moodDate.getTime() === today.getTime()) {
                        setTodaysMoodState(response.data.mood);
                    }
                }
                
                // Update total logs if it's a new log (not an update)
                if (!response.data.isUpdate) {
                    setTotalLogs(prev => prev + 1);
                }
                
                // Update streak from response if available
                if (response.data.streak !== undefined) {
                    setCurrentStreak(response.data.streak);
                }
                
                // Update total XP from response if available
                if (response.data.totalXP !== undefined) {
                    setTotalXP(response.data.totalXP);
                } else if (response.data.newXP !== undefined) {
                    setTotalXP(response.data.newXP);
                } else if (response.data.xpEarned) {
                    // Optimistic update - will be confirmed by socket event
                    setTotalXP(prev => prev + response.data.xpEarned);
                }
                
                // Refresh XP to get accurate value (socket will also update)
                setTimeout(() => {
                    fetchUserXP();
                }, 500);
                
                // Show professional toast notification
                if (response.data.xpEarned) {
                    toast.success(
                        (t) => (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl shadow-lg">
                                    {selectedMood}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">Mood Logged Successfully!</p>
                                    <p className="text-white/90 text-xs">+{response.data.xpEarned} XP Earned</p>
                                </div>
                            </div>
                        ),
                        {
                            duration: 4000,
                            position: "top-center",
                            style: {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            },
                            icon: '🎉',
                        }
                    );
                } else {
                    toast.success(
                        response.data.isUpdate 
                            ? "Mood updated successfully! ✨" 
                            : "Mood logged successfully! 🎉",
                        {
                            duration: 3000,
                            position: "top-center",
                        }
                    );
                }
                
                setSelectedMood("");
                setJournal("");
                
                // Refresh mood logs (socket will also update in real-time)
                setTimeout(() => {
                    fetchMoodLogs();
                }, 500);
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
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // Get first day of current month
        const firstDay = new Date(year, month, 1);
        // Get last day of current month
        const lastDay = new Date(year, month + 1, 0);
        
        // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = firstDay.getDay();
        
        // Start from the Sunday of the week that contains the first day
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDayOfWeek);
        
        // End on the Saturday of the week that contains the last day
        const lastDayOfWeek = lastDay.getDay();
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDayOfWeek));

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
            
            // Get holidays for this day
            const dayHolidays = holidays.get(dayStr) || [];
            
            // Deduplicate holidays by name (case-insensitive)
            const uniqueHolidaysMap = new Map();
            dayHolidays.forEach(holiday => {
                const holidayKey = holiday.name.toLowerCase().trim();
                if (!uniqueHolidaysMap.has(holidayKey)) {
                    uniqueHolidaysMap.set(holidayKey, {
                        ...holiday,
                        countries: [holiday.countryCode],
                        count: 1
                    });
                } else {
                    // Add country to existing holiday
                    const existing = uniqueHolidaysMap.get(holidayKey);
                    if (!existing.countries.includes(holiday.countryCode)) {
                        existing.countries.push(holiday.countryCode);
                        existing.count++;
                    }
                }
            });
            
            const uniqueHolidays = Array.from(uniqueHolidaysMap.values());
            
            // Check if this day is in the current month
            const isCurrentMonth = day.getMonth() === month && day.getFullYear() === year;

            return {
                date: dayStr,
                mood: logForDay?.emoji || null,
                hasLog: !!logForDay,
                journal: logForDay?.journal || null,
                isCurrentMonth,
                holidays: uniqueHolidays,
                allHolidays: dayHolidays, // Keep original for modal
                hasHolidays: uniqueHolidays.length > 0,
            };
        });
    };

    const calendarData = generateCalendarData();
    // Use state for today's mood (real-time) or fallback to finding in logs
    const todaysMood = todaysMoodState || moodLogs.find((log) => isToday(new Date(log.date)));
    
    // Check if mood already logged today
    const hasLoggedToday = !!todaysMood;
    
    // Get the display mood: selected mood (preview) or today's logged mood
    const displayMood = selectedMood || todaysMood?.emoji || "😊";

    // Calculate streak from current mood logs (fallback if socket doesn't provide it)
    const calculatedStreak = calculateStreakFromLogs(moodLogs);
    const displayStreak = currentStreak > 0 ? currentStreak : calculatedStreak;

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
                                    <motion.p 
                                        key={displayStreak}
                                        initial={{ scale: 1.2, color: "#ea580c" }}
                                        animate={{ scale: 1, color: "#ea580c" }}
                                        transition={{ duration: 0.3 }}
                                        className="text-2xl font-black text-orange-600"
                                    >
                                        {displayStreak}
                                    </motion.p>
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
                                    <motion.p 
                                        key={totalLogs || moodLogs.length}
                                        initial={{ scale: 1.2, color: "#16a34a" }}
                                        animate={{ scale: 1, color: "#16a34a" }}
                                        transition={{ duration: 0.3 }}
                                        className="text-2xl font-black text-green-600"
                                    >
                                        {totalLogs || moodLogs.length}
                                    </motion.p>
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
                                    <motion.p 
                                        key={displayMood}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 15
                                        }}
                                        className="text-2xl font-black"
                                    >
                                        {displayMood}
                                    </motion.p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {selectedMood ? "preview" : "current mood"}
                            </p>
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
                                    <h3 className="text-lg font-bold text-gray-800">Total XP</h3>
                                    <motion.p 
                                        key={totalXP}
                                        initial={{ scale: 1.2, color: "#9333ea" }}
                                        animate={{ scale: 1, color: "#9333ea" }}
                                        transition={{ duration: 0.3 }}
                                        className="text-2xl font-black text-purple-600"
                                    >
                                        {totalXP.toLocaleString()}
                                    </motion.p>
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
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                How are you feeling today?
                            </h2>
                            {hasLoggedToday && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
                                >
                                    <Star className="w-4 h-4" />
                                    <span>Logged Today</span>
                                </motion.div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                            {moodOptions.map((mood, index) => (
                                <motion.div
                                    key={mood.value}
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.button
                                        onClick={() => setSelectedMood(mood.value)}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                                            selectedMood === mood.value
                                                ? `bg-gradient-to-r ${mood.color} text-white border-white shadow-xl`
                                                : "bg-white/80 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
                                        }`}
                                        animate={selectedMood === mood.value ? {
                                            scale: [1, 1.05, 1],
                                            boxShadow: [
                                                "0 4px 6px rgba(0,0,0,0.1)",
                                                "0 10px 25px rgba(0,0,0,0.2)",
                                                "0 4px 6px rgba(0,0,0,0.1)"
                                            ]
                                        } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {selectedMood === mood.value && (
                                            <motion.div
                                                className="absolute inset-0 bg-white/20"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: [0, 1.2, 1], opacity: [0, 0.3, 0] }}
                                                transition={{ duration: 0.6 }}
                                            />
                                        )}
                                        <div className="relative z-10">
                                            <motion.div 
                                                className="text-4xl mb-2"
                                                animate={selectedMood === mood.value ? {
                                                    rotate: [0, -10, 10, -10, 0],
                                                    scale: [1, 1.2, 1]
                                                } : {}}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {mood.emoji}
                                            </motion.div>
                                            <div className="text-sm font-semibold">{mood.label}</div>
                                        </div>
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Journal Entry <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none transition-all"
                                rows={4}
                                placeholder="What's on your mind? Share your thoughts and feelings..."
                                value={journal}
                                onChange={(e) => setJournal(e.target.value)}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Required: Please share what's on your mind</p>
                        </div>

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
                                                <li>Add a journal entry to record your thoughts (required)</li>
                                                <li>Track your mood daily to maintain your streak</li>
                                                <li>View your mood patterns in the calendar view</li>
                                                <li>Earn XP points for consistent tracking</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            onClick={handleSubmit}
                            disabled={!selectedMood || !journal || journal.trim() === "" || submitLoading}
                            whileHover={!selectedMood || !journal || journal.trim() === "" || submitLoading ? {} : { 
                                scale: 1.01,
                                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)"
                            }}
                            whileTap={!selectedMood || !journal || journal.trim() === "" || submitLoading ? {} : { scale: 0.99 }}
                            className="w-full py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 rounded-xl shadow-md hover:shadow-lg relative overflow-hidden group"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {submitLoading ? (
                                    <>
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                        />
                                        <span>Logging Mood...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Log My Mood</span>
                                        <motion.div
                                            animate={selectedMood ? {
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1]
                                            } : {}}
                                            transition={{
                                                duration: 0.5,
                                                repeat: selectedMood ? Infinity : 0,
                                                repeatDelay: 2
                                            }}
                                        >
                                            <Sparkles className="w-5 h-5" />
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-purple-100 mb-8 relative overflow-hidden"
                >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    repeatDelay: 3
                                }}
                            >
                                <Calendar className="w-8 h-8 text-indigo-500" />
                            </motion.div>
                            <h3 className="text-2xl font-black text-gray-800 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Mood Calendar
                            </h3>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200"
                            >
                                <p className="text-base font-bold text-purple-700">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </motion.div>
                            <motion.button
                                onClick={() => setShowCountrySelector(!showCountrySelector)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="font-semibold">Countries</span>
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{selectedCountries.length}</span>
                            </motion.button>
                            <motion.button
                                onClick={downloadCSV}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                <span className="font-semibold">Export</span>
                            </motion.button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 gap-3 mb-4">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                                    <motion.div
                                        key={day}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="text-center text-sm font-bold text-gray-700 py-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg"
                                    >
                                        {day}
                                    </motion.div>
                                ))}
                                {calendarData.map((day, index) => {
                                    // Get mood color based on emoji
                                    const getMoodColor = (emoji) => {
                                        if (!emoji) return null;
                                        const moodColors = {
                                            '😄': 'from-yellow-200 via-orange-200 to-pink-200 border-yellow-300',
                                            '😊': 'from-green-200 via-emerald-200 to-teal-200 border-green-300',
                                            '😐': 'from-gray-200 via-slate-200 to-zinc-200 border-gray-300',
                                            '😢': 'from-blue-200 via-indigo-200 to-purple-200 border-blue-300',
                                            '😠': 'from-red-200 via-rose-200 to-pink-200 border-red-300',
                                            '😰': 'from-purple-200 via-violet-200 to-fuchsia-200 border-purple-300'
                                        };
                                        return moodColors[emoji] || 'from-indigo-200 to-purple-200 border-indigo-300';
                                    };
                                    
                                    const moodColor = day.hasLog ? getMoodColor(day.mood) : null;
                                    const isToday = formatDate(new Date()) === day.date;
                                    
                                    return (
                                        <motion.div
                                            key={day.date}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.01, type: "spring", stiffness: 100 }}
                                            whileHover={day.isCurrentMonth ? { 
                                                scale: 1.08, 
                                                y: -4,
                                                zIndex: 10,
                                                transition: { duration: 0.2, ease: "easeOut" }
                                            } : {}}
                                            whileTap={day.isCurrentMonth ? { scale: 0.98 } : {}}
                                            className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ease-out relative overflow-hidden group ${
                                                !day.isCurrentMonth 
                                                    ? "border-transparent bg-transparent opacity-20"
                                                    : day.hasHolidays && !day.hasLog
                                                    ? "border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md"
                                                    : day.hasLog && moodColor
                                                    ? `bg-gradient-to-br ${moodColor} shadow-lg`
                                                    : isToday
                                                    ? "border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md"
                                                    : "border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm"
                                            }`}
                                            title={
                                                day.hasHolidays 
                                                    ? `${day.date}\n${day.holidays.map(h => `${h.emoji} ${h.name}`).join('\n')}${day.hasLog ? `\nMood: ${day.mood}` : ''}`
                                                    : day.hasLog 
                                                    ? `${day.date}: ${day.mood}${day.journal ? ` - ${day.journal}` : ''}` 
                                                    : day.date
                                            }
                                            onClick={() => {
                                                if (day.hasHolidays && day.holidays.length > 0) {
                                                    // Use allHolidays for modal to show all countries, but group by name
                                                    setSelectedHoliday({ 
                                                        date: day.date, 
                                                        holidays: day.holidays,
                                                        allHolidays: day.allHolidays || day.holidays
                                                    });
                                                }
                                            }}
                                        >
                                            {/* Sparkle effect for days with mood logs */}
                                            {day.hasLog && (
                                                <motion.div
                                                    className="absolute top-1 right-1"
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.5, 1, 0.5]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                                </motion.div>
                                            )}
                                            
                                            {/* Today indicator */}
                                            {isToday && day.isCurrentMonth && (
                                                <motion.div
                                                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            )}
                                            
                                            {day.hasLog ? (
                                                <motion.span 
                                                    className="text-2xl relative z-10"
                                                    animate={{
                                                        scale: [1, 1.15, 1]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        repeatDelay: 2
                                                    }}
                                                    whileHover={{ scale: 1.3, rotate: 360 }}
                                                >
                                                    {day.mood}
                                                </motion.span>
                                            ) : day.hasHolidays ? (
                                                <div className="flex flex-col items-center gap-1 relative z-10">
                                                    <span className="text-lg">{day.holidays[0].emoji}</span>
                                                    {day.holidays.length > 1 && (
                                                        <span className="text-[8px] font-bold text-orange-600 bg-orange-100 px-1 rounded">
                                                            +{day.holidays.length - 1}
                                                        </span>
                                                    )}
                                                    {day.holidays[0].count > 1 && (
                                                        <span className="text-[7px] font-semibold text-orange-700 bg-orange-200 px-1 rounded">
                                                            {day.holidays[0].count}×
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={`text-sm font-semibold relative z-10 ${
                                                    isToday 
                                                        ? "text-indigo-600 font-bold" 
                                                        : day.isCurrentMonth 
                                                        ? "text-gray-700 group-hover:text-indigo-600" 
                                                        : "text-gray-300"
                                                }`}>
                                                    {new Date(day.date).getDate()}
                                                </span>
                                            )}
                                            
                                            {/* Holiday indicator badge */}
                                            {day.hasHolidays && (
                                                <motion.div
                                                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2"
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        opacity: [0.7, 1, 0.7]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                </motion.div>
                                            )}
                                            
                                            {/* Hover effect overlay */}
                                            {day.isCurrentMonth && (
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 rounded-xl"
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ 
                                                        opacity: 1,
                                                        background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
                                                        transition: { duration: 0.15, ease: "easeOut" }
                                                    }}
                                                />
                                            )}
                                            
                                            {/* Hover glow effect */}
                                            {day.isCurrentMonth && (
                                                <motion.div
                                                    className="absolute -inset-0.5 rounded-xl pointer-events-none opacity-0"
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ 
                                                        opacity: 1,
                                                        background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
                                                        transition: { duration: 0.15, ease: "easeOut" }
                                                    }}
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            
                            {/* Mood Legend */}
                            {moodLogs.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="mt-6 pt-6 border-t border-purple-200 relative z-10"
                                >
                                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        Your Mood Colors
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {moodOptions.map((mood) => {
                                            const hasThisMood = moodLogs.some(log => log.emoji === mood.value);
                                            if (!hasThisMood) return null;
                                            
                                            const moodColorMap = {
                                                '😄': 'from-yellow-200 to-orange-200',
                                                '😊': 'from-green-200 to-emerald-200',
                                                '😐': 'from-gray-200 to-slate-200',
                                                '😢': 'from-blue-200 to-indigo-200',
                                                '😠': 'from-red-200 to-rose-200',
                                                '😰': 'from-purple-200 to-violet-200'
                                            };
                                            
                                            return (
                                                <motion.div
                                                    key={mood.value}
                                                    whileHover={{ scale: 1.1 }}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${moodColorMap[mood.value] || 'from-gray-200 to-gray-300'} border border-white/50 shadow-sm`}
                                                >
                                                    <span className="text-lg">{mood.emoji}</span>
                                                    <span className="text-xs font-semibold text-gray-700">{mood.label}</span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                    
                    {/* Country Selector */}
                    <AnimatePresence>
                        {showCountrySelector && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-6 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-200 relative z-10"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-indigo-500" />
                                        Select Countries for Holidays
                                    </h4>
                                    <button
                                        onClick={() => setShowCountrySelector(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {availableCountries.map((country) => (
                                            <motion.button
                                                key={country.countryCode}
                                                onClick={() => {
                                                    if (selectedCountries.includes(country.countryCode)) {
                                                        setSelectedCountries(prev => prev.filter(c => c !== country.countryCode));
                                                    } else {
                                                        setSelectedCountries(prev => [...prev, country.countryCode]);
                                                    }
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`p-2 rounded-lg border-2 transition-all text-sm font-semibold ${
                                                    selectedCountries.includes(country.countryCode)
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                                                }`}
                                            >
                                                {country.name}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        {selectedCountries.length} {selectedCountries.length === 1 ? 'country' : 'countries'} selected
                                    </p>
                                    <motion.button
                                        onClick={() => {
                                            fetchHolidays();
                                            setShowCountrySelector(false);
                                            toast.success(`Holidays updated for ${selectedCountries.length} countries!`);
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg"
                                    >
                                        Apply
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                
                {/* Holiday Details Modal */}
                <AnimatePresence>
                    {selectedHoliday && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedHoliday(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold">
                                            {new Date(selectedHoliday.date).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                month: 'long', 
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedHoliday(null)}
                                            className="text-white hover:text-gray-200 transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-6 overflow-y-auto max-h-[60vh]">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                        Festivals & Holidays ({selectedHoliday.holidays.length} unique)
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedHoliday.holidays.map((holiday, idx) => {
                                            // Get all countries for this holiday from allHolidays
                                            const allCountriesForHoliday = (selectedHoliday.allHolidays || selectedHoliday.holidays)
                                                .filter(h => h.name.toLowerCase().trim() === holiday.name.toLowerCase().trim())
                                                .map(h => h.countryCode);
                                            
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className={`p-4 rounded-xl border-2 bg-gradient-to-r ${holiday.color || 'from-purple-100 to-pink-100'} border-white/50 shadow-sm`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-3xl">{holiday.emoji}</span>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h5 className="font-bold text-gray-800">
                                                                    {holiday.name}
                                                                </h5>
                                                                {holiday.count > 1 && (
                                                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                                                        {holiday.count} countries
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
                                                                <Globe className="w-4 h-4 flex-shrink-0" />
                                                                <div className="flex flex-wrap gap-1">
                                                                    {allCountriesForHoliday.slice(0, 10).map((code, i) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold">
                                                                            {code}
                                                                        </span>
                                                                    ))}
                                                                    {allCountriesForHoliday.length > 10 && (
                                                                        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-semibold">
                                                                            +{allCountriesForHoliday.length - 10} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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