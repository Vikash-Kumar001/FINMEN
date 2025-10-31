import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TradeOffsPuzzle = () => {
  const navigate = useNavigate();
  const [currentChoice, setCurrentChoice] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const choices = [
    {
      id: 1,
      dilemma: "Study all night or sleep?",
      emoji: "📚",
      options: [
        { id: 1, text: "Study all night", balanced: false },
        { id: 2, text: "Sleep and study early", balanced: true },
        { id: 3, text: "Skip exam", balanced: false },
        { id: 4, text: "Balance study and rest", balanced: true }
      ]
    },
    {
      id: 2,
      dilemma: "Spend money on game or save?",
      emoji: "💰",
      options: [
        { id: 1, text: "Buy game", balanced: false },
        { id: 2, text: "Save for future", balanced: true },
        { id: 3, text: "Borrow money", balanced: false },
        { id: 4, text: "Budget for both", balanced: true }
      ]
    },
    {
      id: 3,
      dilemma: "Help friend or do homework?",
      emoji: "👥",
      options: [
        { id: 1, text: "Ignore friend", balanced: false },
        { id: 2, text: "Quick help then homework", balanced: true },
        { id: 3, text: "Do friend's work", balanced: false },
        { id: 4, text: "Schedule time", balanced: true }
      ]
    },
    {
      id: 4,
      dilemma: "Eat junk or healthy food?",
      emoji: "🍎",
      options: [
        { id: 1, text: "All junk", balanced: false },
        { id: 2, text: "Balanced diet", balanced: true },
        { id: 3, text: "Skip meals", balanced: false },
        { id: 4, text: "Occasional treat", balanced: true }
      ]
    },
    {
      id: 5,
      dilemma: "Watch TV or exercise?",
      emoji: "🏃",
      options: [
        { id: 1, text: "All TV", balanced: false },
        { id: 2, text: "Exercise then TV", balanced: true },
        { id: 3, text: "No activity", balanced: false },
        { id: 4, text: "Active hobbies", balanced: true }
      ]
    }
  ];

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;

    const choice = choices[currentChoice];
    const option = choice.options.find(o => o.id === selectedOption);
    
    const isBalanced = option.balanced;
    
    const newResponses = [...responses, {
      choiceId: choice.id,
      optionId: selectedOption,
      isBalanced,
      option: option.text
    }];
    
    setResponses(newResponses);
    
    if (isBalanced) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedOption(null);
    
    if (currentChoice < choices.length - 1) {
      setTimeout(() => {
        setCurrentChoice(prev => prev + 1);
      }, 1500);
    } else {
      const balancedCount = newResponses.filter(r => r.isBalanced).length;
      if (balancedCount >= 4) {
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

  const balancedCount = responses.filter(r => r.isBalanced).length;

  return (
    <GameShell
      title="Trade-offs Puzzle"
      subtitle={`Choice ${currentChoice + 1} of ${choices.length}`}
      onNext={handleNext}
      nextEnabled={showResult && balancedCount >= 4}
      showGameOver={showResult && balancedCount >= 4}
      score={coins}
      gameId="decision-153"
      gameType="decision"
      totalLevels={10}
      currentLevel={3}
      showConfetti={showResult && balancedCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{choices[currentChoice].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  {choices[currentChoice].dilemma}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Pick balanced option:</p>
              
              <div className="space-y-3 mb-6">
                {choices[currentChoice].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedOption === option.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedOption}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedOption
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Choose
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {balancedCount >= 4 ? "🎉 Balanced Chooser!" : "💪 More Balance!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Balanced choices: {balancedCount} out of {choices.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {balancedCount >= 4 ? "Earned 5 Coins!" : "Need 4+ balanced."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use real student dilemmas.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TradeOffsPuzzle;