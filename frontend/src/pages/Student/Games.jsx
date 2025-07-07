import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBrain, FaHeartbeat, FaSmile, FaHandHoldingHeart } from "react-icons/fa";

const gamesList = [
    {
        title: "Focus Game",
        description: "Tap the moving target. Train attention span under pressure.",
        route: "/games/focus",
        icon: <FaBrain className="text-indigo-600 text-3xl" />,
        difficulty: "Medium",
        reward: 10,
        tag: "Cognitive",
    },
    {
        title: "Breathing Exercise",
        description: "Relax and reduce anxiety with guided breathing visuals.",
        route: "/games/breathe",
        icon: <FaHeartbeat className="text-blue-500 text-3xl" />,
        difficulty: "Easy",
        reward: 5,
        tag: "Mindfulness",
    },
    {
        title: "Memory Match",
        description: "Flip and match cards to improve short-term memory.",
        route: "/games/memory",
        icon: <FaSmile className="text-pink-500 text-3xl" />,
        difficulty: "Medium",
        reward: 15,
        tag: "Brain Training",
    },
    {
        title: "Gratitude Game",
        description: "Reflect on your day with 3 positive thoughts.",
        route: "/games/gratitude",
        icon: <FaHandHoldingHeart className="text-green-500 text-3xl" />,
        difficulty: "Easy",
        reward: 5,
        tag: "Emotional Wellness",
    },
];

export default function Games() {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-extrabold mb-2 text-center text-indigo-700">🎮 Gamified Activities</h2>
            <p className="text-center text-gray-500 mb-6">Play mindful games and earn <span className="font-bold text-yellow-500">HealCoins</span> to stay motivated!</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gamesList.map((game, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-white border rounded-xl shadow-md p-5 hover:shadow-xl cursor-pointer group relative"
                        onClick={() => navigate(game.route)}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gray-100 p-3 rounded-full">{game.icon}</div>
                            <div>
                                <h3 className="text-xl font-bold text-indigo-700 group-hover:underline">{game.title}</h3>
                                <p className="text-sm text-gray-500">{game.tag}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{game.description}</p>

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-400">
                                Difficulty: <strong>{game.difficulty}</strong>
                            </span>
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                                +{game.reward} 🪙
                            </span>
                        </div>

                        <div className="absolute top-2 right-2 bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                            Play Now
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
