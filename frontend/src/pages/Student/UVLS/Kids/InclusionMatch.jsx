import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InclusionMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentMatch, setCurrentMatch] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const matchPairs = [
    { id: 1, act: "Invite someone new to play", emoji: "🎮", correct: "They feel happy and included", options: ["They feel happy and included", "They feel ignored", "They run away"] },
    { id: 2, act: "Share your lunch with someone", emoji: "🍱", correct: "They feel grateful and cared for", options: ["They feel grateful and cared for", "They get angry", "They stay hungry"] },
    { id: 3, act: "Help a classmate with homework", emoji: "📚", correct: "They understand better and feel supported", options: ["They feel confused", "They understand better and feel supported", "They give up"] },
    { id: 4, act: "Include everyone in the game", emoji: "⚽", correct: "Everyone has fun together", options: ["Someone cries", "Everyone has fun together", "People fight"] },
    { id: 5, act: "Sit with someone sitting alone", emoji: "🪑", correct: "They feel less lonely", options: ["They feel annoyed", "They feel less lonely", "They leave"] },
    { id: 6, act: "Defend someone being teased", emoji: "🛡️", correct: "They feel protected and safe", options: ["They feel scared", "They feel protected and safe", "They cry more"] },
    { id: 7, act: "Smile and wave at a shy kid", emoji: "👋", correct: "They feel welcomed and noticed", options: ["They feel worried", "They hide", "They feel welcomed and noticed"] },
    { id: 8, act: "Ask someone to join your group", emoji: "👥", correct: "They feel wanted and valued", options: ["They say no", "They feel wanted and valued", "They walk away"] },
    { id: 9, act: "Compliment someone's work", emoji: "🎨", correct: "They feel proud and encouraged", options: ["They feel embarrassed", "They feel proud and encouraged", "They ignore you"] },
    { id: 10, act: "Listen to someone's ideas", emoji: "💡", correct: "They feel heard and respected", options: ["They feel ignored", "They feel heard and respected", "They stop talking"] }
  ];

  const handleOutcomeSelect = (outcome) => {
    setSelectedOutcome(outcome);
  };

  const handleConfirm = () => {
    if (!selectedOutcome) return;

    const isCorrect = matchPairs[currentMatch].correct === selectedOutcome;
    const newMatches = [...matches, {
      pairId: matchPairs[currentMatch].id,
      selected: selectedOutcome,
      isCorrect
    }];
    
    setMatches(newMatches);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedOutcome(null);
    
    if (currentMatch < matchPairs.length - 1) {
      setTimeout(() => {
        setCurrentMatch(prev => prev + 1);
      }, isCorrect ? 800 : 0);
    } else {
      const correctMatches = newMatches.filter(m => m.isCorrect).length;
      if (correctMatches >= 8) {
        setCoins(3); // +3 Coins for ≥8/10 (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentMatch(0);
    setMatches([]);
    setSelectedOutcome(null);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const currentPair = matchPairs[currentMatch];
  const correctMatches = matches.filter(m => m.isCorrect).length;

  return (
    <GameShell
      title="Inclusion Match"
      subtitle={`Match ${currentMatch + 1} of ${matchPairs.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctMatches >= 8}
      showGameOver={showResult && correctMatches >= 8}
      score={coins}
      gameId="uvls-kids-14"
      gameType="uvls"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showResult && correctMatches >= 8}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Match {currentMatch + 1}/{matchPairs.length}</span>
                <span className="text-yellow-400 font-bold">Correct: {correctMatches}/{currentMatch}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-3 text-center">{currentPair.emoji}</div>
                <p className="text-white text-xl font-bold text-center">{currentPair.act}</p>
              </div>
              
              <p className="text-white/90 text-lg mb-4 text-center">What happens?</p>
              
              <div className="space-y-3 mb-6">
                {currentPair.options.map((outcome, index) => (
                  <button
                    key={index}
                    onClick={() => handleOutcomeSelect(outcome)}
                    className={`w-full border-2 rounded-xl p-4 transition-all transform hover:scale-102 ${
                      selectedOutcome === outcome
                        ? 'bg-green-500/50 border-green-400'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-white font-medium">{outcome}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedOutcome}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedOutcome
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Match
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctMatches >= 8 ? "🎉 Inclusion Expert!" : "💪 Keep Trying!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {correctMatches} out of {matchPairs.length} correctly!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctMatches >= 8 ? "You earned 3 Coins! 🪙" : "Get 8 or more correct to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Use real school examples to illustrate inclusion!
            </p>
            {correctMatches < 8 && (
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

export default InclusionMatch;

