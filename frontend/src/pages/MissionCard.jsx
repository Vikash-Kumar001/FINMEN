import React from "react";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

const MissionCard = ({ mission, onComplete, isCompleted }) => {
    return (
        <motion.div
            className="border rounded-xl p-4 shadow-md bg-white dark:bg-gray-900 dark:border-gray-700 transition-all hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {mission.title}
                </h3>
                {isCompleted && <FaCheckCircle className="text-green-500 text-xl" />}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">{mission.description}</p>

            <div className="text-sm mt-3 text-gray-700 dark:text-gray-300 flex items-center gap-4">
                <span className="flex items-center gap-1">
                    <FaTrophy className="text-yellow-500" /> XP: {mission.xp}
                </span>
                <span className="flex items-center gap-1">
                    💰 Coins: {mission.rewardCoins}
                </span>
            </div>

            <div className="mt-4">
                {isCompleted ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                        ✅ Mission Completed
                    </span>
                ) : (
                    <button
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition-all"
                        onClick={() => onComplete(mission._id)}
                    >
                        Mark as Complete
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default MissionCard;
