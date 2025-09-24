import React, { useState, useEffect } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const TrafficLightAI = () => {
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [light, setLight] = useState("green"); // 🚦 current light
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [round, setRound] = useState(0);
    const [clicked, setClicked] = useState(false);

    const totalRounds = 5;

    // 🔄 Change light every 2 seconds
    useEffect(() => {
        if (round >= totalRounds) return;

        const timer = setInterval(() => {
            const lights = ["red", "yellow", "green"];
            const nextLight = lights[Math.floor(Math.random() * lights.length)];
            setLight(nextLight);
            setClicked(false); // reset click for each round
        }, 2000);

        return () => clearInterval(timer);
    }, [round]);

    const handleClick = (choice) => {
        if (clicked) return; // prevent double click
        setClicked(true);

        let correct = false;
        if (light === "red" && choice === "STOP") correct = true;
        if (light === "green" && choice === "GO") correct = true;
        if (light === "yellow" && choice === "READY") correct = true;

        if (correct) {
            setScore(prev => prev + 5);
            setFlashPoints(5);
            setFeedback({ message: `✅ Correct! Light was ${light.toUpperCase()}.`, type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Oops! Light was ${light.toUpperCase()}.`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNext = () => {
        setFeedback({ message: "", type: "" });
        setShowConfetti(false);

        if (round < totalRounds - 1) {
            setRound(prev => prev + 1);
        } else {
            setShowModal(true);
        }
    };

    return (
        <GameShell
            gameId="traffic-light-ai"
            gameType="ai"
            totalLevels={totalRounds}
            title="Traffic Light AI"
            subtitle="Click the right action for the traffic light, just like AI in self-driving cars!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {round + 1}/{totalRounds}
                </div>
            }
            onNext={handleNext}
            nextEnabled={!!feedback.message}
            showGameOver={showModal}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="traffic-light-ai" gameType="ai" levelNumber={round + 1}>
                <GameCard>
                    <div className="flex flex-col items-center">
                        <p className="text-xl font-bold text-white mb-4">🚗 Car is moving...</p>
                        {/* Traffic Light */}
                        <div className="w-16 h-40 bg-black rounded-lg flex flex-col justify-around items-center p-2">
                            <div className={`w-10 h-10 rounded-full ${light === "red" ? "bg-red-500" : "bg-red-800/40"}`}></div>
                            <div className={`w-10 h-10 rounded-full ${light === "yellow" ? "bg-yellow-500" : "bg-yellow-800/40"}`}></div>
                            <div className={`w-10 h-10 rounded-full ${light === "green" ? "bg-green-500" : "bg-green-800/40"}`}></div>
                        </div>
                    </div>
                </GameCard>
            </LevelCompleteHandler>

            {!feedback.message ? (
                <div className="flex justify-center gap-4 mt-6">
                    <OptionButton option="STOP" onClick={() => handleClick("STOP")} />
                    <OptionButton option="READY" onClick={() => handleClick("READY")} />
                    <OptionButton option="GO" onClick={() => handleClick("GO")} />
                </div>
            ) : (
                <FeedbackBubble message={feedback.message} type={feedback.type} />
            )}
        </GameShell>
    );
};

export default TrafficLightAI;
