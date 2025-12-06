import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SupportStory = () => {
    const navigate = useNavigate();

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-35";

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
        {
            id: 1,
            text: "You are being bullied at school.",
            options: [
                {
                    id: "a",
                    text: "Tell a teacher or parent",
                    emoji: "🗣️",
                    description: "Correct! Speak up.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Hide in the bathroom",
                    emoji: "🚽",
                    description: "Don't hide alone.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Bully someone else",
                    emoji: "😈",
                    description: "Never bully others.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "Your best friend is moving away.",
            options: [
                {
                    id: "a",
                    text: "Get a new best friend immediately",
                    emoji: "🏃‍♀️",
                    description: "It is okay to be sad.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Write them letters and stay in touch",
                    emoji: "✉️",
                    description: "Yes! You can still be friends.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Be angry at them",
                    emoji: "😠",
                    description: "It isn't their fault.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "You don't understand your homework.",
            options: [
                {
                    id: "a",
                    text: "Rip it up",
                    emoji: "📄",
                    description: "Homework is important.",
                    isCorrect: false
                },

                {
                    id: "c",
                    text: "Guess all the answers",
                    emoji: "🎲",
                    description: "Try to learn.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Ask for help",
                    emoji: "🙋‍♀️",
                    description: "Correct! Asking is smart.",
                    isCorrect: true
                },
            ]
        },
        {
            id: 4,
            text: "Who is part of your 'Support Team'?",
            options: [
                {
                    id: "a",
                    text: "Strangers in the park",
                    emoji: "⛲",
                    description: "Not strangers.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Family, teachers, and doctors",
                    emoji: "👨‍👩‍👧‍👦",
                    description: "Yes! They care about you.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Only pets",
                    emoji: "🐶",
                    description: "Pets help, but humans do too.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            text: "Is it weak to ask for help?",
            options: [
                {
                    id: "b",
                    text: "No, it is brave and smart",
                    emoji: "🌟",
                    description: "Correct! Asking is good.",
                    isCorrect: true
                },
                {
                    id: "a",
                    text: "Yes, do it yourself",
                    emoji: "💪",
                    description: "Everyone needs help sometimes.",
                    isCorrect: false
                },

                {
                    id: "c",
                    text: "Only babies ask",
                    emoji: "👶",
                    description: "Adults ask for help too.",
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
            title="Support Story"
            subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-female"
            totalLevels={5}
            currentLevel={97}
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

export default SupportStory;
