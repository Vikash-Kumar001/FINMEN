import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShavingStoryTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-35";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
        {
            id: 1,
            text: "You want to start shaving. What do you need?",
            options: [
                {
                    id: "b",
                    text: "Just water",
                    emoji: "💧",
                    description: "Not enough lubrication.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Razor and Shaving Cream",
                    emoji: "🪒",
                    description: "Essential tools for a safe shave.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Scissors only",
                    emoji: "✂️",
                    description: "Won't give a close shave.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "What should you do before shaving?",
            options: [
                {
                    id: "c",
                    text: "Dry your face",
                    emoji: "🌵",
                    description: "Hair is harder when dry.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Wash face with warm water",
                    emoji: "🚿",
                    description: "Softens hair and opens pores.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Apply ice",
                    emoji: "🧊",
                    description: "Closes pores, making shaving harder.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "Which direction should you shave?",
            options: [
                {
                    id: "b",
                    text: "Sideways",
                    emoji: "↔️",
                    description: "Can cause cuts.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Against the grain",
                    emoji: "⬆️",
                    description: "Causes irritation and ingrown hairs.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "With the grain (hair growth)",
                    emoji: "⬇️",
                    description: "Prevents irritation.",
                    isCorrect: true
                }
            ]
        },
        {
            id: 4,
            text: "You cut yourself while shaving. What to do?",
            options: [
                {
                    id: "c",
                    text: "Cry",
                    emoji: "😭",
                    description: "It happens, don't worry.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Apply pressure/tissue",
                    emoji: "🧻",
                    description: "Stops the bleeding.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Ignore it",
                    emoji: "🩸",
                    description: "It will stain your clothes.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            text: "What to do after shaving?",
            options: [
                {
                    id: "b",
                    text: "Rub with towel",
                    emoji: "🧣",
                    description: "Irritates fresh skin.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Nothing",
                    emoji: "🤷",
                    description: "Skin needs care.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Rinse and moisturize",
                    emoji: "🧴",
                    description: "Soothes the skin.",
                    isCorrect: true
                }
            ]
        }
    ];

    const handleChoice = (optionId) => {
        const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
        const isCorrect = selectedOption.isCorrect;

        if (isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setGameFinished(true);
            }
        }, 1500);
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/shaving-debate-teen");
    };

    return (
        <GameShell
            title="Shaving Story"
            subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={questions.length}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                        <span className="text-yellow-400 font-bold">Coins: {coins}</span>
                    </div>

                    <p className="text-white text-lg mb-6">
                        {questions[currentQuestion].text}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {questions[currentQuestion].options.map(option => (
                            <button
                                key={option.id}
                                onClick={() => handleChoice(option.id)}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                            >
                                <div className="flex items-center">
                                    <div className="text-2xl mr-4">{option.emoji}</div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                                        <p className="text-white/90">{option.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </GameShell>
    );
};

export default ShavingStoryTeen;
