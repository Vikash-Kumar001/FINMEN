import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneStory = () => {
    const navigate = useNavigate();

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-38";

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
        {
            id: 1,
            text: "You've worn a pad for 6 hours.",
            options: [
                {
                    id: "a",
                    text: "Change it now",
                    emoji: "🩸",
                    description: "Correct! Keep fresh.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Wait until tomorrow",
                    emoji: "🌚",
                    description: "That is too long.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Forget about it",
                    emoji: "🤷‍♀️",
                    description: "It needs changing.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "Before changing a pad, you should...",
            options: [
                {
                    id: "a",
                    text: "Eat a snack",
                    emoji: "🍪",
                    description: "Do that later.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Wash your hands",
                    emoji: "🧼",
                    description: "Yes! Clean hands first.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Run around",
                    emoji: "🏃‍♀️",
                    description: "Wash hands first.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "If you smell something funny...",
            options: [
                {
                    id: "a",
                    text: "It's time to change and wash",
                    emoji: "🚿",
                    description: "Correct!",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Spray perfume only",
                    emoji: "🌸",
                    description: "That just hides it.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Ignore it",
                    emoji: "😶",
                    description: "Address it.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            text: "How do you dispose of a pad?",
            options: [
                {
                    id: "a",
                    text: "Flush it",
                    emoji: "🚽",
                    description: "Accidents happen if you flush! Clogs pipes.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Wrap in toilet paper and bin it",
                    emoji: "🗑️",
                    description: "Yes! The proper way.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Throw out the window",
                    emoji: "🪟",
                    description: "No!",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            text: "Keeping clean makes you feel...",
            options: [
                {
                    id: "a",
                    text: "Dirty",
                    emoji: "💩",
                    description: "Opposite.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Tired",
                    emoji: "😴",
                    description: "It feels refreshing.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Confident and Heathy",
                    emoji: "😎",
                    description: "Correct! Confidence!",
                    isCorrect: true
                }
            ]
        }
    ];

    const handleChoice = (optionId) => {
        if (selectedOptionId) return;

        setSelectedOptionId(optionId);
        const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
        const isCorrect = selectedOption.isCorrect;

        if (isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        }

        setTimeout(() => {
            setSelectedOptionId(null);
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setGameFinished(true);
            }
        }, 2000);
    };

    const handleNext = () => {
        navigate("/games/health-female/kids");
    };

    return (
        <GameShell
            title="Hygiene Story"
            subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-female"
            totalLevels={5}
            currentLevel={38}
            showConfetti={gameFinished}
            flashPoints={flashPoints}
            backPath="/games/health-female/kids"
            showAnswerConfetti={showAnswerConfetti}
            maxScore={maxScore}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}>
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                        <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-8 text-center">
                        {questions[currentQuestion].text}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {questions[currentQuestion].options.map(option => {
                            const isSelected = selectedOptionId === option.id;
                            const showFeedback = selectedOptionId !== null;

                            let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";

                            if (showFeedback && isSelected) {
                                buttonClass = option.isCorrect
                                    ? "bg-green-500 ring-4 ring-green-300"
                                    : "bg-red-500 ring-4 ring-red-300";
                            } else if (showFeedback && !isSelected) {
                                buttonClass = "bg-white/10 opacity-50";
                            }

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleChoice(option.id)}
                                    disabled={showFeedback}
                                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${buttonClass}`}
                                >
                                    <div className="flex items-center">
                                        <div className="text-4xl mr-6">{option.emoji}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl mb-1 text-white">{option.text}</h3>
                                            {showFeedback && isSelected && (
                                                <p className="text-white font-medium mt-2 animate-fadeIn">{option.description}</p>
                                            )}
                                        </div>
                                        {showFeedback && isSelected && (
                                            <div className="text-3xl ml-4">
                                                {option.isCorrect ? "✅" : "❌"}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </GameShell>
    );
};

export default HygieneStory;
