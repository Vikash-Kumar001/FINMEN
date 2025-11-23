import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexRespect1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentWord, setCurrentWord] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const words = [
    { id: 1, text: "Thank you", isKind: true },
    { id: 2, text: "Idiot", isKind: false },
    { id: 3, text: "Good job", isKind: true },
    { id: 4, text: "Loser", isKind: false },
    { id: 5, text: "Nice work", isKind: true }
  ];

  const handleChoice = (isKind) => {
    const correct = words[currentWord].isKind === isKind;
    setSelectedResponse(isKind);

    if (correct) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentWord < words.length - 1) {
      setTimeout(() => {
        setCurrentWord((prev) => prev + 1);
        setSelectedResponse(null);
      }, 700);
    } else {
      setShowFeedback(true);
      const correctCount = words.filter((w, i) =>
        (w.isKind && selectedResponse === true) ||
        (!w.isKind && selectedResponse === false)
      ).length;
      if (correctCount >= 3) {
        setCoins(3);
      }
    }
  };

  const handleTryAgain = () => {
    setCurrentWord(0);
    setShowFeedback(false);
    setCoins(0);
    setSelectedResponse(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/class-chat-story");
  };

  return (
    <GameShell
      title="Reflex Respect"
      score={coins}
      subtitle="Tap Fast for Respect!"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && coins > 0}
      
      gameId="dcos-kids-82"
      gameType="educational"
      totalLevels={100}
      currentLevel={82}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center ">
            <h2 className="text-4xl font-bold text-white mb-4">
              Reflex Challenge #{currentWord + 1}
            </h2>
            <p className="text-white text-xl mb-6">
              Word appears — tap fast for the right response!
            </p>

            <div className="text-6xl font-extrabold text-yellow-300 mb-10">
              “{words[currentWord].text}”
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleChoice(true)}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition bg-green-500/60 hover:bg-green-500/80`}
              >
                👍 Respect (Kind)
              </button>
              <button
                onClick={() => handleChoice(false)}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition bg-red-500/60 hover:bg-red-500/80`}
              >
                🚫 Disrespect (Mean)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins > 0 ? "🌟 Respect Hero!" : "Keep Practicing Kindness!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              You finished the reflex challenge on respectful words.
            </p>
            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Amazing reflex! You spotted kind words quickly. Respectful speech makes everyone feel valued. 💬
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold">
                  You earned 3 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! You missed some reflexes. Remember — words like “Thank you” and “Good job” spread respect. Try again to earn coins!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexRespect1;
