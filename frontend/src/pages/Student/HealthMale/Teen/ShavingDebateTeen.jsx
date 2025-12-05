import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShavingDebateTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-36";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const [coins, setCoins] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const stages = [
        {
            id: 1,
            title: "To Shave or Not?",
            question: "Is it mandatory to shave?",
            options: [
                {
                    id: "a",
                    text: "It's your choice",
                    emoji: "🤷",
                    description: "Do what feels right for you.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Yes, always",
                    emoji: "🪒",
                    description: "Not a rule.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "No, never",
                    emoji: "🧔",
                    description: "Some prefer clean shaven.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            title: "Razor Sharing",
            question: "Can I use my friend's razor?",
            options: [
                {
                    id: "b",
                    text: "Yes, save money",
                    emoji: "💰",
                    description: "Unsanitary.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "No, never share",
                    emoji: "🚫",
                    description: "Spreads bacteria and blood.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Only if washed",
                    emoji: "🚿",
                    description: "Still risky.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            title: "Electric vs Manual",
            question: "Which razor is better?",
            options: [
                {
                    id: "c",
                    text: "Knife",
                    emoji: "🔪",
                    description: "Dangerous!",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Only Electric",
                    emoji: "⚡",
                    description: "Both have pros and cons.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Whichever you prefer",
                    emoji: "✅",
                    description: "It's personal preference.",
                    isCorrect: true
                }
            ]
        },
        {
            id: 4,
            title: "Aftershave",
            question: "Does aftershave sting?",
            options: [
                {
                    id: "b",
                    text: "It burns skin off",
                    emoji: "🔥",
                    description: "Exaggeration.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Some do (alcohol)",
                    emoji: "🧴",
                    description: "Alcohol-free ones are gentler.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "It feels like ice",
                    emoji: "❄️",
                    description: "Not usually.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            title: "Frequency",
            question: "How often should I shave?",
            options: [
                {
                    id: "c",
                    text: "Every hour",
                    emoji: "⏰",
                    description: "Impossible.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Once a year",
                    emoji: "🗓️",
                    description: "You'll have a long beard.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "When needed",
                    emoji: "📅",
                    description: "Depends on hair growth.",
                    isCorrect: true
                }
            ]
        }
    ];

    const handleOptionSelect = (option) => {
        if (option.isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);

            setTimeout(() => {
                if (currentStage < stages.length - 1) {
                    setCurrentStage(prev => prev + 1);
                } else {
                    setGameFinished(true);
                }
            }, 1500);
        } else {
            showCorrectAnswerFeedback(0, false);
        }
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/teen-hygiene-journal");
    };

    const currentS = stages[currentStage];

    return (
        <GameShell
            title="Shaving Debate"
            subtitle={`Topic ${currentStage + 1} of ${stages.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={stages.length}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{currentS.title}</h3>
                        <p className="text-white/90 text-lg">{currentS.question}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {currentS.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option)}
                                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/20 transition-all transform hover:scale-105 flex flex-col items-center gap-4 group"
                            >
                                <div className="text-6xl group-hover:scale-110 transition-transform">
                                    {option.emoji}
                                </div>
                                <div className="text-white font-bold text-xl text-center">
                                    {option.text}
                                </div>
                                <p className="text-white/70 text-sm text-center">{option.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </GameShell>
    );
};

export default ShavingDebateTeen;
