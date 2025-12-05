import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenShavingSimulation = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-38";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const [coins, setCoins] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const steps = [
        {
            id: 1,
            title: "Preparation",
            instruction: "Get ready to shave.",
            options: [
                 {
                    id: "a",
                    text: "Wash face with warm water",
                    emoji: "🚿",
                    description: "Softens hair.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Start dry shaving",
                    emoji: "🌵",
                    description: "Ouch!",
                    isCorrect: false
                },
               
                {
                    id: "c",
                    text: "Put on cologne",
                    emoji: "🧴",
                    description: "Not yet.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            title: "Lather Up",
            instruction: "Apply product.",
            options: [
                {
                    id: "c",
                    text: "Use toothpaste",
                    emoji: "🦷",
                    description: "Wrong product.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Apply shaving cream/gel",
                    emoji: "🧼",
                    description: "Protects skin.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Use nothing",
                    emoji: "🚫",
                    description: "Need lubrication.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            title: "The Shave",
            instruction: "Start shaving.",
            options: [
                {
                    id: "b",
                    text: "Press very hard",
                    emoji: "💪",
                    description: "Causes cuts.",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Gentle strokes with grain",
                    emoji: "⬇️",
                    description: "Safe and effective.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Shave against grain fast",
                    emoji: "⬆️",
                    description: "Irritation risk.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            title: "Rinse",
            instruction: "Clean up.",
            options: [
                {
                    id: "c",
                    text: "Leave cream on",
                    emoji: "👻",
                    description: "Wash it off.",
                    isCorrect: false
                },
               
                {
                    id: "b",
                    text: "Wipe with dirty towel",
                    emoji: "🧣",
                    description: "Use clean towel.",
                    isCorrect: false
                },
                 {
                    id: "a",
                    text: "Rinse with cool water",
                    emoji: "💧",
                    description: "Closes pores.",
                    isCorrect: true
                },
            ]
        },
        {
            id: 5,
            title: "Aftercare",
            instruction: "Finish up.",
            options: [
                {
                    id: "a",
                    text: "Apply moisturizer/balm",
                    emoji: "🧴",
                    description: "Hydrates skin.",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Scratch face",
                    emoji: "💅",
                    description: "Don't irritate skin.",
                    isCorrect: false
                },
                
                {
                    id: "c",
                    text: "Go out in sun immediately",
                    emoji: "☀️",
                    description: "Skin is sensitive.",
                    isCorrect: false
                }
            ]
        }
    ];

    const handleChoice = (optionId) => {
        const selectedOption = steps[currentStep].options.find(opt => opt.id === optionId);
        const isCorrect = selectedOption.isCorrect;

        if (isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        }

        setTimeout(() => {
            if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setGameFinished(true);
            }
        }, 1500);
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/reflex-shaving-teen");
    };

    return (
        <GameShell
            title="Shaving Simulation"
            subtitle={`Step: ${steps[currentStep].title}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={steps.length}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/80">Step {currentStep + 1}/{steps.length}</span>
                        <span className="text-yellow-400 font-bold">Coins: {coins}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h3>
                    <p className="text-white text-lg mb-6">
                        {steps[currentStep].instruction}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {steps[currentStep].options.map(option => (
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

export default TeenShavingSimulation;
