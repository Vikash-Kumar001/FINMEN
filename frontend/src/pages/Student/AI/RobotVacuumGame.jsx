import React, { useState, useEffect } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const RobotVacuumGame = () => {
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [currentObstacle, setCurrentObstacle] = useState(null);
    const [obstaclesLeft, setObstaclesLeft] = useState(10); // total turns
    const [showModal, setShowModal] = useState(false);

    const obstacleList = ["🪑", "📦", "🛋️", "🚪", "none"]; // obstacles including "none"

    // Randomly set next obstacle every 1.5s
    useEffect(() => {
        if (obstaclesLeft <= 0) {
            setShowModal(true);
            return;
        }

        const timer = setTimeout(() => {
            const next = obstacleList[Math.floor(Math.random() * obstacleList.length)];
            setCurrentObstacle(next);
            setIsOptionDisabled(false);
            setFeedback({ message: "", type: "" });
        }, 1500);

        return () => clearTimeout(timer);
    }, [obstaclesLeft]);

    const handleTurnClick = () => {
        if (isOptionDisabled) return;

        setIsOptionDisabled(true);

        if (currentObstacle !== "none") {
            setScore(prev => prev + 5);
            setFlashPoints(5);
            setFeedback({ message: "✅ Correct! Robot turned to avoid obstacle.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: "❌ Wrong! No obstacle to turn.", type: "wrong" });
            setShowConfetti(false);
        }

        setObstaclesLeft(prev => prev - 1);
    };

    return (
        <GameShell
            title="Robot Vacuum Reflex Game"
            subtitle="Click 'Turn' when an obstacle appears!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ Obstacles left: {obstaclesLeft}
                </div>
            }
            showGameOver={showModal}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <GameCard>
                <p className="text-4xl">{currentObstacle || "🤖"}</p>
            </GameCard>

            <div className="flex justify-center mt-4">
                <OptionButton
                    option="Turn"
                    onClick={handleTurnClick}
                    selected={null}
                    disabled={isOptionDisabled}
                />
            </div>

            {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
        </GameShell>
    );
};

export default RobotVacuumGame;
