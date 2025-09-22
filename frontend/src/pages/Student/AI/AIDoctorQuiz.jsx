import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AIDoctorQuiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [flashPoints, setFlashPoints] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const questions = [
        { question: "🩻 Can AI detect cancer in X-ray?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { question: "🧪 Can AI help doctors by analyzing blood tests?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { question: "🤖 Is AI used to assist in surgery planning?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { question: "💊 Can AI suggest possible diseases from symptoms?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
        { question: "👩‍⚕️ Does AI completely replace doctors?", correctAnswer: "No", options: ["Yes", "No"], rewardPoints: 5 },
    ];

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentQuestion.correctAnswer) {
            setScore((prev) => prev + currentQuestion.rewardPoints);
            setFlashPoints(currentQuestion.rewardPoints);
            setFeedback({ message: "✅ Correct! AI is helping doctors.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! Correct answer: ${currentQuestion.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextQuestion = () => {
        setShowConfetti(false);
        setSelectedOption(null);
        setIsOptionDisabled(false);
        setFeedback({ message: "", type: "" });

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setGameOver(true);
        }
    };

    return (
        <GameShell
            title="AI Doctor Quiz"
            subtitle="Learn how AI helps in medicine!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentQuestionIndex + 1}/{questions.length}
                </div>
            }
            onNext={handleNextQuestion}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={gameOver}
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

            {feedback.message && (
                <FeedbackBubble message={feedback.message} type={feedback.type} />
            )}
        </GameShell>
    );
};

export default AIDoctorQuiz;
