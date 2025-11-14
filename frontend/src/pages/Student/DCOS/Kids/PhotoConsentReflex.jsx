import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PhotoConsentReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    { id: 1, text: "Your friend is in a photo you want to post.", emoji: "📸", needsConsent: true },
    { id: 2, text: "You took a selfie alone at home.", emoji: "🤳", needsConsent: false },
    { id: 3, text: "You clicked a group photo in school.", emoji: "🏫", needsConsent: true },
    { id: 4, text: "You took a photo of your pet.", emoji: "🐶", needsConsent: false },
    { id: 5, text: "You took a picture with your friend at a park.", emoji: "🌳", needsConsent: true },
    { id: 6, text: "You clicked a nature photo of trees.", emoji: "🌲", needsConsent: false },
    { id: 7, text: "You took a funny photo of your classmate.", emoji: "😄", needsConsent: true },
    { id: 8, text: "You took a picture of your toys.", emoji: "🧸", needsConsent: false },
    { id: 9, text: "You took a photo at your friend’s birthday party.", emoji: "🎂", needsConsent: true },
    { id: 10, text: "You clicked a picture of your lunch.", emoji: "🍱", needsConsent: false },
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Time's up — move to next scenario
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(prev => prev + 1);
            setTimeLeft(2);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / scenarios.length) * 100;
            if (accuracy >= 70) setCoins(3);
            setShowResult(true);
          }
        }, 500);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentScenario, autoAdvance]);

  const currentScenarioData = scenarios[currentScenario];

  const handleChoice = (askedPermission) => {
    const isCorrect = currentScenarioData.needsConsent === askedPermission;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setAutoAdvance(true);
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setTimeLeft(2);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / scenarios.length) * 100;
        if (accuracy >= 70) setCoins(3);
        setScore(finalScore);
        setShowResult(true);
      }
    }, 300);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentScenario(0);
    setScore(0);
    setCoins(0);
    setTimeLeft(2);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/puzzle-public-private");
  };

  const accuracy = Math.round((score / scenarios.length) * 100);

  return (
    <GameShell
      title="Photo Consent Reflex"
      subtitle={gameStarted ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Reflex Challenge"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-53"
      gameType="educational"
      totalLevels={100}
      currentLevel={53}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Tap Fast, Be Respectful! 📸</h2>
            <p className="text-white/80 mb-6">
              Tap <strong>“Ask Permission”</strong> if someone else is in the photo, or <strong>“Post”</strong> if it's just you!
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="bg-purple-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>

              <div className="text-8xl mb-4 text-center animate-pulse">{currentScenarioData.emoji}</div>
              <h2 className="text-white text-3xl font-bold text-center mb-8">
                {currentScenarioData.text}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Ask Permission ✅</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Post 📤</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Photo Respect Hero!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {scenarios.length} correct ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always ask permission before posting photos of friends or others online!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PhotoConsentReflex;
