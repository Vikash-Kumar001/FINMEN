import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const OnlineShoppingAI = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const scenarios = [
        { id: 1, scenario: "Kid selects shoes. AI shows recommendations. Correct AI action?", correctAnswer: "Show similar items", options: ["Show similar items", "Do nothing"], rewardPoints: 5 },
        { id: 2, scenario: "Kid selects a backpack. AI suggests? ", correctAnswer: "Show similar items", options: ["Show similar items", "Show random items"], rewardPoints: 5 },
        { id: 3, scenario: "Kid clicks on headphones. AI responds with?", correctAnswer: "Show similar items", options: ["Show similar items", "Show unrelated items"], rewardPoints: 5 },
        { id: 4, scenario: "Kid selects a toy. AI should?", correctAnswer: "Show similar items", options: ["Show similar items", "Ignore selection"], rewardPoints: 5 },
        { id: 5, scenario: "Kid picks a jacket. AI action?", correctAnswer: "Show similar items", options: ["Show similar items", "Show discounted items only"], rewardPoints: 5 },
    ];

    const currentScenario = scenarios[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentScenario.correctAnswer) {
            setScore(prev => prev + currentScenario.rewardPoints);
            setFlashPoints(currentScenario.rewardPoints);
            setFeedback({ message: "Correct! AI helps find similar products.", type: "correct" });
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
            gameId="online-shopping-ai"
            gameType="ai"
            totalLevels={scenarios.length}
            title="Online Shopping AI"
            subtitle="See how AI recommends products in e-commerce!"
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

            <LevelCompleteHandler gameId="online-shopping-ai" gameType="ai" levelNumber={currentLevelIndex + 1}>
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

export default OnlineShoppingAI;
