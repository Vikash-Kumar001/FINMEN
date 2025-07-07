import React from "react";

const StreakTracker = ({ currentStreak, longestStreak }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">🔥 Streak Tracker</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Current Streak: <span className="font-bold">{currentStreak} days</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Longest Streak: <span className="font-bold">{longestStreak} days</span></p>
        </div>
    );
};

export default StreakTracker;