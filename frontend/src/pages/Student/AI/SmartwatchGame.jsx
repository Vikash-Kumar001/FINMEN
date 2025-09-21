import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const SmartwatchGame = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const scenarios = [
        { id: 1, scenario: "Your heartbeat rises during running. Watch says: 'Slow down.' What do you do?", correctAnswer: "Okay", options: ["Ignore", "Okay"], rewardPoints: 5 },
        { id: 2, scenario: "Your heart rate spikes during a game. Watch warns: 'Slow down.' Your action?", correctAnswer: "Okay", options: ["Okay", "Continue"], rewardPoints: 5 },
        { id: 3, scenario: "After climbing stairs, watch alerts high pulse. What do you click?", correctAnswer: "Okay", options: ["Okay", "No"], rewardPoints: 5 },
        { id: 4, scenario: "During exercise, smartwatch signals 'Slow down.' What is your response?", correctAnswer: "Okay", options: ["Ignore", "Okay"], rewardPoints: 5 },
        { id: 5, scenario: "Your heartbeat rises unusually. Watch says: 'Slow down.' Your choice?", correctAnswer: "Okay", options: ["Okay", "Keep going"], rewardPoints: 5 },
    ];

    const currentScenario = scenarios[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentScenario.correctAnswer) {
            setScore(prev => prev + currentScenario.rewardPoints);
            setFlashPoints(currentScenario.rewardPoints);
            setFeedback({ message: "Correct! Smartwatch helps monitor your health.", type: "correct" });
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
            title="Smartwatch Game"
            subtitle="Learn how AI in your smartwatch monitors health!"
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

            <GameCard>
                <p className="text-xl font-bold text-white">{currentScenario.scenario}</p>
            </GameCard>

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

export default SmartwatchGame;
