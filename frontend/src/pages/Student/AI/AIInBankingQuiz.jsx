import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AIInBankingQuiz = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Five quiz questions for finance AI awareness
    const quizzes = [
        { id: 1, question: "ATM detecting fraud = AI?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 2, question: "AI approves loan faster than humans?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 3, question: "AI can analyze spending patterns?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 4, question: "AI predicts credit card fraud?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 5, question: "AI replaces bank managers entirely?", correctAnswer: "No", options: ["Yes", "No"], rewardPoints: 5 },
    ];

    const currentQuiz = quizzes[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentQuiz.correctAnswer) {
            setScore(prev => prev + currentQuiz.rewardPoints);
            setFlashPoints(currentQuiz.rewardPoints);
            setFeedback({ message: "Correct! AI helps in banking.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `Wrong! Correct answer: ${currentQuiz.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);

        if (currentLevelIndex < quizzes.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsOptionDisabled(false);
            setFeedback({ message: "", type: "" });
        } else {
            setShowModal(true);
        }
    };

    return (
        <GameShell
            title="AI in Banking Quiz"
            subtitle="Test your finance AI knowledge!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{quizzes.length}
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
                <p className="text-xl font-bold text-white">{currentQuiz.question}</p>
                <p className="mt-2 text-white/70 text-sm">Choose the correct answer: Yes or No</p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentQuiz.options.map((option, idx) => (
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

export default AIInBankingQuiz;
