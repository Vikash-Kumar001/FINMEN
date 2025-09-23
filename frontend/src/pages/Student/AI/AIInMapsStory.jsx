import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const AIInMapsStory = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const stories = [
        {
            id: 1,
            scenario: "🚗 Mom wants the shortest road to the market. Who helps?",
            correctAnswer: "Google Maps AI",
            options: ["Google Maps AI", "Guessing"],
            rewardPoints: 10,
        },
        {
            id: 2,
            scenario: "🚕 Dad needs to avoid traffic jams. What shows the best route?",
            correctAnswer: "AI navigation",
            options: ["AI navigation", "Random choice"],
            rewardPoints: 10,
        },
        {
            id: 3,
            scenario: "🏠 You're lost and need directions home. What guides you?",
            correctAnswer: "GPS AI system",
            options: ["GPS AI system", "Following stars"],
            rewardPoints: 10,
        },
        {
            id: 4,
            scenario: "🏭 Maps show current weather for your trip. How does it know?",
            correctAnswer: "AI data analysis",
            options: ["AI data analysis", "Crystal ball"],
            rewardPoints: 10,
        },
        {
            id: 5,
            scenario: "🎪 Maps suggest nearby restaurants. What makes these recommendations?",
            correctAnswer: "AI algorithms",
            options: ["AI algorithms", "Lucky guess"],
            rewardPoints: 10,
        },
    ];

    const currentStory = stories[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentStory.correctAnswer) {
            setScore(prev => prev + currentStory.rewardPoints);
            setFlashPoints(currentStory.rewardPoints);
            setFeedback({ message: "✅ Correct! AI in Maps helps navigate efficiently.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! The correct answer is ${currentStory.correctAnswer}.`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);
        if (currentLevelIndex < stories.length - 1) {
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
            gameId="ai-in-maps-story"
            gameType="ai"
            totalLevels={stories.length}
            title="AI in Maps Story"
            subtitle="Discover how AI helps with navigation!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{stories.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="ai-in-maps-story" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentStory.scenario}</p>
                </GameCard>
            </LevelCompleteHandler>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentStory.options.map((option, idx) => (
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

export default AIInMapsStory;
