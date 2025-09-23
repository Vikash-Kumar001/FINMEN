import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const YoutubeRecommendationGame = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const scenarios = [
        {
            id: 1,
            userChoice: "🎬 You choose to watch cartoons.",
            correctAnswer: "cartoon videos",
            options: ["cartoon videos", "sports highlights", "news", "cooking shows"],
            rewardPoints: 5,
        },
        {
            id: 2,
            userChoice: "🏈 You watch sports videos all day.",
            correctAnswer: "more sports content",
            options: ["more sports content", "cooking tutorials", "music videos", "documentaries"],
            rewardPoints: 5,
        },
        {
            id: 3,
            userChoice: "🎵 You listen to pop music frequently.",
            correctAnswer: "pop music playlists",
            options: ["pop music playlists", "classical music", "podcasts", "movie trailers"],
            rewardPoints: 5,
        },
        {
            id: 4,
            userChoice: "🍳 You search for 'how to cook pasta'.",
            correctAnswer: "cooking tutorials",
            options: ["cooking tutorials", "gaming videos", "travel vlogs", "tech reviews"],
            rewardPoints: 5,
        },
        {
            id: 5,
            userChoice: "📚 You watch educational science videos.",
            correctAnswer: "science documentaries",
            options: ["science documentaries", "comedy skits", "fashion videos", "gaming streams"],
            rewardPoints: 5,
        },
    ];

    const currentScenario = scenarios[currentLevelIndex];

    const handleOptionClick = (option) => {
        if (isOptionDisabled) return;

        setSelectedOption(option);
        setIsOptionDisabled(true);

        if (option === currentScenario.correctAnswer) {
            setScore(prev => prev + currentScenario.rewardPoints);
            setFlashPoints(currentScenario.rewardPoints);
            setFeedback({ message: "✅ Correct! YouTube AI learns your preferences.", type: "correct" });
            setShowConfetti(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({ message: `❌ Wrong! The AI would suggest: ${currentScenario.correctAnswer}`, type: "wrong" });
            setShowConfetti(false);
        }
    };

    const handleNextLevel = () => {
        setShowConfetti(false);
        if (currentLevelIndex < scenarios.length - 1) {
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
            gameId="youtube-recommendation-game"
            gameType="ai"
            totalLevels={scenarios.length}
            title="YouTube Recommendation Game"
            subtitle="See how YouTube AI recommends videos!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {currentLevelIndex + 1}/{scenarios.length}
                </div>
            }
            onNext={handleNextLevel}
            nextEnabled={!!feedback.message && isOptionDisabled}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="youtube-recommendation-game" gameType="ai" levelNumber={currentLevelIndex + 1}>
                <GameCard>
                    <p className="text-xl font-bold text-white">{currentScenario.userChoice}</p>
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

export default YoutubeRecommendationGame;
