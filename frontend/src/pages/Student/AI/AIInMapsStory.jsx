import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AIInMapsStory = () => {
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Single story scenario
    const story = {
        id: 1,
        scenario: "🚗 Mom wants the shortest road to the market. Who helps?",
        correctAnswer: "Google Maps AI",
        options: ["Google Maps AI", "Guessing"],
        rewardPoints: 10,
    };

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === story.correctAnswer) {
            setScore(prev => prev + story.rewardPoints);
            setFlashPoints(story.rewardPoints);
            setFeedback({ message: "✅ Correct! AI in Maps finds the shortest road.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: "❌ Wrong! It's Google Maps AI that helps.", type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNext = () => {
        setShowConfetti(false);
        setShowModal(true); // only 1 scenario → end game
    };

    return (
        <GameShell
            title="AI in Maps Story"
            subtitle="Who helps Mom find the shortest road?"
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
                <p className="text-xl font-bold text-white">{story.scenario}</p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {story.options.map((option, idx) => (
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
