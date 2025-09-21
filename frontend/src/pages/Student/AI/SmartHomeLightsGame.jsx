import React, { useState } from "react";
import GameShell, {
    GameCard,
    OptionButton,
    FeedbackBubble,
    Confetti,
    ScoreFlash,
} from "./GameShell";

const SmartHomeLightsGame = () => {
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const scenario = {
        id: 1,
        text: "💡 The lights turn ON when the kid enters the room. Who did it?",
        correctAnswer: "AI did it",
        options: ["AI did it", "Magic", "Kid pressed switch"],
        rewardPoints: 5,
    };

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;
        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === scenario.correctAnswer) {
            setScore((prev) => prev + scenario.rewardPoints);
            setFlashPoints(scenario.rewardPoints);
            setFeedback({ message: "✅ Correct! Smart AI sensors did it.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({
                message: `❌ Wrong! Correct answer: ${scenario.correctAnswer}`,
                type: "wrong",
            });
            setShowConfetti(false);
        }
    };

    const handleFinish = () => {
        setGameOver(true);
    };

    return (
        <GameShell
            title="Smart Home Lights Game"
            subtitle="Learn how AI powers smart lights!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐
                </div>
            }
            onNext={handleFinish}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <GameCard>
                <p className="text-xl font-bold text-white">{scenario.text}</p>
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

            {feedback.message && (
                <FeedbackBubble message={feedback.message} type={feedback.type} />
            )}
        </GameShell>
    );
};

export default SmartHomeLightsGame;
