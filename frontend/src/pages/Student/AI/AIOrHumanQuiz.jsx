import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const AIOrHumanQuiz = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [flashPoints, setFlashPoints] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const questions = [
        {
            text: "🌍 Did AI or Human create Google Translate?",
            options: ["AI", "Human"],
            correctAnswer: "AI",
            rewardPoints: 5,
        },
        {
            text: "📱 Who created the iPhone's Face ID technology?",
            options: ["AI", "Human"],
            correctAnswer: "AI",
            rewardPoints: 5,
        },
        {
            text: "🎵 Did AI or Human create Spotify's music recommendations?",
            options: ["AI", "Human"],
            correctAnswer: "AI",
            rewardPoints: 5,
        },
        {
            text: "🚗 Who invented the original car engine?",
            options: ["AI", "Human"],
            correctAnswer: "Human",
            rewardPoints: 5,
        },
        {
            text: "🎨 Did AI or Human paint the Mona Lisa?",
            options: ["AI", "Human"],
            correctAnswer: "Human",
            rewardPoints: 5,
        },
    ];

    const currentQuestion = questions[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentQuestion.correctAnswer) {
            setScore((prev) => prev + currentQuestion.rewardPoints);
            setFeedback({ message: "✅ Correct! Well done!", type: "correct" });
            setFlashPoints(currentQuestion.rewardPoints);
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! The correct answer is ${currentQuestion.correctAnswer}.`, type: "wrong" });
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
            gameId="ai-or-human-quiz"
            gameType="ai"
            totalLevels={questions.length}
            title="AI or Human Quiz"
            subtitle="Can you guess who created these technologies?"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="ai-or-human-quiz" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentQuestion.text}</p>
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

export default AIOrHumanQuiz;
