import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const VoiceAssistantQuiz = () => {
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Single quiz question
    const question = {
        id: 1,
        scenario: "🎤 Is Siri/Alexa an AI?",
        correctAnswer: "Yes",
        options: ["Yes", "No"],
        rewardPoints: 5,
    };

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === question.correctAnswer) {
            setScore(prev => prev + question.rewardPoints);
            setFlashPoints(question.rewardPoints);
            setFeedback({ message: "✅ Correct! Siri and Alexa are AI voice assistants.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: "❌ Wrong! Siri and Alexa are AI.", type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNext = () => {
        setShowConfetti(false);
        setShowModal(true); // only one question → end game
    };

    return (
        <GameShell
            title="Voice Assistant Quiz"
            subtitle="Is Siri or Alexa an AI? Let's find out!"
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
                <p className="text-xl font-bold text-white">{question.scenario}</p>
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

export default VoiceAssistantQuiz;
