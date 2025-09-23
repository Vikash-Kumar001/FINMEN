import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const AINewsStory = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [flashPoints, setFlashPoints] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const questions = [
        { scenario: "📰 The news app suggests a science article. Who recommended it?", correctAnswer: "AI", options: ["AI", "Teacher"], rewardPoints: 10 },
        { scenario: "📰 The app suggests a sports article for you. Who chose it?", correctAnswer: "AI", options: ["AI", "Teacher"], rewardPoints: 10 },
        { scenario: "📰 The app recommends a music article. Who decides?", correctAnswer: "AI", options: ["AI", "Teacher"], rewardPoints: 10 },
        { scenario: "📰 You see a tech article in your feed. Who suggested it?", correctAnswer: "AI", options: ["AI", "Teacher"], rewardPoints: 10 },
        { scenario: "📰 A cooking article appears in your recommendations. Who recommended it?", correctAnswer: "AI", options: ["AI", "Teacher"], rewardPoints: 10 },
    ];

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentQuestion.correctAnswer) {
            setScore(prev => prev + currentQuestion.rewardPoints);
            setFlashPoints(currentQuestion.rewardPoints);
            setFeedback({ message: "Correct! AI recommended this article.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `Wrong! Correct answer: ${currentQuestion.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextQuestion = () => {
        setShowConfetti(false);
        setSelectedOption(null);
        setIsOptionDisabled(false);
        setFeedback({ message: "", type: "" });

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGameOver(true);
        }
    };

    return (
        <GameShell
            gameId="ai-news-story"
            gameType="ai"
            totalLevels={questions.length}
            title="AI News Story"
            subtitle="Who recommended this article?"
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

            <LevelCompleteHandler gameId="ai-news-story" gameType="ai" levelNumber={currentQuestionIndex + 1}>
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

export default AINewsStory;
