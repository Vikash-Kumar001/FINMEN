import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";

const PeriodAwarenessJournal = () => {
    const location = useLocation();

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-37";

    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

    const [currentStage, setCurrentStage] = useState(0);
    const [score, setScore] = useState(0);
    const [entry, setEntry] = useState("");
    const [showResult, setShowResult] = useState(false);

    const stages = [
        {
            question: 'Write: "One new thing I learned about periods is ___."',
            minLength: 10,
        },
        {
            question: 'Write: "Why is it important to carry period supplies?"',
            minLength: 10,
        },
        {
            question: 'Write: "How can I support a friend who has their period?"',
            minLength: 10,
        },
        {
            question: 'Write: "A myth about periods that I know is false is ___."',
            minLength: 10,
        },
        {
            question: 'Write: "Understanding my body makes me feel ___."',
            minLength: 10,
        },
    ];

    const handleSubmit = () => {
        if (showResult) return;

        resetFeedback();
        const entryText = entry.trim();

        if (entryText.length >= stages[currentStage].minLength) {
            setScore((prev) => prev + 1);
            showCorrectAnswerFeedback(1, true);

            const isLastQuestion = currentStage === stages.length - 1;

            setTimeout(() => {
                if (isLastQuestion) {
                    setShowResult(true);
                } else {
                    setEntry("");
                    setCurrentStage((prev) => prev + 1);
                }
            }, 1500);
        }
    };

    return (
        <GameShell
            title="Journal of Period Awareness"
            subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Reflect on what you learned!` : "Journal Complete!"}
            currentLevel={currentStage + 1}
            totalLevels={5}
            coinsPerLevel={coinsPerLevel}
            showGameOver={showResult}
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            score={score}
            gameId={gameId}
            gameType="health-female"
            maxScore={maxScore}
            totalCoins={totalCoins}
            totalXp={totalXp}
            showConfetti={showResult && score === 5}
            backPath="/games/health-female/kids"
        >
            <div className="text-center text-white space-y-8">
                {!showResult && stages[currentStage] && (
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                        <PenSquare className="mx-auto mb-4 w-10 h-10 text-yellow-300" />
                        <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
                        <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
                        <p className="text-white/60 text-sm mb-4">
                            Write at least {stages[currentStage].minLength} characters
                        </p>
                        <textarea
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                            placeholder="Write your journal entry here..."
                            className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90 focus:outline-none focus:ring-4 focus:ring-blue-400"
                            disabled={showResult}
                            rows={4}
                        />
                        <div className="mt-2 text-white/50 text-sm">
                            {entry.trim().length}/{stages[currentStage].minLength} characters
                        </div>
                        <button
                            onClick={handleSubmit}
                            className={`mt-6 px-8 py-4 rounded-full text-lg font-semibold transition-all transform ${entry.trim().length >= stages[currentStage].minLength && !showResult
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 text-white shadow-lg cursor-pointer'
                                    : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
                                }`}
                            disabled={entry.trim().length < stages[currentStage].minLength || showResult}
                        >
                            {currentStage === stages.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
                        </button>
                    </div>
                )}
            </div>
        </GameShell>
    );
};

export default PeriodAwarenessJournal;
