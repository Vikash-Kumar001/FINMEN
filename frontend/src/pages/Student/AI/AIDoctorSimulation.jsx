import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AIDoctorSimulation = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const cases = [
        {
            id: 1,
            symptoms: "🤒 Robot shows: Fever, cough, sore throat.",
            correctAnswer: "Flu",
            options: ["Flu", "Broken leg", "Allergy", "Cold"],
            rewardPoints: 10,
        },
        {
            id: 2,
            symptoms: "🤢 Robot shows: Stomach pain, nausea, vomiting.",
            correctAnswer: "Food Poisoning",
            options: ["Food Poisoning", "Flu", "Migraine", "Sprained ankle"],
            rewardPoints: 10,
        },
        {
            id: 3,
            symptoms: "🤕 Robot shows: Headache, dizziness, blurred vision.",
            correctAnswer: "Migraine",
            options: ["Migraine", "Flu", "Broken arm", "Allergy"],
            rewardPoints: 10,
        },
        {
            id: 4,
            symptoms: "🤧 Robot shows: Sneezing, runny nose, itchy eyes.",
            correctAnswer: "Allergy",
            options: ["Allergy", "Flu", "Food Poisoning", "Migraine"],
            rewardPoints: 10,
        },
        {
            id: 5,
            symptoms: "🏃 Robot shows: Swollen ankle, pain, bruising.",
            correctAnswer: "Sprained ankle",
            options: ["Sprained ankle", "Flu", "Migraine", "Allergy"],
            rewardPoints: 10,
        },
    ];

    const currentCase = cases[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentCase.correctAnswer) {
            setScore(prev => prev + currentCase.rewardPoints);
            setFlashPoints(currentCase.rewardPoints);
            setFeedback({ message: "✅ Correct! AI suggests the right disease.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! Correct answer: ${currentCase.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);

        if (currentLevelIndex < cases.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
            setSelectedOption(null);
            setFeedback({ message: "", type: "" });
            setIsOptionDisabled(false);
        } else {
            setShowModal(true);
        }
    };

    return (
        <GameShell
            title="AI Doctor Simulation"
            subtitle="Help the AI diagnose correctly!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{cases.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={showModal}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <GameCard>
                <p className="text-xl font-bold text-white">{currentCase.symptoms}</p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentCase.options.map((option, idx) => (
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

export default AIDoctorSimulation;
