import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const AirportScannerStory = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const scenarios = [
        { id: 1, scenario: "Airport scans a bag and detects a forbidden knife. Who helps?", correctAnswer: "AI helps", options: ["AI helps", "Human guesses"], rewardPoints: 10 },
        { id: 2, scenario: "Scanner detects liquids above limit. Who finds it?", correctAnswer: "AI helps", options: ["AI helps", "Security guesses"], rewardPoints: 10 },
        { id: 3, scenario: "Scanner flags a suspicious item in a suitcase. Correct action?", correctAnswer: "AI helps", options: ["AI helps", "Ignore it"], rewardPoints: 10 },
        { id: 4, scenario: "Bag contains sharp scissors. Who identifies it?", correctAnswer: "AI helps", options: ["AI helps", "Random guess"], rewardPoints: 10 },
        { id: 5, scenario: "Scanner detects electronics in carry-on. Who recognizes potential risk?", correctAnswer: "AI helps", options: ["AI helps", "Human oversight"], rewardPoints: 10 },
    ];

    const currentScenario = scenarios[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentScenario.correctAnswer) {
            setScore(prev => prev + currentScenario.rewardPoints);
            setFlashPoints(currentScenario.rewardPoints);
            setFeedback({ message: "Correct! AI ensures airport security.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `Wrong! Correct: ${currentScenario.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);

        if (currentLevelIndex < scenarios.length - 1) {
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
            gameId="airport-scanner-story"
            gameType="ai"
            totalLevels={scenarios.length}
            title="Airport Scanner Story"
            subtitle="See how AI helps keep airports safe!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{scenarios.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={showModal}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="airport-scanner-story" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentScenario.scenario}</p>
                </GameCard>
            </LevelCompleteHandler>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentScenario.options.map((option, idx) => (
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

export default AirportScannerStory;
