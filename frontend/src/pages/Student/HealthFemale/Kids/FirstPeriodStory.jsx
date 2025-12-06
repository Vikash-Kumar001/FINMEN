import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FirstPeriodStory = () => {
    const navigate = useNavigate();

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-31";

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
        {
            id: 1,
            text: "You see a red stain on your underwear at school.",
            options: [
                {
                    id: "a",
                    text: "Panic and cry",
                    emoji: "😭",
                    description: "Stay calm, it's okay.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Stay calm and go to the bathroom",
                    emoji: "😌",
                    description: "Correct! Go check it out.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Run home",
                    emoji: "🏃‍♀️",
                    description: "You can handle this at school.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "You realize you got your period.",
            options: [
                {
                    id: "a",
                    text: "Tell a teacher or nurse",
                    emoji: "👩‍🏫",
                    description: "Yes! They can help you.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Ignore it",
                    emoji: "🙈",
                    description: "You need a pad.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Tell everyone in class",
                    emoji: "📢",
                    description: "You can keep it private.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "You don't have a pad with you.",
            options: [
                {
                    id: "a",
                    text: "Use notebook paper",
                    emoji: "📄",
                    description: "That won't work well.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Ask a friend or the nurse",
                    emoji: "🙋‍♀️",
                    description: "Correct! They usually have supplies.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Use nothing",
                    emoji: "🚫",
                    description: "You need protection.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            text: "Your tummy hurts a little (cramps).",
            options: [
                {
                    id: "a",
                    text: "Rest a bit and drink water",
                    emoji: "💧",
                    description: "Yes! That helps.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Eat lots of candy",
                    emoji: "🍬",
                    description: "Sugar might make it worse.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Jump up and down",
                    emoji: "🤸‍♀️",
                    description: "Rest is better.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            text: "Is this normal?",
            options: [
                {
                    id: "a",
                    text: "No, it's weird",
                    emoji: "👽",
                    description: "It is totally natural.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Yes, it happens to every girl",
                    emoji: "🌸",
                    description: "Correct! Welcome to growing up.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Only happened to you",
                    emoji: "👉",
                    description: "You are not alone.",
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
            title="First Period Story"
            subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-female"
            totalLevels={5}
            currentLevel={31}
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

export default FirstPeriodStory;
