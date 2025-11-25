import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WitnessJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-37";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [journals, setJournals] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [entry, setEntry] = useState(""); // State for tracking journal entry
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      prompt: "Saw teasing, what did you do?"
    },
    {
      id: 2,
      prompt: "Witnessed exclusion, your action?"
    },
    {
      id: 3,
      prompt: "Heard name-calling, how helped?"
    },
    {
      id: 4,
      prompt: "Online bully, your response?"
    },
    {
      id: 5,
      prompt: "Physical push, stood up how?"
    }
  ];

  const handleJournal = () => {
    const newJournals = [...journals, entry];
    setJournals(newJournals);

    const isValid = entry.trim().length > 0;
    if (isValid) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setEntry(""); // Reset entry for next level
      }, isValid ? 800 : 0);
    } else {
      const validJournals = newJournals.filter(j => j.trim().length > 0).length;
      setFinalScore(validJournals);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setJournals([]);
    setCoins(0);
    setFinalScore(0);
    setEntry(""); // Reset entry
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Witness Journal"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-37"
      gameType="uvls"
      totalLevels={50}
      currentLevel={37}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">{getCurrentLevel().prompt}</p>
              <textarea 
                placeholder="Write your incident..." 
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                rows={4}
              ></textarea>
              <button 
                onClick={handleJournal} 
                className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={!entry.trim()}
              >
                Submit Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Journal Witness!" : "💪 Write More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You journaled {finalScore} incidents!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WitnessJournal;