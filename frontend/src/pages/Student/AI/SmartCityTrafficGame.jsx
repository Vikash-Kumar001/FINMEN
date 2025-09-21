import React, { useState, useEffect } from "react";
import GameShell, { GameCard, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const trafficStates = ["Green", "Yellow", "Red"]; // Traffic light sequence

const SmartCityTrafficGame = () => {
    const [currentLight, setCurrentLight] = useState("Green");
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [level, setLevel] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const totalLevels = 5; // Five interactions per game

    // Change traffic light every 2 seconds
    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setCurrentLight(prev => {
                const currentIndex = trafficStates.indexOf(prev);
                const nextIndex = (currentIndex + 1) % trafficStates.length;
                return trafficStates[nextIndex];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [gameOver]);

    const handleStopClick = () => {
        if (isButtonDisabled) return;

        setIsButtonDisabled(true);

        if (currentLight === "Red") {
            setScore(prev => prev + 5);
            setFlashPoints(5);
            setFeedback({ message: "Correct! You stopped safely.", type: "correct" });
            setShowConfetti(true);
        } else {
            setFeedback({ message: `Wrong! Light was ${currentLight}.`, type: "wrong" });
            setShowConfetti(false);
        }

        setTimeout(() => setFlashPoints(null), 1000);
    };

    const handleNextLevel = () => {
        setLevel(prev => prev + 1);
        setIsButtonDisabled(false);
        setShowConfetti(false);
        setFeedback({ message: "", type: "" });

        if (level + 1 >= totalLevels) {
            setGameOver(true);
        }
    };

    return (
        <GameShell
            title="Smart City Traffic Game"
            subtitle="Stop at red lights and go on green!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {level + 1}/{totalLevels}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message && isButtonDisabled}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <GameCard>
                <p className="text-xl font-bold text-white mb-4">
                    Traffic Light: <span className={`font-extrabold ${currentLight === "Red" ? "text-red-500" : currentLight === "Yellow" ? "text-yellow-400" : "text-green-400"}`}>
                        {currentLight}
                    </span>
                </p>
                <button
                    onClick={handleStopClick}
                    disabled={isButtonDisabled}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    Stop
                </button>
            </GameCard>

            {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
        </GameShell>
    );
};

export default SmartCityTrafficGame;
