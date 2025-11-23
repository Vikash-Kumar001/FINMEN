import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

// ✅ Verified sound URLs (Pixabay)
const dogBarkUrl = "https://cdn.pixabay.com/audio/2022/03/15/audio_89d51c8e9f.mp3"; // Dog
const catMeowUrl = "https://cdn.pixabay.com/audio/2023/02/28/audio_9b4c9d2a76.mp3"; // Cat

const TrainAIWithSounds = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false); // 👈 track user interaction

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // ✅ Sound items
  const items = [
    { id: 1, emoji: "🐶", sound: dogBarkUrl, correct: "Dog" },
    { id: 2, emoji: "🐱", sound: catMeowUrl, correct: "Cat" },
    { id: 3, emoji: "🐶", sound: dogBarkUrl, correct: "Dog" },
    { id: 4, emoji: "🐱", sound: catMeowUrl, correct: "Cat" },
    { id: 5, emoji: "🐶", sound: dogBarkUrl, correct: "Dog" },
    { id: 6, emoji: "🐱", sound: catMeowUrl, correct: "Cat" },
    { id: 7, emoji: "🐶", sound: dogBarkUrl, correct: "Dog" },
    { id: 8, emoji: "🐱", sound: catMeowUrl, correct: "Cat" },
    { id: 9, emoji: "🐶", sound: dogBarkUrl, correct: "Dog" },
    { id: 10, emoji: "🐱", sound: catMeowUrl, correct: "Cat" },
  ];

  const currentItemData = items[currentItem];

  // ✅ Play sound manually
  const playSound = (soundUrl) => {
    setUserInteracted(true);
    const audio = new Audio(soundUrl);
    audio.volume = 1.0;
    audio.play().catch(() => {
      console.warn("🔇 Autoplay blocked. Please click a button first.");
    });
  };

  // ✅ Auto-play only after user interacts (browser policy)
  useEffect(() => {
    if (userInteracted && currentItemData) {
      const audio = new Audio(currentItemData.sound);
      audio.play().catch(() => {
        console.warn("Autoplay prevented. Use Play buttons.");
      });
    }
  }, [currentItemData, userInteracted]);

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 2);
      showCorrectAnswerFeedback(2, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => setCurrentItem((prev) => prev + 1), 700);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
    setUserInteracted(false);
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/robot-exam-story");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Train AI with Sounds"
      score={coins}
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-64"
      gameType="ai"
      totalLevels={100}
      currentLevel={64}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              🎧 Listen carefully and choose the correct animal sound!
            </h3>

            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-16 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-bounce">{currentItemData.emoji}</div>
            </div>

            {/* ✅ Manual Sound Buttons */}
            <div className="flex justify-center gap-6 mb-8">
              <button
                onClick={() => playSound(dogBarkUrl)}
                className="bg-green-600/30 hover:bg-green-500/60 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
              >
                🐶 Play Dog Sound
              </button>
              <button
                onClick={() => playSound(catMeowUrl)}
                className="bg-blue-600/30 hover:bg-blue-500/60 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
              >
                🐱 Play Cat Sound
              </button>
            </div>

            {/* ✅ Choice Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("Dog")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐶</div>
                <div className="text-white font-bold text-xl">Dog</div>
              </button>

              <button
                onClick={() => handleChoice("Cat")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐱</div>
                <div className="text-white font-bold text-xl">Cat</div>
              </button>
            </div>
          </div>
        ) : (
          // ✅ Result Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Sound Recognition Pro!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You identified {score} out of {items.length} correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Recognizing animal sounds helps AI learn how to classify audio — just like you did!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔄
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainAIWithSounds;
