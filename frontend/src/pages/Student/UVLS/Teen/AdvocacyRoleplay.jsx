import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AdvocacyRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentPart, setCurrentPart] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const parts = [
    {
      id: 1,
      prompt: "Build case for safer crossing.",
      emoji: "🚸",
      elements: [
        { id: 1, text: "Evidence of accidents", persuasive: true },
        { id: 2, text: "Emotional story", persuasive: false },
        { id: 3, text: "Data and solutions", persuasive: true },
        { id: 4, text: "Complaints only", persuasive: false }
      ]
    },
    {
      id: 2,
      prompt: "Prepare pitch.",
      emoji: "🗣️",
      elements: [
        { id: 1, text: "Clear structure", persuasive: true },
        { id: 2, text: "Rambling", persuasive: false },
        { id: 3, text: "Visual aids", persuasive: true },
        { id: 4, text: "No prep", persuasive: false }
      ]
    },
    {
      id: 3,
      prompt: "Deliver to council.",
      emoji: "🏛️",
      elements: [
        { id: 1, text: "Confident delivery", persuasive: true },
        { id: 2, text: "Nervous mumbling", persuasive: false },
        { id: 3, text: "Engage audience", persuasive: true },
        { id: 4, text: "Read script", persuasive: false }
      ]
    },
    {
      id: 4,
      prompt: "Handle Q&A.",
      emoji: "❓",
      elements: [
        { id: 1, text: "Answer factually", persuasive: true },
        { id: 2, text: "Avoid questions", persuasive: false },
        { id: 3, text: "Provide more data", persuasive: true },
        { id: 4, text: "Argue back", persuasive: false }
      ]
    },
    {
      id: 5,
      prompt: "Follow up.",
      emoji: "📧",
      elements: [
        { id: 1, text: "Thank and remind", persuasive: true },
        { id: 2, text: "No follow up", persuasive: false },
        { id: 3, text: "Petition support", persuasive: true },
        { id: 4, text: "Demand action", persuasive: false }
      ]
    }
  ];

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
  };

  const handleConfirm = () => {
    if (!selectedElement) return;

    const part = parts[currentPart];
    const element = part.elements.find(e => e.id === selectedElement);
    
    const isPersuasive = element.persuasive;
    
    const newResponses = [...responses, {
      partId: part.id,
      elementId: selectedElement,
      isPersuasive,
      element: element.text
    }];
    
    setResponses(newResponses);
    
    if (isPersuasive) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedElement(null);
    
    if (currentPart < parts.length - 1) {
      setTimeout(() => {
        setCurrentPart(prev => prev + 1);
      }, 1500);
    } else {
      const persuasiveCount = newResponses.filter(r => r.isPersuasive).length;
      if (persuasiveCount >= 4) {
        setBadge(true);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const persuasiveCount = responses.filter(r => r.isPersuasive).length;

  return (
    <GameShell
      title="Advocacy Roleplay"
      subtitle={`Part ${currentPart + 1} of ${parts.length}`}
      onNext={handleNext}
      nextEnabled={showResult && persuasiveCount >= 4}
      showGameOver={showResult && persuasiveCount >= 4}
      score={0}
      gameId="civic-185"
      gameType="civic"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && persuasiveCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{parts[currentPart].emoji}</div>
              
              <p className="text-white text-xl mb-6">{parts[currentPart].prompt}</p>
              
              <p className="text-white/90 mb-4 text-center">Choose element:</p>
              
              <div className="space-y-3 mb-6">
                {parts[currentPart].elements.map(element => (
                  <button
                    key={element.id}
                    onClick={() => handleElementSelect(element.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedElement === element.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{element.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedElement}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedElement
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Advocate
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {persuasiveCount >= 4 ? "🎉 Advocate!" : "💪 More Persuasive!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Persuasive elements: {persuasiveCount} out of {parts.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {persuasiveCount >= 4 ? "Earned Badge!" : "Need 4+ persuasive."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Invite local council rep for debrief.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AdvocacyRoleplay;