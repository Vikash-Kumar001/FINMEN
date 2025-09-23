import React, { useState } from "react";
import GameShell, {
    GameCard,
    OptionButton,
    FeedbackBubble,
    Confetti,
    ScoreFlash,
    LevelCompleteHandler,
} from "./GameShell";

const SmartHomeLightsGame = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const scenarios = [
        {
            id: 1,
            text: "💡 The lights turn ON when the kid enters the room. Who did it?",
            correctAnswer: "AI did it",
            options: ["AI did it", "Magic", "Kid pressed switch"],
            rewardPoints: 5,
        },
        {
            id: 2,
            text: "🌅 The lights automatically dim at sunset. Who controls this?",
            correctAnswer: "AI sensors",
            options: ["AI sensors", "Manual timer", "Random luck"],
            rewardPoints: 5,
        },
        {
            id: 3,
            text: "🛏️ Lights turn off when you go to sleep. How does it know?",
            correctAnswer: "AI detects movement",
            options: ["AI detects movement", "It guesses", "Someone watches you"],
            rewardPoints: 5,
        },
        {
            id: 4,
            text: "🌡️ Lights change color based on room temperature. What makes this possible?",
            correctAnswer: "AI algorithms",
            options: ["AI algorithms", "Magic colors", "Weather outside"],
            rewardPoints: 5,
        },
        {
            id: 5,
            text: "📱 You control lights from your phone while away. What enables this?",
            correctAnswer: "AI connectivity",
            options: ["AI connectivity", "Telepathy", "Voice shouting"],
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
            setFlashPoints(currentScenario.rewardPoints);
            setFeedback({ message: "✅ Correct! Smart AI sensors control the lights.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({
                message: `❌ Wrong! Correct answer: ${currentScenario.correctAnswer}`,
                type: "wrong",
            });
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
            gameId="smart-home-lights-game"
            gameType="ai"
            totalLevels={scenarios.length}
            title="Smart Home Lights Game"
            subtitle="Learn how AI powers smart lights!"
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

            <LevelCompleteHandler gameId="smart-home-lights-game" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentScenario.text}</p>
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

            {feedback.message && (
                <FeedbackBubble message={feedback.message} type={feedback.type} />
            )}
        </GameShell>
    );
};

export default SmartHomeLightsGame;
