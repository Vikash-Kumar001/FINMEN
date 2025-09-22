import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const YoutubeRecommendationGame = () => {
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Simulation scenario
    const scenario = {
        id: 1,
        userChoice: "🎬 You choose to watch cartoons.",
        correctAnswer: "cartoon videos",
        options: ["cartoon videos", "sports highlights", "news", "cooking shows"],
        rewardPoints: 5,
    };

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === scenario.correctAnswer) {
            setScore(prev => prev + scenario.rewardPoints);
            setFlashPoints(scenario.rewardPoints);
            setFeedback({ message: "✅ Correct! YouTube AI recommends cartoon videos.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! The AI would suggest: ${scenario.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNext = () => {
        setShowConfetti(false);
        setShowModal(true); // only one scenario → game ends
    };

    return (
        <GameShell
            title="YouTube Recommendation Game"
            subtitle="See how YouTube AI recommends videos!"
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
                <p className="text-xl font-bold text-white">{scenario.userChoice}</p>
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

export default YoutubeRecommendationGame;
