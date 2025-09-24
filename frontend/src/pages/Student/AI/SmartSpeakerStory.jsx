import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const SmartSpeakerStory = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const questions = [
        { id: 1, text: "🎵 Kid says: 'Play music.' What happens?", correctAnswer: "AI", options: ["AI", "Magic"], rewardPoints: 10 },
        { id: 2, text: "⏰ Kid says: 'Set alarm for 7 AM.' What makes it work?", correctAnswer: "AI", options: ["AI", "Magic"], rewardPoints: 10 },
        { id: 3, text: "📖 Kid says: 'Read me a story.' Who helps?", correctAnswer: "AI", options: ["AI", "Magic"], rewardPoints: 10 },
        { id: 4, text: "🌡️ Kid says: 'What's the weather today?' Who answers?", correctAnswer: "AI", options: ["AI", "Magic"], rewardPoints: 10 },
        { id: 5, text: "💡 Kid says: 'Turn on the lights.' Who controls it?", correctAnswer: "AI", options: ["AI", "Magic"], rewardPoints: 10 },
    ];

    const currentQuestion = questions[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentQuestion.correctAnswer) {
            setScore(prev => prev + currentQuestion.rewardPoints);
            setFlashPoints(currentQuestion.rewardPoints);
            setFeedback({ message: "✅ Correct! AI makes it possible.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! Correct answer: ${currentQuestion.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);

        if (currentLevelIndex < questions.length - 1) {
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
            gameId="smart-speaker-story"
            gameType="ai"
            totalLevels={questions.length}
            title="Smart Speaker Story"
            subtitle="Guess how AI helps your smart speaker!"
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

            <LevelCompleteHandler gameId="smart-speaker-story" gameType="ai" levelNumber={currentLevelIndex + 1}>
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

export default SmartSpeakerStory;
