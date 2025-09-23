import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const WeatherPredictionStory = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const stories = [
        { id: 1, scenario: "News says: 'Tomorrow will be sunny.' Who predicts this?", correctAnswer: "AI", options: ["AI", "Guess"], rewardPoints: 10 },
        { id: 2, scenario: "Weather forecast shows heavy rain tomorrow. Who predicted?", correctAnswer: "AI", options: ["AI", "Guess"], rewardPoints: 10 },
        { id: 3, scenario: "Tomorrow there will be snow. Who provides prediction?", correctAnswer: "AI", options: ["AI", "Guess"], rewardPoints: 10 },
        { id: 4, scenario: "Meteorologists predict windstorm tomorrow. Who's helping?", correctAnswer: "AI", options: ["AI", "Guess"], rewardPoints: 10 },
        { id: 5, scenario: "Forecast says foggy morning. Who predicts?", correctAnswer: "AI", options: ["AI", "Guess"], rewardPoints: 10 },
    ];

    const currentStory = stories[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentStory.correctAnswer) {
            setScore(prev => prev + currentStory.rewardPoints);
            setFlashPoints(currentStory.rewardPoints);
            setFeedback({ message: "Correct! AI is predicting accurately.", type: "correct" });
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
            gameId="weather-prediction-story"
            gameType="ai"
            totalLevels={stories.length}
            title="Weather Prediction Story"
            subtitle="See how AI predicts the weather!"
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

            <LevelCompleteHandler gameId="weather-prediction-story" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentStory.scenario}</p>
                </GameCard>
            </LevelCompleteHandler>

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

export default WeatherPredictionStory;
