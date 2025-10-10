import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleSwap = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      situation: "Someone posts a mean comment about your drawing online.",
      emoji: "🎨",
      feelings: [
        { id: 1, text: "Sad", emoji: "😢", isValid: true },
        { id: 2, text: "Happy", emoji: "😊", isValid: false },
        { id: 3, text: "Hurt", emoji: "💔", isValid: true },
        { id: 4, text: "Excited", emoji: "🎉", isValid: false }
      ]
    },
    {
      id: 2,
      situation: "Kids at school laugh at your new haircut.",
      emoji: "💇",
      feelings: [
        { id: 1, text: "Embarrassed", emoji: "😳", isValid: true },
        { id: 2, text: "Proud", emoji: "😌", isValid: false },
        { id: 3, text: "Upset", emoji: "😥", isValid: true },
        { id: 4, text: "Joyful", emoji: "😄", isValid: false }
      ]
    },
    {
      id: 3,
      situation: "Someone shares your secret without asking.",
      emoji: "🤫",
      feelings: [
        { id: 1, text: "Betrayed", emoji: "😞", isValid: true },
        { id: 2, text: "Grateful", emoji: "🙏", isValid: false },
        { id: 3, text: "Angry", emoji: "😠", isValid: true },
        { id: 4, text: "Amused", emoji: "😆", isValid: false }
      ]
    }
  ];

  const currentScenario = scenarios[currentQuestion];

  const handleFeelingSelect = (feeling) => {
    const newSelections = [...selectedFeelings];
    const index = newSelections.findIndex(f => f === feeling.id);
    
    if (index > -1) {
      newSelections.splice(index, 1);
    } else {
      newSelections.push(feeling.id);
    }
    
    setSelectedFeelings(newSelections);
  };

  const handleNext = () => {
    if (selectedFeelings.length === 0) return;
    
    const hasValidSelection = selectedFeelings.some(id => 
      currentScenario.feelings.find(f => f.id === id && f.isValid)
    );
    
    if (hasValidSelection) {
      showCorrectAnswerFeedback(2, false);
    }
    
    if (currentQuestion < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedFeelings([]);
      }, 500);
    } else {
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/kindness-journal");
  };

  const isFeelingSelected = (feelingId) => {
    return selectedFeelings.includes(feelingId);
  };

  return (
    <GameShell
      title="Role Swap Simulation"
      subtitle={!showResult ? `Scenario ${currentQuestion + 1} of ${scenarios.length}` : "Empathy Completed"}
      onNext={handleNextGame}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-17"
      gameType="educational"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{currentScenario.emoji}</div>
            
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <h3 className="text-white font-bold mb-2 text-center">Imagine...</h3>
              <p className="text-white text-lg leading-relaxed text-center">
                {currentScenario.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">How would you feel? (Select all that apply)</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentScenario.feelings.map(feeling => (
                <button
                  key={feeling.id}
                  onClick={() => handleFeelingSelect(feeling)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    isFeelingSelected(feeling.id)
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-4xl mb-2">{feeling.emoji}</div>
                  <div className="text-white font-semibold">{feeling.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedFeelings.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedFeelings.length > 0
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              {currentQuestion < scenarios.length - 1 ? "Next Scenario" : "Finish"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              💖 Great Empathy!
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              You thought about how being bullied feels. Understanding others' feelings helps 
              you be kinder and stand up against bullying!
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Remember: Bullying hurts. Before you say or do something, think about how 
                it would make YOU feel if someone did it to you.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleSwap;

