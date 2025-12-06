import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPeriodBasics = () => {
    const navigate = useNavigate();

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-32";

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
        {
            id: 1,
            text: "Every girl gets her period at the same age.",
            options: [
                {
                    id: "a",
                    text: "True",
                    emoji: "✅",
                    description: "Everyone is different.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "False",
                    emoji: "❌",
                    description: "Correct! Bodies grow at different speeds.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Only on Tuesday",
                    emoji: "📅",
                    description: "Not true.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "A period usually happens...",
            options: [
                {
                    id: "b",
                    text: "About once a month",
                    emoji: "🌜",
                    description: "Correct! Like the moon cycle.",
                    isCorrect: true
                },
                {
                    id: "a",
                    text: "Once a year",
                    emoji: "🗓️",
                    description: "More often than that.",
                    isCorrect: false
                },

                {
                    id: "c",
                    text: "Every day",
                    emoji: "☀️",
                    description: "Not every day.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "Getting your period means...",
            options: [
                {
                    id: "a",
                    text: "You are turning into a superhero",
                    emoji: "🦸‍♀️",
                    description: "Not exactly.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Your body is healthy and growing up",
                    emoji: "🌱",
                    description: "Yes! It is a sign of health.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "You are sick",
                    emoji: "🤒",
                    description: "It is not an illness.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            text: "Can you still play sports on your period?",
            options: [
                {
                    id: "a",
                    text: "No, never",
                    emoji: "🚫",
                    description: "You can do anything!",
                    isCorrect: false
                },

                {
                    id: "c",
                    text: "Only sitting sports",
                    emoji: "🪑",
                    description: "Any sport is okay.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Yes, absolutely",
                    emoji: "⚽",
                    description: "Correct! Exercise can even help cramps.",
                    isCorrect: true
                },
            ]
        },
        {
            id: 5,
            text: "Should you be ashamed of your period?",
            options: [
                {
                    id: "a",
                    text: "Yes, hide it",
                    emoji: "🫣",
                    description: "Nothing to be ashamed of.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "No, it is natural",
                    emoji: "💁‍♀️",
                    description: "Correct! It happens to half the world.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Be scared",
                    emoji: "😨",
                    description: "Don't be scared.",
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
            title="Quiz on Period Basics"
            subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-female"
            totalLevels={5}
            currentLevel={99}
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

export default QuizOnPeriodBasics;
