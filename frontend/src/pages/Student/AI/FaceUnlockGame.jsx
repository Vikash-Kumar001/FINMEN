import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const FaceUnlockGame = () => {
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [flashPoints, setFlashPoints] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const scenario = {
        question: "📱 Phone is locked. Which face will unlock it?",
        options: ["Correct Face", "Wrong Face"],
        correctAnswer: "Correct Face",
        rewardPoints: 5,
    };

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === scenario.correctAnswer) {
            setScore((prev) => prev + scenario.rewardPoints);
            setFeedback({ message: "✅ Phone Unlocked!", type: "correct" });
            setFlashPoints(scenario.rewardPoints);
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);

            // End game after short delay
            setTimeout(() => {
                setShowConfetti(false);
                setShowModal(true);
            }, 2000);
        } else {
            setFeedback({ message: "❌ Access Denied. Try again!", type: "wrong" });
        }
    };

    return (
        <GameShell
            title="Face Unlock Game"
            subtitle="Learn how AI unlocks your phone with facial recognition"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐
                </div>
            }
            onNext={() => setShowModal(true)}
            nextEnabled={!!feedback.message}
            showGameOver={showModal}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <GameCard>
                <p className="text-xl font-bold text-white">{scenario.question}</p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {scenario.options.map((option, idx) => (
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
