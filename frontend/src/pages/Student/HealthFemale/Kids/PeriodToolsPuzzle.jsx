import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodToolsPuzzle = () => {
    const navigate = useNavigate();

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-34";

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
        {
            id: 1,
            text: "What absorbs flow?",
            options: [
                {
                    id: "a",
                    text: "A Sticker",
                    emoji: "🏷️",
                    description: "Stickers don't help flow.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "A Pad",
                    emoji: "🩸",
                    description: "Correct! Pads absorb liquid.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "A Rock",
                    emoji: "🪨",
                    description: "Rocks are hard.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "What cleans your body?",
            options: [
                {
                    id: "a",
                    text: "Soap and Water",
                    emoji: "🧼",
                    description: "Yes! Stay clean.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Mud",
                    emoji: "💩",
                    description: "Mud is dirty.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Glitter",
                    emoji: "✨",
                    description: "Glitter is for fun.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "What tracks your dates?",
            options: [
                {
                    id: "a",
                    text: "A Calendar",
                    emoji: "📅",
                    description: "Correct! Mark the days.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "A Clock",
                    emoji: "🕰️",
                    description: "Clocks tell time.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "A Ruler",
                    emoji: "📏",
                    description: "Rulers measure length.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            text: "What helps with cramps?",
            options: [
                {
                    id: "a",
                    text: "Ice Cream",
                    emoji: "🍦",
                    description: "Yummy, but might not help pain.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Heating Pad",
                    emoji: "🔥",
                    description: "Yes! Heat relaxes muscles.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Loud Music",
                    emoji: "🎵",
                    description: "Relaxing is better.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            text: "Where do you put dirty pads?",
            options: [
                {
                    id: "a",
                    text: "In the trash bin",
                    emoji: "🗑️",
                    description: "Correct! Wrap it and bin it.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Flush in toilet",
                    emoji: "🚽",
                    description: "Never flush pads!",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Leave on floor",
                    emoji: "👇",
                    description: "That is messy.",
                    isCorrect: false
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
            title="Puzzle: Period Tools"
            subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-female"
            totalLevels={5}
            currentLevel={34}
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

export default PeriodToolsPuzzle;
