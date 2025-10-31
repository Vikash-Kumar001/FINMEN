import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ToughConversation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedPhrasing, setSelectedPhrasing] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      topic: "Friend borrowing money without returning.",
      emoji: "💰",
      phrasings: [
        { id: 1, text: "I feel worried when money isn't returned.", constructive: true },
        { id: 2, text: "You're a thief!", constructive: false },
        { id: 3, text: "Can we discuss the loan?", constructive: true },
        { id: 4, text: "Forget it.", constructive: false }
      ]
    },
    {
      id: 2,
      topic: "Group project slacking.",
      emoji: "👥",
      phrasings: [
        { id: 1, text: "I notice unequal work, let's divide tasks.", constructive: true },
        { id: 2, text: "You're lazy!", constructive: false },
        { id: 3, text: "How can we collaborate better?", constructive: true },
        { id: 4, text: "I'll do it all.", constructive: false }
      ]
    },
    {
      id: 3,
      topic: "Friend spreading rumors.",
      emoji: "🗣️",
      phrasings: [
        { id: 1, text: "I heard rumors, can we talk about it?", constructive: true },
        { id: 2, text: "You're a liar!", constructive: false },
        { id: 3, text: "It hurts when rumors spread.", constructive: true },
        { id: 4, text: "Ignore friend.", constructive: false }
      ]
    },
    {
      id: 4,
      topic: "Disagreement on plans.",
      emoji: "🗓️",
      phrasings: [
        { id: 1, text: "I prefer this, what do you think?", constructive: true },
        { id: 2, text: "Your idea is stupid!", constructive: false },
        { id: 3, text: "Let's find a compromise.", constructive: true },
        { id: 4, text: "Do it my way.", constructive: false }
      ]
    },
    {
      id: 5,
      topic: "Borrowed item damaged.",
      emoji: "🛠️",
      phrasings: [
        { id: 1, text: "The item is damaged, how to fix?", constructive: true },
        { id: 2, text: "You broke it on purpose!", constructive: false },
        { id: 3, text: "I feel upset about the damage.", constructive: true },
        { id: 4, text: "Never lend again.", constructive: false }
      ]
    }
  ];

  const handlePhrasingSelect = (phrasingId) => {
    setSelectedPhrasing(phrasingId);
  };

  const handleConfirm = () => {
    if (!selectedPhrasing) return;

    const scenario = scenarios[currentScenario];
    const phrasing = scenario.phrasings.find(p => p.id === selectedPhrasing);
    
    const isConstructive = phrasing.constructive;
    
    const newResponses = [...responses, {
      scenarioId: scenario.id,
      phrasingId: selectedPhrasing,
      isConstructive,
      phrasing: phrasing.text
    }];
    
    setResponses(newResponses);
    
    if (isConstructive) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedPhrasing(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      const constructiveCount = newResponses.filter(r => r.isConstructive).length;
      if (constructiveCount >= 4) {
        setCoins(5);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const constructiveCount = responses.filter(r => r.isConstructive).length;

  return (
    <GameShell
      title="Tough Conversation"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && constructiveCount >= 4}
      showGameOver={showResult && constructiveCount >= 4}
      score={coins}
      gameId="communication-161"
      gameType="communication"
      totalLevels={10}
      currentLevel={1}
      showConfetti={showResult && constructiveCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  {scenarios[currentScenario].topic}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose constructive phrasing:</p>
              
              <div className="space-y-3 mb-6">
                {scenarios[currentScenario].phrasings.map(phrasing => (
                  <button
                    key={phrasing.id}
                    onClick={() => handlePhrasingSelect(phrasing.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPhrasing === phrasing.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{phrasing.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedPhrasing}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedPhrasing
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Speak
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {constructiveCount >= 4 ? "🎉 Conversation Pro!" : "💪 More Constructive!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Constructive phrasings: {constructiveCount} out of {scenarios.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {constructiveCount >= 4 ? "Earned 5 Coins!" : "Need 4+ constructive."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Model “I” statements.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ToughConversation;