import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const SmartFridgeStory = () => {
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Story scenario
    const scenario = {
        id: 1,
        story: "🥛 Your fridge sends you a reminder: 'Buy more milk!'",
        correctAnswer: "AI",
        options: ["AI", "Human"],
        rewardPoints: 10,
    };

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === scenario.correctAnswer) {
            setScore(prev => prev + scenario.rewardPoints);
            setFlashPoints(scenario.rewardPoints);
            setFeedback({ message: "✅ Correct! The smart fridge uses AI to remind you.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: "❌ Wrong! It’s actually AI that reminds you.", type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNext = () => {
        setShowConfetti(false);
        setShowModal(true); // only one story → game ends
    };

    return (
        <GameShell
            title="Smart Fridge Story"
            subtitle="Discover how smart homes use AI!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐
                </div>
            }
            onNext={handleNext}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={showModal}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <GameCard>
                <p className="text-xl font-bold text-white">{scenario.story}</p>
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

export default SmartFridgeStory;
