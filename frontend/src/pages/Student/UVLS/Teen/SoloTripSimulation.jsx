import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SoloTripSimulation = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-43";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentItem, setCurrentItem] = useState(0);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const items = [
    {
      id: 1,
      item: "Permissions.",
      emoji: "📝",
      checks: [
        { id: 1, text: "Get parent okay", complete: true },
        { id: 2, text: "No permission", complete: false }
      ]
    },
    {
      id: 2,
      item: "Contacts.",
      emoji: "📞",
      checks: [
        { id: 1, text: "Share itinerary", complete: true },
        { id: 2, text: "Go alone", complete: false }
      ]
    },
    {
      id: 3,
      item: "Money.",
      emoji: "💰",
      checks: [
        { id: 1, text: "Budget plan", complete: true },
        { id: 2, text: "No budget", complete: false }
      ]
    },
    {
      id: 4,
      item: "Route.",
      emoji: "🗺️",
      checks: [
        { id: 1, text: "Safe route", complete: true },
        { id: 2, text: "Unknown path", complete: false }
      ]
    },
    {
      id: 5,
      item: "Emergency plan.",
      emoji: "🚨",
      checks: [
        { id: 1, text: "Have numbers", complete: true },
        { id: 2, text: "No plan", complete: false }
      ]
    }
  ];

  const handleCheckSelect = (checkId) => {
    setSelectedCheck(checkId);
  };

  const handleConfirm = () => {
    if (!selectedCheck) return;

    const item = items[currentItem];
    const check = item.checks.find(c => c.id === selectedCheck);
    
    const isComplete = check.complete;
    
    const newResponses = [...responses, {
      itemId: item.id,
      checkId: selectedCheck,
      isComplete,
      check: check.text
    }];
    
    setResponses(newResponses);
    
    if (isComplete) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedCheck(null);
    
    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
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

  const completeCount = responses.filter(r => r.isComplete).length;

  return (
    <GameShell
      title="Solo Trip Simulation"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && completeCount >= 4}
      showGameOver={showResult && completeCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-43"
      gameType="uvls"
      totalLevels={20}
      currentLevel={43}
      showConfetti={showResult && completeCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{items[currentItem].emoji}</div>
              
              <p className="text-white text-xl mb-6">Item: {items[currentItem].item}</p>
              
              <p className="text-white/90 mb-4 text-center">Check:</p>
              
              <div className="space-y-3 mb-6">
                {items[currentItem].checks.map(check => (
                  <button
                    key={check.id}
                    onClick={() => handleCheckSelect(check.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedCheck === check.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{check.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedCheck}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedCheck
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
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
              {completeCount >= 4 ? "🎉 Trip Planner!" : "💪 More Complete!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Complete checklist: {completeCount} out of {items.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {completeCount >= 4 ? "Earned 5 Coins!" : "Need 4+ complete."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Emphasize consent & parental involvement.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SoloTripSimulation;