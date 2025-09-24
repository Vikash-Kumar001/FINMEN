import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const FaceUnlockGame = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [flashPoints, setFlashPoints] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const scenarios = [
        {
            question: "📱 Phone is locked. Which face will unlock it?",
            options: ["Correct Face", "Wrong Face"],
            correctAnswer: "Correct Face",
            rewardPoints: 5,
        },
        {
            question: "😎 Can you unlock someone else's phone with your face?",
            options: ["Yes", "No"],
            correctAnswer: "No",
            rewardPoints: 5,
        },
        {
            question: "🌃 Does Face ID work in the dark?",
            options: ["Yes", "No"],
            correctAnswer: "Yes",
            rewardPoints: 5,
        },
        {
            question: "📷 Can a photo of you unlock Face ID?",
            options: ["Yes", "No"],
            correctAnswer: "No",
            rewardPoints: 5,
        },
        {
            question: "👶 Does Face ID work if you get older?",
            options: ["Yes", "No"],
            correctAnswer: "Yes",
            rewardPoints: 5,
        },
    ];

    const currentScenario = scenarios[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentScenario.correctAnswer) {
            setScore((prev) => prev + currentScenario.rewardPoints);
            setFeedback({ message: "✅ Correct! Face recognition works!", type: "correct" });
            setFlashPoints(currentScenario.rewardPoints);
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! The correct answer is ${currentScenario.correctAnswer}.`, type: "wrong" });
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);
        if (currentLevelIndex < scenarios.length - 1) {
            setCurrentLevelIndex((prev) => prev + 1);
            setFeedback({ message: "", type: "" });
            setSelectedOption(null);
            setIsOptionDisabled(false);
        } else {
            setGameOver(true);
        }
    };

    return (
        <GameShell
            gameId="face-unlock-game"
            gameType="ai"
            totalLevels={scenarios.length}
            title="Face Unlock Game"
            subtitle="Learn how AI unlocks your phone with facial recognition"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{scenarios.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="face-unlock-game" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentScenario.question}</p>
                </GameCard>
            </LevelCompleteHandler>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentScenario.options.map((option, idx) => (
                    <OptionButton
                        key={idx}
                        option={option}
                        onClick={handleOptionClick}
                        selected={selectedOption}
                        disabled={isOptionDisabled}
                        feedback={feedback}
                    />
                ))}
            </div>

            {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
        </GameShell>
    );
};

export default FaceUnlockGame;
