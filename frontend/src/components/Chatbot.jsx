import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../hooks/useAuth";
import EmojiPicker from "emoji-picker-react";
import {
    FaStar,
    FaRegStar,
    FaSmile,
    FaTimes
} from "react-icons/fa";
import {
    Sparkles,
    Zap,
    Brain,
    Heart,
    Smile,
    MessageCircle,
    Trophy,
    Crown,
    Star,
    Flame,
    Bot,
    Send,
    Gift,
    Target
} from "lucide-react";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [chatbotMood, setChatbotMood] = useState("happy");
    const [userXP, setUserXP] = useState(0);
    const [chatStreak, setChatStreak] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [averageMood, setAverageMood] = useState("neutral");
    const messagesEndRef = useRef(null);

    const socket = useSocket();
    const { user } = useAuth();

    // Quick action suggestions
    const quickActions = [
        { icon: <Heart className="w-4 h-4" />, text: "How are you feeling?", category: "mood" },
        { icon: <Brain className="w-4 h-4" />, text: "Give me a motivation tip", category: "motivation" },
        { icon: <Sparkles className="w-4 h-4" />, text: "What's my progress?", category: "progress" },
        { icon: <Target className="w-4 h-4" />, text: "Set a daily goal", category: "goals" },
        { icon: <Trophy className="w-4 h-4" />, text: "Show my achievements", category: "achievements" },
        { icon: <Gift className="w-4 h-4" />, text: "Surprise me!", category: "fun" }
    ];

    // Mood reactions for different message types
    const moodReactions = {
        happy: ["😊", "😄", "🎉", "✨", "🌟"],
        excited: ["🚀", "⚡", "🔥", "💪", "🎯"],
        supportive: ["🤗", "💙", "🌈", "🦋", "🌸"],
        playful: ["😜", "🎮", "🎲", "🃏", "🎪"],
        wise: ["🧠", "💡", "📚", "🔮", "⭐"]
    };

    // Map backend mood to emoji
    const moodEmoji = {
        happy: "😊",
        sad: "😢",
        anxious: "😰",
        angry: "😡",
        excited: "🥳",
        stressed: "😣",
        neutral: "🤖"
    };

    useEffect(() => {
        if (socket && socket.socket && user) {
            socket.socket.emit("student:chat:subscribe", { studentId: user._id });
            socket.socket.on("student:chat:history", (history) => {
                setMessages(history);
                setChatStreak(
                    history.filter(msg => msg.sender === "user").length
                );
                // Try to get XP/streak/achievements if backend sends extra info
                if (Array.isArray(history) && history.length > 0 && history[0]._session) {
                    setUserXP(history[0]._session.userXP || 0);
                    setAchievements(history[0]._session.achievements || []);
                    setAverageMood(history[0]._session.averageMood || "neutral");
                }
            });
            socket.socket.on("student:chat:message", (msg) => {
                setMessages((prev) => [...prev, msg]);
                setIsTyping(false);
                // XP, Streak, Achievements auto-calc after, optional bonus here for optimistic UX
                if (msg.sender === "user") {
                    setChatStreak(prev => prev + 1);
                }
                // If chat closed, increment unread
                if (!isOpen && msg.sender === "bot") {
                    setUnreadCount(prev => prev + 1);
                }
            });
            return () => {
                socket.socket.off("student:chat:history");
                socket.socket.off("student:chat:message");
            };
        }
    }, [socket, user, isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    useEffect(() => {
        if (isOpen) setUnreadCount(0);
    }, [isOpen]);

    // Starring a message in UI only, no server persistence (unless backend API added)
    const toggleStar = (index) => {
        setMessages((prev) => prev.map((msg, i) => (
            i === index ? { ...msg, starred: !msg.starred } : msg
        )));
    };

    const handleEmojiClick = (emoji) => {
        setInput((prev) => prev + emoji.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        if (!socket || !socket.socket) {
            console.error("❌ Socket not available for sending chat message");
            alert("Connection error. Please try again.");
            return;
        }
        
        setLoading(true);
        setIsTyping(true);
        
        try {
            socket.socket.emit("student:chat:send", {
                studentId: user._id,
                text: input
            });
            setInput("");
            setShowQuickActions(false);
        } catch (err) {
            console.error("❌ Error sending chat message:", err.message);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Emit quick action category to backend, which should send a response accordingly
    const handleQuickAction = (action) => {
        // Option 1: Send API call. Option 2: emit as chat.
        setLoading(true);
        setIsTyping(true);
        try {
            socket.socket.emit("student:chat:send", {
                studentId: user._id,
                text: action.text // Backend will recognize and process accordingly based on quick action
            });
            setInput("");
            setShowQuickActions(false);
        } catch (err) {
            console.error("❌ Error sending quick action:", err.message);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Visual enhancements for moods/categories
    const getBubbleColor = (msg) => {
        if (msg.sender === "user") return "bg-gradient-to-r from-indigo-500 to-purple-500 text-white";
        // Map by category if available
        switch (msg.category) {
            case "mood":
                return "bg-blue-50 text-blue-900 border-blue-100";
            case "motivation":
                return "bg-yellow-50 text-yellow-900 border-yellow-100";
            case "progress":
                return "bg-green-50 text-green-900 border-green-100";
            case "goals":
                return "bg-indigo-50 text-indigo-900 border-indigo-100";
            case "achievements":
                return "bg-pink-50 text-pink-900 border-pink-100";
            case "fun":
                return "bg-purple-50 text-purple-900 border-purple-100";
            default:
                return "bg-white text-gray-800 border border-gray-200";
        }
    };

    const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const getChatbotAvatar = (msgMood = chatbotMood) => moodEmoji[msgMood] || "🤖";
    const getRandomMoodReaction = (msgMood = chatbotMood) => {
        const reactions = moodReactions[msgMood] || moodReactions.happy;
        return reactions[Math.floor(Math.random() * reactions.length)];
    };
    const getLevel = () => Math.floor(userXP / 100) + 1;

    return (
        <>
            {/* Floating Chat Button */}
            <motion.div className="fixed bottom-6 right-6 z-50" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                {!isOpen ? (
                    <motion.button
                        className="relative bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 group"
                        onClick={() => setIsOpen(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{ boxShadow: [
                            "0 0 20px rgba(99, 102, 241, 0.5)",
                            "0 0 30px rgba(139, 92, 246, 0.7)",
                            "0 0 20px rgba(99, 102, 241, 0.5)"
                        ]}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Bot className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <motion.div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                                {unreadCount}
                            </motion.div>
                        )}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-700" />
                        </div>
                        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap">
                            Chat with your AI companion! 🤖
                        </div>
                    </motion.button>
                ) : (
                    <motion.div className="w-96 max-h-[600px] bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl flex flex-col border border-white/50 overflow-hidden relative" initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 pointer-events-none" />
                        {/* Header */}
                        <div className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <motion.div className="text-2xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                    {getChatbotAvatar(averageMood || chatbotMood)}
                                </motion.div>
                                <div>
                                    <h2 className="font-bold text-lg">AI Companion</h2>
                                    <div className="text-xs text-indigo-200 flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        Online • Level {getLevel()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {userXP} XP
                                </div>
                                <motion.button onClick={() => setIsOpen(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <FaTimes className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="relative z-10 bg-white/80 px-6 py-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Chat Streak: {chatStreak}</span>
                                <span>Next reward: {100 - (userXP % 100)} XP</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${(userXP % 100)}%` }} transition={{ duration: 0.5 }} />
                            </div>
                        </div>
                        {/* Messages */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-transparent to-white/30">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className="flex items-start gap-3 max-w-[85%]">
                                            {msg.sender === "bot" && (
                                                <motion.div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm shadow-lg" whileHover={{ scale: 1.1 }}>
                                                    {getChatbotAvatar(msg.mood)}
                                                </motion.div>
                                            )}
                                            <div className="flex flex-col">
                                                <motion.div className={`rounded-2xl px-4 py-3 shadow-lg relative ${getBubbleColor(msg)}`} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                                                    <div className="text-sm leading-relaxed">
                                                        {msg.text}
                                                    </div>
                                                    <div className={`text-xs mt-2 ${msg.sender === "user" ? "text-indigo-200" : "text-gray-500"}`}>{formatTime(msg.timestamp)}</div>
                                                    {msg.sender === "bot" && (
                                                        <div className="absolute -bottom-1 -right-1 text-sm">{getRandomMoodReaction(msg.mood)}</div>
                                                    )}
                                                    {msg.mood && msg.sender !== "user" && (
                                                        <span className="absolute -top-2 -left-2 text-xs bg-white px-2 py-1 rounded-full border shadow text-gray-500">{msg.mood}</span>
                                                    )}
                                                </motion.div>
                                                {msg.sender === "user" && (
                                                    <div className="flex items-center gap-1 mt-1 justify-end">
                                                        <span className="text-xs text-green-600 font-medium">+5 XP</span>
                                                        <Sparkles className="w-3 h-3 text-yellow-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <motion.button onClick={() => toggleStar(i)} className="text-yellow-500 mt-1 hover:text-yellow-600 transition-colors" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                                                {msg.starred ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">{getChatbotAvatar()}</div>
                                    <div className="bg-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                                        </div>
                                        <span className="text-sm text-gray-600">AI is thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Quick Actions */}
                        <AnimatePresence>
                            {showQuickActions && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="relative z-10 px-6 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickActions.map((action, i) => (
                                            <motion.button key={i} onClick={() => handleQuickAction(action)} className="flex items-center gap-2 p-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                {action.icon}
                                                <span className="truncate">{action.text}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Input Section */}
                        <div className="relative z-10 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
                            <form onSubmit={handleSubmit} className="flex items-center p-4 gap-3">
                                <motion.button type="button" onClick={() => setShowQuickActions(!showQuickActions)} className="p-2 text-gray-500 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Target className="w-5 h-5" />
                                </motion.button>
                                <motion.button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-gray-500 hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <FaSmile className="w-5 h-5" />
                                </motion.button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full left-4 z-50 mb-2">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                )}
                                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm" />
                                <motion.button type="submit" disabled={loading || !input.trim()} className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Send className="w-5 h-5" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default Chatbot;
