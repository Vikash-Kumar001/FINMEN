import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizPubertyHealthTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-32";

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
            text: "How much sleep do teens need?",
            options: [
                {
                    id: "b",
                    text: "5 hours",
                    emoji: "🥱",
                    description: "Not enough.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "8-10 hours",
                    emoji: "🛌",
                    description: "Crucial for growth and brain.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "15 hours",
                    emoji: "😴",
                    description: "Too much.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "What helps reduce stress?",
            options: [
                {
                    id: "c",
                    text: "Eating junk food",
                    emoji: "🍔",
                    description: "Makes you feel worse later.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Exercise",
                    emoji: "🏃",
                    description: "Releases happy chemicals.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Staying up late",
                    emoji: "🌙",
                    description: "Increases stress.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "Why is personal space important?",
            options: [
                {
                    id: "b",
                    text: "To hide secrets",
                    emoji: "🤫",
                    description: "It's about comfort, not secrets.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "For privacy and comfort",
                    emoji: "🚪",
                    description: "Everyone needs their own space.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "To avoid chores",
                    emoji: "🧹",
                    description: "Nice try!",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            text: "What is a healthy way to express anger?",
            options: [
                {
                    id: "c",
                    text: "Breaking things",
                    emoji: "🔨",
                    description: "Destructive.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Holding it in",
                    emoji: "🤐",
                    description: "Unhealthy.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Talking or writing",
                    emoji: "📝",
                    description: "Gets feelings out safely.",
                    isCorrect: true
                }
            ]
        },
        {
            id: 5,
            text: "Who can you talk to about puberty?",
            options: [
                {
                    id: "b",
                    text: "Strangers online",
                    emoji: "💻",
                    description: "Not safe.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "No one",
                    emoji: "😶",
                    description: "Don't keep it inside.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Parents or Doctors",
                    emoji: "👨‍⚕️",
                    description: "Trusted adults give good advice.",
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
        navigate("/student/health-male/teens/reflex-puberty-health-teen");
    };

    return (
        <GameShell
            title="Quiz on Puberty Health"
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

export default QuizPubertyHealthTeen;
