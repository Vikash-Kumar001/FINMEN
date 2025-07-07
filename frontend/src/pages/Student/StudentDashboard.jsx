import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaSmile,
    FaGamepad,
    FaBook,
    FaWallet,
    FaGift,
    FaBell,
    FaChartLine,
    FaUserCircle,
    FaCog,
    FaHeartbeat,
} from "react-icons/fa";

import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import { fetchStudentStats } from "../../services/userService";

import MoodChart from "../../components/MoodChart";
import MoodTimeline from "../../components/MoodTimeline";
import XPGraph from "../../components/XPGraph";
import StreakTracker from "../../components/StreakTracker";
import FilterableMoodHistory from "../../components/FilterableMoodHistory";

const featureCards = [
    { title: "Mood Tracker", icon: <FaSmile />, path: "/student/mood-tracker" },
    { title: "Games", icon: <FaGamepad />, path: "/student/games" },
    { title: "Journal", icon: <FaBook />, path: "/student/journal" },
    { title: "Wallet", icon: <FaWallet />, path: "/student/wallet" },
    { title: "Rewards", icon: <FaGift />, path: "/student/rewards" },
    { title: "Redeem", icon: <FaGift />, path: "/student/redeem" },
    { title: "Leaderboard", icon: <FaChartLine />, path: "/student/leaderboard" },
    { title: "Notifications", icon: <FaBell />, path: "/student/notifications" },
    { title: "Profile", icon: <FaUserCircle />, path: "/student/profile" },
    { title: "Settings", icon: <FaCog />, path: "/student/setting" },
    { title: "Breathing", icon: <FaHeartbeat />, path: "/student/breathing" },
];

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { wallet } = useWallet();

    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [xpToNextLevel, setXpToNextLevel] = useState(100);
    const [moodCheckins, setMoodCheckins] = useState(0);
    const [todayMood, setTodayMood] = useState("🙂");

    const [previousLevel, setPreviousLevel] = useState(1);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await fetchStudentStats();
            if (res) {
                const newLevel = res.level || 1;

                if (newLevel > previousLevel) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 4000);
                }

                setXp(res.xp || 0);
                setLevel(newLevel);
                setXpToNextLevel(res.nextLevelXp || 100);
                setMoodCheckins(res.moodCheckins || 0);
                setTodayMood(res.todayMood || "🙂");
                setPreviousLevel(newLevel);
            }
        } catch (err) {
            console.error("❌ Failed to load student stats", err);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            {showConfetti && <Confetti width={width} height={height} />}

            <h1 className="text-3xl font-bold mb-4 text-center text-indigo-700 dark:text-white">
                Welcome back, {user?.name || "Student"}!
            </h1>

            {/* XP Level */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-6">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
                    🎯 Level {level} - XP: {xp}/{xpToNextLevel}
                </h2>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                        className="h-4 bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                    />
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Today's Mood</div>
                    <div className="text-4xl my-2">{todayMood}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Keep tracking daily!</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {wallet?.balance || 0} 🪙
                    </div>
                    <button
                        onClick={() => navigate("/student/rewards")}
                        className="mt-2 text-sm bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                        Redeem
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Weekly Mood Check-ins
                    </div>
                    <MoodChart />
                </div>
            </div>

            {/* Feature Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featureCards.map((card, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="cursor-pointer p-5 bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col items-center text-center"
                        onClick={() => navigate(card.path)}
                    >
                        <div className="text-3xl text-indigo-500 dark:text-yellow-400 mb-2">{card.icon}</div>
                        <h3 className="text-base font-semibold text-gray-700 dark:text-white">
                            {card.title}
                        </h3>
                    </motion.div>
                ))}
            </div>

            {/* 📊 XP Progression */}
            <div className="my-10">
                <XPGraph />
            </div>

            {/* 🔥 Streak Tracker */}
            <div className="my-10">
                <StreakTracker />
            </div>

            {/* 📅 Mood History Filter */}
            <div className="my-10">
                <FilterableMoodHistory />
            </div>

            {/* 🧠 Mood Timeline */}
            <MoodTimeline />

            <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                💡 Tip: Explore features daily to earn more XP and HealCoins.
            </div>
        </div>
    );
}
