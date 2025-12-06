import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyHealthPuzzleTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-34";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const [coins, setCoins] = useState(0);
    const [currentPuzzle, setCurrentPuzzle] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const puzzles = [
        {
            id: 1,
            category: "Sleep",
            question: "What helps you SLEEP?",
            options: [
                { id: "a", text: "Dark Room", emoji: "🌑", isCorrect: true, explanation: "Darkness promotes sleep hormones." },
                { id: "b", text: "Loud Music", emoji: "🔊", isCorrect: false, explanation: "Too stimulating." },
                { id: "c", text: "Bright Screens", emoji: "📱", isCorrect: false, explanation: "Blue light keeps you awake." }
            ]
        },
        {
            id: 2,
            category: "Hygiene",
            question: "What fights ODOR?",
            options: [
                { id: "b", text: "Dirt", emoji: "💩", isCorrect: false, explanation: "Dirt causes odor." },
                { id: "a", text: "Soap", emoji: "🧼", isCorrect: true, explanation: "Soap cleans bacteria." },
                { id: "c", text: "Oil", emoji: "🛢️", isCorrect: false, explanation: "Oil traps dirt." }
            ]
        },
        {
            id: 3,
            category: "Stress",
            question: "What lowers STRESS?",
            options: [
                { id: "c", text: "Worrying", emoji: "😟", isCorrect: false, explanation: "Worrying increases stress." },
                { id: "b", text: "Fighting", emoji: "🥊", isCorrect: false, explanation: "Fighting causes stress." },
                { id: "a", text: "Deep Breathing", emoji: "🌬️", isCorrect: true, explanation: "Calms the nervous system." }
            ]
        },
        {
            id: 4,
            category: "Acne",
            question: "What helps ACNE?",
            options: [
                { id: "b", text: "Greasy Food", emoji: "🍟", isCorrect: false, explanation: "Can make it worse." },
                { id: "a", text: "Clean Face", emoji: "✨", isCorrect: true, explanation: "Prevents clogged pores." },
                { id: "c", text: "Touching Face", emoji: "👇", isCorrect: false, explanation: "Spreads bacteria." }
            ]
        },
        {
            id: 5,
            category: "Growth",
            question: "What builds MUSCLE?",
            options: [
                { id: "c", text: "Sitting", emoji: "🪑", isCorrect: false, explanation: "Muscles need use." },
                { id: "b", text: "Sugar", emoji: "🍬", isCorrect: false, explanation: "Sugar adds fat, not muscle." },
                { id: "a", text: "Activity", emoji: "🏃", isCorrect: true, explanation: "Exercise builds strength." }
            ]
        }
    ];

    const handleOptionSelect = (option) => {
        if (option.isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);

            setTimeout(() => {
                if (currentPuzzle < puzzles.length - 1) {
                    setCurrentPuzzle(prev => prev + 1);
                } else {
                    setGameFinished(true);
                }
            }, 1500);
        } else {
            showCorrectAnswerFeedback(0, false);
        }
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/shaving-story-teen");
    };

    const currentP = puzzles[currentPuzzle];

    return (
        <GameShell
            title="Puberty Health Puzzle"
            subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={puzzles.length}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-4">{currentP.question}</h3>
                        <p className="text-white/80">Match the solution!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {currentP.options.map((option) => (
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
                                <p className="text-white/70 text-sm text-center">{option.explanation}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </GameShell>
    );
};

export default PubertyHealthPuzzleTeen;
