import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AIOrHumanQuiz = () => {
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [flashPoints, setFlashPoints] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const question = {
        text: "🌍 Did AI or Human create Google Translate?",
        options: ["AI", "Human"],
        correctAnswer: "AI",
        rewardPoints: 5,
    };

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === question.correctAnswer) {
            setScore((prev) => prev + question.rewardPoints);
            setFeedback({ message: "✅ Correct! AI powers Google Translate.", type: "correct" });
            setFlashPoints(question.rewardPoints);
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);

            // End after correct
            setTimeout(() => {
                setShowConfetti(false);
                setShowModal(true);
            }, 2000);
        } else {
            setFeedback({ message: "❌ Wrong! It’s AI that powers Google Translate.", type: "wrong" });
        }
    };

    return (
        <GameShell
            title="AI or Human Quiz"
            subtitle="Can you guess who made Google Translate?"
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
                <p className="text-xl font-bold text-white">{question.text}</p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {question.options.map((option, idx) => (
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

export default AIOrHumanQuiz;
