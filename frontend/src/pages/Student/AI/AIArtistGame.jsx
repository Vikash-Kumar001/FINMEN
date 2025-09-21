import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AIArtistGame = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Five prompts for the AI drawing simulation
    const prompts = [
        { id: 1, prompt: "Draw a cat.", correctAnswer: "AI drew a cat!", options: ["AI drew a cat!", "Kid drew a cat!"], rewardPoints: 10 },
        { id: 2, prompt: "Draw a house.", correctAnswer: "AI drew a house!", options: ["AI drew a house!", "Kid drew a house!"], rewardPoints: 10 },
        { id: 3, prompt: "Draw a tree.", correctAnswer: "AI drew a tree!", options: ["AI drew a tree!", "Kid drew a tree!"], rewardPoints: 10 },
        { id: 4, prompt: "Draw a dog.", correctAnswer: "AI drew a dog!", options: ["AI drew a dog!", "Kid drew a dog!"], rewardPoints: 10 },
        { id: 5, prompt: "Draw a car.", correctAnswer: "AI drew a car!", options: ["AI drew a car!", "Kid drew a car!"], rewardPoints: 10 },
    ];

    const currentPrompt = prompts[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentPrompt.correctAnswer) {
            setScore(prev => prev + currentPrompt.rewardPoints);
            setFlashPoints(currentPrompt.rewardPoints);
            setFeedback({ message: "Correct! AI did the drawing.", type: "correct" });
            setShowConfetti(true);
            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `Wrong! Correct: ${currentPrompt.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);

        if (currentLevelIndex < prompts.length - 1) {
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
            title="AI Artist Game"
            subtitle="Type prompts and see AI draw!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{prompts.length}
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
                <p className="text-xl font-bold text-white">{currentPrompt.prompt}</p>
                <p className="mt-2 text-white/70 text-sm">
                    AI responds by drawing the requested object.
                </p>
            </GameCard>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {currentPrompt.options.map((option, idx) => (
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

export default AIArtistGame;
