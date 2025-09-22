import React, { useState } from "react";
import GameShell, {
    GameCard,
    FeedbackBubble,
    Confetti,
    ScoreFlash,
} from "./GameShell";

const AIDailyLifeBadge = () => {
    const [completedGames, setCompletedGames] = useState(0);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [showConfetti, setShowConfetti] = useState(false);
    const [badgeUnlocked, setBadgeUnlocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const totalRequired = 10; // must finish 10 daily AI games
    const rewardPoints = 20;

    const handleCompleteGame = () => {
        if (badgeUnlocked) return;

        const newCount = completedGames + 1;
        setCompletedGames(newCount);

        if (newCount >= totalRequired) {
            setBadgeUnlocked(true);
            setScore((prev) => prev + rewardPoints);
            setFlashPoints(rewardPoints);
            setFeedback({
                message: "🏅 Congratulations! You unlocked the 'AI Explorer' badge!",
                type: "correct",
            });
            setShowConfetti(true);
            setGameOver(true);

            setTimeout(() => setFlashPoints(null), 1000);
        } else {
            setFeedback({
                message: `✅ Progress saved! You have completed ${newCount}/${totalRequired} AI games.`,
                type: "correct",
            });
        }
    };

    return (
        <GameShell
            title="AI Daily Life Badge"
            subtitle="Complete 10 daily AI games to earn your badge!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐ {completedGames}/{totalRequired}
                </div>
            }
            onNext={handleCompleteGame}
            nextEnabled={!badgeUnlocked}
            showGameOver={gameOver}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <GameCard>
                <p className="text-xl font-bold text-white">
                    {badgeUnlocked
                        ? "🎉 You are now an AI Explorer!"
                        : "Play AI daily life games to unlock your badge."}
                </p>
            </GameCard>

            {feedback.message && (
                <div className="mt-4">
                    <FeedbackBubble message={feedback.message} type={feedback.type} />
                </div>
            )}

            {badgeUnlocked && (
                <div className="mt-6 flex flex-col items-center">
                    <span className="text-5xl">🏅</span>
                    <p className="text-white font-bold mt-2">AI Explorer Badge</p>
                </div>
            )}
        </GameShell>
    );
};

export default AIDailyLifeBadge;
