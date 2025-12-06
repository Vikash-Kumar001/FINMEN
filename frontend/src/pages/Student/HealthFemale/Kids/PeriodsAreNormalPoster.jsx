import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodsAreNormalPoster = () => {
    const navigate = useNavigate();

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-36";

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
        {
            id: 1,
            text: "What title fits a positive period poster?",
            options: [
                {
                    id: "a",
                    text: "Scary Days",
                    emoji: "👻",
                    description: "Don't be scared.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "I Am Growing Up & Strong",
                    emoji: "💪",
                    description: "Correct! It is a strength.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Secret Problem",
                    emoji: "🤫",
                    description: "It is not a problem.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "Which image shows confidence?",
            options: [
                {
                    id: "a",
                    text: "Hiding under a blanket",
                    emoji: "🛌",
                    description: "That is hiding.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "A girl standing tall smiling",
                    emoji: "🦸‍♀️",
                    description: "Yes! Confident and proud.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Running away",
                    emoji: "🏃‍♀️",
                    description: "Running from it doesn't help.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "Periods are a sign of...",
            options: [
                {
                    id: "a",
                    text: "Bad luck",
                    emoji: "🍀",
                    description: "Not luck.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Health",
                    emoji: "❤️",
                    description: "Correct! A healthy body works this way.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Being messy",
                    emoji: "🧹",
                    description: "Hygiene manages the mess.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            text: "What colors make the poster cheerful?",
            options: [
                {
                    id: "a",
                    text: "All black and grey",
                    emoji: "⬛",
                    description: "That is sad.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Bright pink, yellow, and blue",
                    emoji: "🌈",
                    description: "Yes! Bright colors are happy.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Invisible ink",
                    emoji: "👻",
                    description: "No one can see it!",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            text: "Who is this poster for?",
            options: [
                {
                    id: "a",
                    text: "Only aliens",
                    emoji: "👽",
                    description: "Humans need it.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Every girl to feel brave",
                    emoji: "👭",
                    description: "Correct! Encourage everyone.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "To scare boys",
                    emoji: "👦",
                    description: "It is for education, not scaring.",
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
            title="Poster: Periods Are Normal"
            subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-female"
            totalLevels={5}
            currentLevel={36}
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

export default PeriodsAreNormalPoster;
