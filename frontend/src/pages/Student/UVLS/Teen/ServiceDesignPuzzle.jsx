import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ServiceDesignPuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-42";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentComponent, setCurrentComponent] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const components = [
    {
      id: 1,
      prompt: "Cost factor.",
      emoji: "💰",
      cards: [
        { id: 1, text: "Low cost materials", sustainable: true },
        { id: 2, text: "Expensive tech", sustainable: false },
        { id: 3, text: "Volunteer labor", sustainable: true },
        { id: 4, text: "Paid staff", sustainable: false }
      ]
    },
    {
      id: 2,
      prompt: "Reach factor.",
      emoji: "🌍",
      cards: [
        { id: 1, text: "Community wide", sustainable: true },
        { id: 2, text: "Small group", sustainable: false },
        { id: 3, text: "Scalable plan", sustainable: true },
        { id: 4, text: "One time event", sustainable: false }
      ]
    },
    {
      id: 3,
      prompt: "Effort factor.",
      emoji: "💪",
      cards: [
        { id: 1, text: "Team effort", sustainable: true },
        { id: 2, text: "Solo", sustainable: false },
        { id: 3, text: "Efficient process", sustainable: true },
        { id: 4, text: "Complicated", sustainable: false }
      ]
    },
    {
      id: 4,
      prompt: "Impact factor.",
      emoji: "📈",
      cards: [
        { id: 1, text: "Measurable change", sustainable: true },
        { id: 2, text: "Vague goals", sustainable: false },
        { id: 3, text: "Long term effects", sustainable: true },
        { id: 4, text: "Short term", sustainable: false }
      ]
    },
    {
      id: 5,
      prompt: "Sustainability factor.",
      emoji: "♻️",
      cards: [
        { id: 1, text: "Ongoing program", sustainable: true },
        { id: 2, text: "One off", sustainable: false },
        { id: 3, text: "Partnerships", sustainable: true },
        { id: 4, text: "No follow up", sustainable: false }
      ]
    }
  ];

  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId);
  };

  const handleConfirm = () => {
    if (!selectedCard) return;

    const component = components[currentComponent];
    const card = component.cards.find(c => c.id === selectedCard);
    
    const isSustainable = card.sustainable;
    
    const newResponses = [...responses, {
      componentId: component.id,
      cardId: selectedCard,
      isSustainable,
      card: card.text
    }];
    
    setResponses(newResponses);
    
    if (isSustainable) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedCard(null);
    
    if (currentComponent < components.length - 1) {
      setTimeout(() => {
        setCurrentComponent(prev => prev + 1);
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

  const sustainableCount = responses.filter(r => r.isSustainable).length;

  return (
    <GameShell
      title="Service Design Puzzle"
      subtitle={`Component ${currentComponent + 1} of ${components.length}`}
      onNext={handleNext}
      nextEnabled={showResult && sustainableCount >= 4}
      showGameOver={showResult && sustainableCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-42"
      gameType="uvls"
      totalLevels={20}
      currentLevel={42}
      showConfetti={showResult && sustainableCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{components[currentComponent].emoji}</div>
              
              <p className="text-white text-xl mb-6">{components[currentComponent].prompt}</p>
              
              <p className="text-white/90 mb-4 text-center">Pick card:</p>
              
              <div className="space-y-3 mb-6">
                {components[currentComponent].cards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardSelect(card.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedCard === card.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{card.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedCard}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedCard
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Design
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {sustainableCount >= 4 ? "🎉 Designer!" : "💪 More Sustainable!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Sustainable components: {sustainableCount} out of {components.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {sustainableCount >= 4 ? "Earned 5 Coins!" : "Need 4+ sustainable."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Encourage partnerships.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ServiceDesignPuzzle;