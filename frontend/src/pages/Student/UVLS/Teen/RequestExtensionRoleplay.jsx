import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RequestExtensionRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentPart, setCurrentPart] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const parts = [
    {
      id: 1,
      prompt: "Greeting.",
      phrases: [
        { id: 1, text: "Dear Teacher,", polite: true },
        { id: 2, text: "Hey,", polite: false }
      ]
    },
    {
      id: 2,
      prompt: "Reason.",
      phrases: [
        { id: 1, text: "Due to illness.", polite: true },
        { id: 2, text: "I was lazy.", polite: false }
      ]
    },
    {
      id: 3,
      prompt: "New date.",
      phrases: [
        { id: 1, text: "Can I submit by Friday?", polite: true },
        { id: 2, text: "Give me more time.", polite: false }
      ]
    },
    {
      id: 4,
      prompt: "Make-up plan.",
      phrases: [
        { id: 1, text: "I'll complete it soon.", polite: true },
        { id: 2, text: "No plan.", polite: false }
      ]
    },
    {
      id: 5,
      prompt: "Close.",
      phrases: [
        { id: 1, text: "Thank you.", polite: true },
        { id: 2, text: "Bye.", polite: false }
      ]
    }
  ];

  const handlePhraseSelect = (phraseId) => {
    setSelectedPhrase(phraseId);
  };

  const handleConfirm = () => {
    if (!selectedPhrase) return;

    const part = parts[currentPart];
    const phrase = part.phrases.find(p => p.id === selectedPhrase);
    
    const isPolite = phrase.polite;
    
    const newResponses = [...responses, {
      partId: part.id,
      phraseId: selectedPhrase,
      isPolite,
      phrase: phrase.text
    }];
    
    setResponses(newResponses);
    
    if (isPolite) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedPhrase(null);
    
    if (currentPart < parts.length - 1) {
      setTimeout(() => {
        setCurrentPart(prev => prev + 1);
      }, 1500);
    } else {
      const politeCount = newResponses.filter(r => r.isPolite).length;
      if (politeCount >= 4) {
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

  const politeCount = responses.filter(r => r.isPolite).length;

  return (
    <GameShell
      title="Request Extension Roleplay"
      subtitle={`Part ${currentPart + 1} of ${parts.length}`}
      onNext={handleNext}
      nextEnabled={showResult && politeCount >= 4}
      showGameOver={showResult && politeCount >= 4}
      score={0}
      gameId="life-195"
      gameType="life"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && politeCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">{parts[currentPart].prompt}</p>
              
              <div className="space-y-3 mb-6">
                {parts[currentPart].phrases.map(phrase => (
                  <button
                    key={phrase.id}
                    onClick={() => handlePhraseSelect(phrase.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPhrase === phrase.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{phrase.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedPhrase}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedPhrase
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {politeCount >= 4 ? "🎉 Polite Requester!" : "💪 More Polite!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Polite parts: {politeCount} out of {parts.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {politeCount >= 4 ? "Earned Badge!" : "Need 4+ polite."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Provide private routes for sensitive reasons.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RequestExtensionRoleplay;