import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const MusicAIStory = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Five story prompts for music AI awareness
    const stories = [
        { id: 1, scenario: "Song app makes playlist for morning jog. Who chose songs?", correctAnswer: "AI", options: ["AI", "Kid"], rewardPoints: 10 },
        { id: 2, scenario: "Song app creates bedtime playlist. Who chose songs?", correctAnswer: "AI", options: ["AI", "Kid"], rewardPoints: 10 },
        { id: 3, scenario: "Song app makes party playlist. Who chose songs?", correctAnswer: "AI", options: ["AI", "Kid"], rewardPoints: 10 },
        { id: 4, scenario: "Song app selects study playlist. Who chose songs?", correctAnswer: "AI", options: ["AI", "Kid"], rewardPoints: 10 },
        { id: 5, scenario: "Song app generates chill playlist for evening. Who chose songs?", correctAnswer: "AI", options: ["AI", "Kid"], rewardPoints: 10 },
    ];

    const currentStory = stories[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentStory.correctAnswer) {
            setScore(prev => prev + currentStory.rewardPoints);
            setFlashPoints(currentStory.rewardPoints);
            setFeedback({ message: "Correct! AI chose the songs.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `Wrong! Correct answer: ${currentStory.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);

        if (currentLevelIndex < stories.length - 1) {
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
            title="Music AI Story"
            subtitle="Who chose the songs?"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{stories.length}
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
                <p className="text-xl font-bold text-white">{currentStory.scenario}</p>
                <p className="mt-2 text-white/70 text-sm">Choose who selected the songs: AI or Kid.</p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentStory.options.map((option, idx) => (
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

export default MusicAIStory;
