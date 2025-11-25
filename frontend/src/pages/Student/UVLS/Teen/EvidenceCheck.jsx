import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EvidenceCheck = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-67";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedReliability, setSelectedReliability] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const levels = [
    {
      id: 1,
      claim: "Vaccines cause autism.",
      emoji: "💉",
      sources: [
        { id: 1, text: "Peer-reviewed study", reliability: "high" },
        { id: 2, text: "Social media post", reliability: "low" },
        { id: 3, text: "Government health site", reliability: "high" },
        { id: 4, text: "Blog opinion", reliability: "medium" }
      ]
    },
    {
      id: 2,
      claim: "Climate change is a hoax.",
      emoji: "🌍",
      sources: [
        { id: 1, text: "Scientific consensus report", reliability: "high" },
        { id: 2, text: "Conspiracy website", reliability: "low" },
        { id: 3, text: "News article with data", reliability: "high" },
        { id: 4, text: "Personal anecdote", reliability: "low" }
      ]
    },
    {
      id: 3,
      claim: "Eating carrots improves eyesight.",
      emoji: "🥕",
      sources: [
        { id: 1, text: "Medical journal", reliability: "high" },
        { id: 2, text: "Old wives' tale", reliability: "low" },
        { id: 3, text: "Nutrition website", reliability: "medium" },
        { id: 4, text: "Expert interview", reliability: "high" }
      ]
    },
    {
      id: 4,
      claim: "Moon landing was faked.",
      emoji: "🌕",
      sources: [
        { id: 1, text: "NASA documents", reliability: "high" },
        { id: 2, text: "YouTube video", reliability: "low" },
        { id: 3, text: "Historical records", reliability: "high" },
        { id: 4, text: "Forum thread", reliability: "low" }
      ]
    },
    {
      id: 5,
      claim: "Coffee stunts growth.",
      emoji: "☕",
      sources: [
        { id: 1, text: "Health organization study", reliability: "high" },
        { id: 2, text: "Myth busting site", reliability: "medium" },
        { id: 3, text: "Advertisement", reliability: "low" },
        { id: 4, text: "Scientific paper", reliability: "high" }
      ]
    }
  ];

  const handleReliabilitySelect = (sourceId) => {
    setSelectedReliability(sourceId);
  };

  const handleConfirm = () => {
    if (!selectedReliability) return;

    const level = levels[currentLevel];
    const source = level.sources.find(s => s.id === selectedReliability);
    
    const isCorrect = source.reliability === "high";
    
    const newResponses = [...responses, {
      levelId: level.id,
      sourceId: selectedReliability,
      isCorrect,
      source: source.text
    }];
    
    setResponses(newResponses);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedReliability(null);
    
    if (currentLevel < levels.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const correctCount = responses.filter(r => r.isCorrect).length;

  return (
    <GameShell
      title="Evidence Check"
      subtitle={`Level ${currentLevel + 1} of ${levels.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-67"
      gameType="uvls"
      totalLevels={20}
      currentLevel={67}
      showConfetti={showResult && correctCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{levels[currentLevel].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Claim: "{levels[currentLevel].claim}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Rate and pick reliable source:</p>
              
              <div className="space-y-3 mb-6">
                {levels[currentLevel].sources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => handleReliabilitySelect(source.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedReliability === source.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{source.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedReliability}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedReliability
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Check
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🎉 Evidence Pro!" : "💪 Practice More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Correct rankings: {correctCount} out of {levels.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "Earned 5 Coins!" : "Need 4+ correct."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach source credibility cues.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EvidenceCheck;