import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReactMarkdown from "react-markdown";
import { logActivity } from "../../services/activityService";
import { toast } from "react-toastify";
import api from "../../utils/api";
import {
    BookOpen,
    Search,
    Filter,
    Download,
    Plus,
    Edit,
    Trash2,
    Calendar as CalendarIcon,
    Tag,
    Star,
    Heart,
    Sparkles,
    Save,
    X,
    FileText,
    Clock,
    Zap,
    Target,
    TrendingUp,
} from "lucide-react";

export default function Journal() {
    const [journalPrompts, setJournalPrompts] = useState([]);
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [draft, setDraft] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [editingEntry, setEditingEntry] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [stats, setStats] = useState({
        totalEntries: 0,
        currentStreak: 0,
        totalWords: 0,
        favoriteTag: "",
    });
    
    useEffect(() => {
        // Fetch journal prompts from API
        const fetchJournalPrompts = async () => {
            try {
                const response = await api.get('/api/journal/prompts');
                setJournalPrompts(response.data);
            } catch (error) {
                console.error('Error fetching journal prompts:', error);
                // Set default prompts if fetch fails
                setJournalPrompts([
                    "What are three things you're grateful for today?",
                    "Describe a moment that made you smile recently.",
                    "What's one thing you learned about yourself this week?",
                    "How did you overcome a challenge today?",
                    "What's your biggest goal right now and why?"
                ]);
            }
        };
        
        fetchJournalPrompts();
    }, []);

    const socket = useSocket();
    const { user } = useAuth();

    // Load draft from localStorage on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem("journalDraft");
        if (savedDraft) {
            setDraft(savedDraft);
        }
    }, []);

    // Socket setup
    useEffect(() => {
        if (socket && socket.socket && user) {
            // Log page view when component mounts
            logActivity({
                activityType: "page_view",
                description: "Viewed journal page"
            });
            
            try {
                socket.socket.emit("student:journal:subscribe", { studentId: user._id });
            } catch (err) {
                console.error("❌ Error subscribing to journal:", err.message);
            }

            try {
                socket.socket.on("student:journal:data", (data) => {
                    setEntries(data || []);
                    setLoading(false);
                    updateStats(data || []);
                });

                socket.socket.on("student:journal:update", (update) => {
                    setEntries((prev) => {
                        const updated = [
                            update,
                            ...prev.filter((entry) => entry._id !== update._id),
                        ];
                        updateStats(updated);
                        return updated;
                    });
                });

                socket.socket.on("student:journal:refresh", (data) => {
                    setEntries(data || []);
                    updateStats(data || []);
                });
            } catch (err) {
                console.error("❌ Error setting up journal event listeners:", err.message);
            }

            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off("student:journal:data");
                        socket.socket.off("student:journal:update");
                        socket.socket.off("student:journal:refresh");
                    }
                } catch (err) {
                    console.error("❌ Error removing journal event listeners:", err.message);
                }
            };
        }
    }, [socket, user]);

    // Auto-save draft
    useEffect(() => {
        if (draft) {
            localStorage.setItem("journalDraft", draft);
        }
    }, [draft]);

    // Update stats based on entries
    const updateStats = (entriesData) => {
        const totalEntries = entriesData.length;
        const totalWords = entriesData.reduce(
            (sum, entry) => sum + (entry.content?.split(" ").length || 0),
            0
        );

        // Calculate streak (simplified)
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const todayEntries = entriesData.filter(
            (entry) =>
                format(new Date(entry.createdAt), "yyyy-MM-dd") ===
                format(today, "yyyy-MM-dd")
        );
        const yesterdayEntries = entriesData.filter(
            (entry) =>
                format(new Date(entry.createdAt), "yyyy-MM-dd") ===
                format(yesterday, "yyyy-MM-dd")
        );

        const currentStreak =
            todayEntries.length > 0 ? (yesterdayEntries.length > 0 ? 2 : 1) : 0;

        // Find most used tag
        const tagCounts = {};
        entriesData.forEach((entry) => {
            entry.tags?.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        const favoriteTag = Object.keys(tagCounts).reduce(
            (a, b) => (tagCounts[a] > tagCounts[b] ? a : b),
            ""
        );

        setStats({
            totalEntries,
            currentStreak,
            totalWords,
            favoriteTag,
        });
    };

    const handleSaveEntry = () => {
        if (!draft.trim()) return;

        const payload = {
            title: title || "Untitled Entry",
            content: draft,
            tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        };

        if (editingEntry) {
            try {
                if (socket && socket.socket) {
                    socket.socket.emit("student:journal:update", {
                        studentId: user._id,
                        entryId: editingEntry._id,
                        payload,
                    });
                }
            } catch (err) {
                console.error("❌ Error updating journal entry:", err.message);
                toast.error("Failed to update journal entry. Please try again.");
                return;
            }
            
            // Log journal entry update activity
            logActivity({
                activityType: "learning_activity",
                description: `Updated journal entry: ${payload.title}`,
                metadata: {
                    action: "update_journal_entry",
                    entryId: editingEntry._id,
                    title: payload.title,
                    wordCount: payload.content.split(" ").length,
                    characterCount: payload.content.length,
                    tagCount: payload.tags.length,
                    tags: payload.tags
                }
            });
            
            toast.success("Journal entry updated successfully!");
        } else {
            try {
                if (socket && socket.socket) {
                    socket.socket.emit("student:journal:create", {
                        studentId: user._id,
                        payload,
                    });
                }
            } catch (err) {
                console.error("❌ Error creating journal entry:", err.message);
                toast.error("Failed to create journal entry. Please try again.");
                return;
            }
            
            // Log journal entry creation activity
            logActivity({
                activityType: "learning_activity",
                description: `Created new journal entry: ${payload.title}`,
                metadata: {
                    action: "create_journal_entry",
                    title: payload.title,
                    wordCount: payload.content.split(" ").length,
                    characterCount: payload.content.length,
                    tagCount: payload.tags.length,
                    tags: payload.tags
                }
            });
            
            toast.success("Journal entry created successfully!");
        }

        // Reset form
        setDraft("");
        setTitle("");
        setTags("");
        setEditingEntry(null);
        setShowEditor(false);
        localStorage.removeItem("journalDraft");
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setTitle(entry.title);
        setDraft(entry.content);
        setTags((entry.tags || []).join(", "));
        setShowEditor(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            // Find the entry to be deleted for logging purposes
            const entryToDelete = entries.find(entry => entry._id === id);
            
            try {
                if (socket && socket.socket) {
                    socket.socket.emit("student:journal:delete", {
                        studentId: user._id,
                        entryId: id,
                    });
                }
            } catch (err) {
                console.error("❌ Error deleting journal entry:", err.message);
                toast.error("Failed to delete journal entry. Please try again.");
                return;
            }
            
            // Log journal entry deletion activity
            if (entryToDelete) {
                logActivity({
                    activityType: "learning_activity",
                    description: `Deleted journal entry: ${entryToDelete.title}`,
                    metadata: {
                        action: "delete_journal_entry",
                        entryId: id,
                        title: entryToDelete.title,
                        createdAt: entryToDelete.createdAt
                    }
                });
            }
            
            toast.success("Journal entry deleted successfully!");
        }
    };

    const handlePromptSelect = (prompt) => {
        setDraft((prev) => prev + (prev ? "\n\n" : "") + prompt + "\n\n");
        setShowEditor(true);
        
        // Log prompt selection activity
        logActivity({
            activityType: "learning_activity",
            description: "Used journal prompt",
            metadata: {
                action: "use_journal_prompt",
                prompt: prompt
            }
        });
    };

    const filteredEntries = entries.filter((entry) => {
        const matchesSearch =
            entry.title?.toLowerCase().includes(search.toLowerCase()) ||
            entry.content?.toLowerCase().includes(search.toLowerCase());
        const matchesDate = filterDate
            ? format(new Date(entry.createdAt), "yyyy-MM-dd") ===
            format(filterDate, "yyyy-MM-dd")
            : true;
        const matchesTags =
            selectedTags.length > 0
                ? selectedTags.every((tag) => entry.tags?.includes(tag))
                : true;
        return matchesSearch && matchesDate && matchesTags;
    });

    const downloadCSV = () => {
        const csv = [
            ["Date", "Title", "Tags", "Content"],
            ...filteredEntries.map((e) => [
                format(new Date(e.createdAt), "yyyy-MM-dd"),
                e.title,
                (e.tags || []).join("; "),
                e.content.replace(/\n/g, " "),
            ]),
        ]
            .map((row) => row.map((value) => `"${value}"`).join(","))
            .join("\n");

        const fileName = "journal_entries.csv";
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, fileName);
        
        // Log download activity
        logActivity({
            activityType: "learning_activity",
            description: "Downloaded journal entries",
            metadata: {
                action: "download_journal_entries",
                fileName: fileName,
                entryCount: filteredEntries.length,
                searchFilter: search || null,
                dateFilter: filterDate ? format(filterDate, "yyyy-MM-dd") : null,
                tagFilter: selectedTags.length > 0 ? selectedTags : null
            }
        });
        
        toast.success("Journal entries downloaded successfully!");
    };

    const uniqueTags = [...new Set(entries.flatMap((entry) => entry.tags || []))];

    const calendarTileClassName = ({ date }) => {
        const entryDates = entries.map((e) =>
            format(new Date(e.createdAt), "yyyy-MM-dd")
        );
        return entryDates.includes(format(date, "yyyy-MM-dd"))
            ? "bg-blue-100"
            : null;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => setLoadError(true), 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, [loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your journal...</p>
                    {loadError && (
                        <p className="text-red-500 mt-4">
                            Unable to load journal entries. Please check your connection or
                            try again later.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                        <span className="text-black dark:text-white">📖</span>
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                            My Journal
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg font-medium">
                        Your thoughts, dreams, and memories in one place ✨
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-purple-500" />
                            <span className="text-sm font-semibold text-gray-600">
                                Total Entries
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-purple-600">
                            {stats.totalEntries}
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-6 h-6 text-orange-500" />
                            <span className="text-sm font-semibold text-gray-600">
                                Current Streak
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-orange-600">
                            {stats.currentStreak}
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-6 h-6 text-blue-500" />
                            <span className="text-sm font-semibold text-gray-600">
                                Total Words
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                            {stats.totalWords.toLocaleString()}
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <div className="flex items-center gap-3 mb-2">
                            <Tag className="w-6 h-6 text-green-500" />
                            <span className="text-sm font-semibold text-gray-600">
                                Favorite Tag
                            </span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                            {stats.favoriteTag || "None yet"}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-3 mb-8"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditor(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        New Entry
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadCSV}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Export CSV
                    </motion.button>
                </motion.div>

                {/* Writing Prompts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                        Writing Prompts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {journalPrompts.slice(0, 6).map((prompt, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handlePromptSelect(prompt)}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/50 cursor-pointer hover:shadow-lg transition-all"
                            >
                                <p className="text-gray-700 text-sm font-medium">{prompt}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search entries..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                onChange={(e) =>
                                    setFilterDate(
                                        e.target.value ? new Date(e.target.value) : null
                                    )
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                multiple
                                value={selectedTags}
                                onChange={(e) =>
                                    setSelectedTags(
                                        [...e.target.selectedOptions].map((o) => o.value)
                                    )
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {uniqueTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Calendar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-8"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-purple-500" />
                        Entry Calendar
                    </h3>
                    <Calendar
                        className="w-full rounded-xl"
                        tileClassName={calendarTileClassName}
                        onClickDay={setFilterDate}
                        value={filterDate}
                    />
                </motion.div>

                {/* Entries List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-purple-500" />
                        Your Entries ({filteredEntries.length})
                    </h3>

                    {filteredEntries.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                No entries found. Start writing your first entry!
                            </p>
                        </div>
                    ) : (
                        filteredEntries.map((entry) => (
                            <motion.div
                                key={entry._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                                            {entry.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {format(
                                                    new Date(entry.createdAt),
                                                    "MMM dd, yyyy 'at' HH:mm"
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" />
                                                {entry.content.split(" ").length} words
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleEdit(entry)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(entry._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="prose max-w-none mb-4">
                                    <ReactMarkdown>{entry.content}</ReactMarkdown>
                                </div>

                                {entry.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {entry.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Editor Modal */}
                {showEditor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {editingEntry ? "Edit Entry" : "New Entry"}
                                    </h3>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            setShowEditor(false);
                                            setEditingEntry(null);
                                            setTitle("");
                                            setDraft("");
                                            setTags("");
                                        }}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Entry title..."
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold"
                                    />

                                    <textarea
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        placeholder="Write your thoughts here... (Markdown supported)"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[300px] resize-none"
                                    />

                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="Tags (comma-separated)"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />

                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSaveEntry}
                                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <Save className="w-5 h-5" />
                                            {editingEntry ? "Update Entry" : "Save Entry"}
                                        </motion.button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-4 text-center">
                                    Draft auto-saved • {draft.split(" ").length} words
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
