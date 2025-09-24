import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const SmartFridgeStory = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const scenarios = [
        {
            id: 1,
            story: "🥛 Your fridge sends you a reminder: 'Buy more milk!'",
            correctAnswer: "AI",
            options: ["AI", "Human"],
            rewardPoints: 10,
        },
        {
            id: 2,
            story: "🥖 Your smart fridge suggests: 'You have eggs expiring tomorrow.'",
            correctAnswer: "AI",
            options: ["AI", "Human"],
            rewardPoints: 10,
        },
        {
            id: 3,
            story: "🍎 The fridge orders apples when it detects you're running low.",
            correctAnswer: "AI",
            options: ["AI", "Human"],
            rewardPoints: 10,
        },
        {
            id: 4,
            story: "🌡️ Your fridge adjusts temperature based on the food inside.",
            correctAnswer: "AI",
            options: ["AI", "Human"],
            rewardPoints: 10,
        },
        {
            id: 5,
            story: "🍽️ Can your smart fridge cook dinner for you?",
            correctAnswer: "Human",
            options: ["AI", "Human"],
            rewardPoints: 10,
        },
    ];

    const currentScenario = scenarios[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentScenario.correctAnswer) {
            setScore(prev => prev + currentScenario.rewardPoints);
            setFlashPoints(currentScenario.rewardPoints);
            setFeedback({ message: "✅ Correct! The smart fridge uses AI to remind you.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! The correct answer is ${currentScenario.correctAnswer}.`, type: "wrong" });
            setShowConfetti(false);
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
            gameId="smart-fridge-story"
            gameType="ai"
            totalLevels={scenarios.length}
            title="Smart Fridge Story"
            subtitle="Discover how smart homes use AI!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{scenarios.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="smart-fridge-story" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentScenario.story}</p>
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

export default SmartFridgeStory;
