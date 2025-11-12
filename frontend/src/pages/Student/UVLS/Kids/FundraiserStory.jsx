import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FundraiserStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [plans, setPlans] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedActions, setSelectedActions] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      goal: "Raise for books.",
      actions: [
        { id: "a", text: "Sell cookies", emoji: "🍪", isFeasible: true },
        { id: "b", text: "Do nothing", emoji: "😴", isFeasible: false },
        { id: "c", text: "Make poster", emoji: "🖼️", isFeasible: true }
      ]
    },
    {
      id: 2,
      goal: "Fund park toy.",
      actions: [
        { id: "a", text: "Lemonade stand", emoji: "🍋", isFeasible: true },
        { id: "b", text: "Wait magic", emoji: "🪄", isFeasible: false },
        { id: "c", text: "Car wash", emoji: "🚗", isFeasible: true }
      ]
    },
    {
      id: 3,
      goal: "Help animals.",
      actions: [
        { id: "a", text: "Bake sale", emoji: "🥧", isFeasible: true },
        { id: "b", text: "Sleep all day", emoji: "🛌", isFeasible: false },
        { id: "c", text: "Yard sale", emoji: "🏡", isFeasible: true }
      ]
    },
    {
      id: 4,
      goal: "School trip fund.",
      actions: [
        { id: "a", text: "Craft sell", emoji: "🎨", isFeasible: true },
        { id: "b", text: "Ignore goal", emoji: "🤷", isFeasible: false },
        { id: "c", text: "Dance show", emoji: "💃", isFeasible: true }
      ]
    },
    {
      id: 5,
      goal: "Charity run.",
      actions: [
        { id: "a", text: "Sponsor seek", emoji: "🏃", isFeasible: true },
        { id: "b", text: "Sit home", emoji: "🏠", isFeasible: false },
        { id: "c", text: "Raffle tickets", emoji: "🎟️", isFeasible: true }
      ]
    }
  ];

  const handleActionToggle = (actionId) => {
    if (selectedActions.includes(actionId)) {
      setSelectedActions(selectedActions.filter(id => id !== actionId));
    } else {
      setSelectedActions([...selectedActions, actionId]);
    }
  };

  const handlePlan = () => {
    const newPlans = [...plans, selectedActions];
    setPlans(newPlans);

    const isFeasible = selectedActions.every(sa => questions[currentLevel].actions.find(act => act.id === sa)?.isFeasible);
    if (isFeasible) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedActions([]); // Reset for next level
      }, isFeasible ? 800 : 0);
    } else {
      const feasiblePlans = newPlans.filter((sa, idx) => sa.every(s => questions[idx].actions.find(act => act.id === s)?.isFeasible)).length;
      setFinalScore(feasiblePlans);
      if (feasiblePlans >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPlans([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedActions([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Fundraiser Story"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-85"
      gameType="uvls"
      totalLevels={100}
      currentLevel={85}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Plan for {getCurrentLevel().goal}</p>
              <div className="space-y-3">
                {getCurrentLevel().actions.map(action => (
                  <button 
                    key={action.id} 
                    onClick={() => handleActionToggle(action.id)}
                    className={`w-full p-4 rounded text-left ${selectedActions.includes(action.id) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {action.text} {action.emoji} {selectedActions.includes(action.id) ? '✅' : '⬜'}
                  </button>
                ))}
              </div>
              <button 
                onClick={handlePlan} 
                className="mt-4 bg-purple-500 text-white p-2 rounded"
                disabled={selectedActions.length === 0}
              >
                Submit Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Fundraiser Planner!" : "💪 Plan Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You planned feasibly {finalScore} times!
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

export default FundraiserStory;