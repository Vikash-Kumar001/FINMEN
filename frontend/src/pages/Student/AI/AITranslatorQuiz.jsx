import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AITranslatorQuiz = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const questions = [
        { id: 1, question: "Is Google Translate AI?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 2, question: "Does AI detect the language automatically?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 3, question: "Can AI make mistakes in translation?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 4, question: "Is human input always needed for translation?", correctAnswer: "No", options: ["Yes", "No"], rewardPoints: 5 },
        { id: 5, question: "Does AI learn from previous translations?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
    ];

    const currentQuestion = questions[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentQuestion.correctAnswer) {
            setScore(prev => prev + currentQuestion.rewardPoints);
            setFlashPoints(currentQuestion.rewardPoints);
            setFeedback({ message: "Correct! Well done.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `Wrong! Correct answer: ${currentQuestion.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);

        if (currentLevelIndex < questions.length - 1) {
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
            title="AI Translator Quiz"
            subtitle="Test your knowledge about AI translation!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}
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
                <p className="text-xl font-bold text-white">{currentQuestion.question}</p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentQuestion.options.map((option, idx) => (
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

export default AITranslatorQuiz;
