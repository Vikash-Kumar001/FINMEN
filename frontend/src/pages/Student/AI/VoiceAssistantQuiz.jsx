import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const VoiceAssistantQuiz = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const questions = [
        {
            id: 1,
            scenario: "🎤 Is Siri/Alexa an AI?",
            correctAnswer: "Yes",
            options: ["Yes", "No"],
            rewardPoints: 5,
        },
        {
            id: 2,
            scenario: "🎧 Can Siri understand different languages?",
            correctAnswer: "Yes",
            options: ["Yes", "No"],
            rewardPoints: 5,
        },
        {
            id: 3,
            scenario: "📦 Can Alexa order items online for you?",
            correctAnswer: "Yes",
            options: ["Yes", "No"],
            rewardPoints: 5,
        },
        {
            id: 4,
            scenario: "🎵 Can voice assistants play your favorite music?",
            correctAnswer: "Yes",
            options: ["Yes", "No"],
            rewardPoints: 5,
        },
        {
            id: 5,
            scenario: "🚗 Can voice assistants drive a car for you?",
            correctAnswer: "No",
            options: ["Yes", "No"],
            rewardPoints: 5,
        },
    ];

    const currentQuestion = questions[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentQuestion.correctAnswer) {
            setScore(prev => prev + currentQuestion.rewardPoints);
            setFlashPoints(currentQuestion.rewardPoints);
            setFeedback({ message: "✅ Correct! Great job!", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! The correct answer is ${currentQuestion.correctAnswer}.`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);
        if (currentLevelIndex < questions.length - 1) {
            setCurrentLevelIndex((prev) => prev + 1);
            setFeedback({ message: "", type: "" });
            setSelectedOption(null);
            setIsOptionDisabled(false);
        } else {
            setGameOver(true);
        }
    };

    return (
        <GameShell
            gameId="voice-assistant-quiz"
            gameType="ai"
            totalLevels={questions.length}
            title="Voice Assistant Quiz"
            subtitle="Test your knowledge about voice assistants!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="voice-assistant-quiz" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentQuestion.scenario}</p>
                </GameCard>
            </LevelCompleteHandler>

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

export default VoiceAssistantQuiz;
