import React, { useState } from "react";
import GameShell, {
  GameCard,
  FeedbackBubble,
  Confetti,
  ScoreFlash,
  LevelCompleteHandler,
} from "./GameShell";

const EmojiClassifier = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash

  const emojiLevels = [
    { id: 1, emoji: "😊", correctAnswer: "happy" },
    { id: 2, emoji: "😃", correctAnswer: "happy" },
    { id: 3, emoji: "😢", correctAnswer: "sad" },
    { id: 4, emoji: "😭", correctAnswer: "sad" },
    { id: 5, emoji: "🙂", correctAnswer: "happy" },
  ];

  const currentEmoji = emojiLevels[currentIndex];

  const handleBucketClick = (bucket) => {
    if (!currentEmoji || answered) return;

    if (bucket === currentEmoji.correctAnswer) {
      setScore((prev) => prev + 2);
      setFlashPoints(2); // ✅ trigger score flash
      setFeedback({ message: "Great! Correct!", type: "correct" });
      setShowConfetti(true);

      // hide flash after 1 second
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({
        message: `Oops! That was ${currentEmoji.correctAnswer}`,
        type: "wrong",
      });
      setShowConfetti(false);
    }

    setAnswered(true); // ✅ allow "Next" button to appear
  };

  const handleNext = () => {
    setShowConfetti(false);

    if (currentIndex < emojiLevels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback({ message: "", type: "" });
      setAnswered(false);
    } else {
      setShowGameOver(true);
    }
  };

  return (
    <GameShell
      gameId="emoji-classifier"
      gameType="ai"
      totalLevels={emojiLevels.length}
      title="Emoji Classifier"
      subtitle="Click the correct bucket for each emoji!"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentIndex + 1}/{emojiLevels.length}
        </div>
      }
      showGameOver={showGameOver}
      score={score}
      onNext={handleNext}
      nextEnabled={answered}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <LevelCompleteHandler gameId="emoji-classifier" gameType="ai" levelNumber={currentIndex + 1}>
        <GameCard>
          <div
            style={{
              fontSize: "clamp(80px, 15vw, 120px)",
              marginBottom: "16px",
            }}
          >
            {currentEmoji?.emoji}
          </div>
          <p className="text-lg font-bold text-white">Pick the right bucket!</p>
        </GameCard>
      </LevelCompleteHandler>

      {/* Buckets */}
      <div className="flex justify-center gap-12 mt-6">
        <button
          onClick={() => handleBucketClick("happy")}
          disabled={answered}
          className="w-40 h-40 flex flex-col items-center justify-center rounded-2xl bg-yellow-400/30 border-4 border-yellow-400 text-yellow-200 font-bold text-xl shadow-lg hover:scale-105 transition disabled:opacity-50"
        >
          Happy Bucket
        </button>

        <button
          onClick={() => handleBucketClick("sad")}
          disabled={answered}
          className="w-40 h-40 flex flex-col items-center justify-center rounded-2xl bg-blue-400/30 border-4 border-blue-400 text-blue-200 font-bold text-xl shadow-lg hover:scale-105 transition disabled:opacity-50"
        >
          Sad Bucket
        </button>
      </div>

      {feedback.message && (
        <FeedbackBubble message={feedback.message} type={feedback.type} />
      )}
    </GameShell>
  );
};

export default EmojiClassifier;
