import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowingStrongBadge = () => {
  const navigate = useNavigate();
  const [coins] = useState(0);
  const [selectedChanges, setSelectedChanges] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: 0, total: 0 });
  const { showAnswerConfetti } = useGameFeedback();

  const growthChanges = [
    { id: 1, name: "Height Increase", emoji: "📈", isGrowth: true },
    { id: 2, name: "Body Hair", emoji: "🦵", isGrowth: true },
    { id: 3, name: "Acne", emoji: "🔴", isGrowth: true },
    { id: 4, name: "Mood Swings", emoji: "😢", isGrowth: true },
    { id: 5, name: "Voice Changes", emoji: "🗣️", isGrowth: true },
    { id: 6, name: "Weight Gain", emoji: "🍔", isGrowth: false },
    { id: 7, name: "Illness", emoji: "🤒", isGrowth: false },
    { id: 8, name: "Injury", emoji: "🤕", isGrowth: false },
    { id: 9, name: "Stress", emoji: "😩", isGrowth: false },
    { id: 10, name: "Poor Nutrition", emoji: "🍟", isGrowth: false }
  ];

  // Shuffle and select 10 growth changes
  const getShuffledChanges = () => {
    const shuffled = [...growthChanges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  const [shuffledChanges, setShuffledChanges] = useState(getShuffledChanges());

  const handleChangeSelect = (changeId) => {
    // Toggle selection
    if (selectedChanges.includes(changeId)) {
      setSelectedChanges(selectedChanges.filter(id => id !== changeId));
    } else {
      // Limit to 5 selections
      if (selectedChanges.length < 5) {
        setSelectedChanges([...selectedChanges, changeId]);
      }
    }
  };

  const handleSubmit = () => {
    const correctChoices = selectedChanges.filter(changeId => {
      const change = shuffledChanges.find(c => c.id === changeId);
      return change.isGrowth;
    }).length;
    
    const totalSelected = selectedChanges.length;
    setFeedback({ correct: correctChoices, total: totalSelected });
    setShowFeedback(true);
    
    // If all 5 selections are correct (growth changes)
    if (correctChoices === 5) {
      setTimeout(() => {
        setGameFinished(true);
        showAnswerConfetti();
      }, 2000);
    } else {
      // Show feedback for 2 seconds, then allow retry
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const resetGame = () => {
    setSelectedChanges([]);
    setShowFeedback(false);
    setShuffledChanges(getShuffledChanges());
  };

  return (
    <GameShell
      title="Badge: Growing Strong Girl"
      subtitle={showFeedback ? "Results" : `Select 5 growth changes (${selectedChanges.length}/5)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-30"
      gameType="health-female"
      totalLevels={30}
      currentLevel={30}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      showAnswerConfetti={false}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Identify 5 normal growth changes to earn your Growing Strong Girl Badge!
            </h2>
            <p className="text-white/80">
              Select only the changes that are normal parts of healthy development.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
            {shuffledChanges.map((change) => (
              <button
                key={change.id}
                onClick={() => handleChangeSelect(change.id)}
                disabled={selectedChanges.length >= 5 && !selectedChanges.includes(change.id)}
                className={`aspect-square flex flex-col items-center justify-center text-3xl rounded-2xl transition-all transform ${
                  selectedChanges.includes(change.id)
                    ? change.isGrowth
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg scale-105 ring-2 ring-green-400'
                      : 'bg-gradient-to-br from-red-500 to-orange-600 shadow-lg scale-105 ring-2 ring-red-400'
                    : 'bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 shadow-md hover:shadow-lg hover:scale-105'
                } ${selectedChanges.length >= 5 && !selectedChanges.includes(change.id) ? 'opacity-50' : ''}`}
              >
                <span className="text-3xl mb-1">{change.emoji}</span>
                <span className="text-xs font-medium text-white">{change.name}</span>
              </button>
            ))}
          </div>

          {!showFeedback && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={selectedChanges.length !== 5}
                className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
                  selectedChanges.length === 5
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                Check My Choices
              </button>
            </div>
          )}

          {showFeedback && (
            <div className={`p-6 rounded-2xl text-center mb-6 ${
              feedback.correct === 5
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`text-lg mb-3 ${
                feedback.correct === 5 ? 'text-green-300' : 'text-red-300'
              }`}>
                {feedback.correct === 5
                  ? '🎉 Perfect! You selected all 5 normal growth changes!'
                  : `You selected ${feedback.correct} growth changes out of ${feedback.total}. Try again!`}
              </p>
              
              {feedback.correct === 5 ? (
                <div className="text-yellow-400 font-bold">
                  Congratulations! You've earned your Growing Strong Girl Badge!
                </div>
              ) : (
                <button
                  onClick={resetGame}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {gameFinished && (
            <div className="text-center p-6 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-400">
              <div className="text-6xl mb-4">🏅</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">Growing Strong Girl</h3>
              <p className="text-white">
                You understand healthy development! Keep growing strong and confident.
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default GrowingStrongBadge;