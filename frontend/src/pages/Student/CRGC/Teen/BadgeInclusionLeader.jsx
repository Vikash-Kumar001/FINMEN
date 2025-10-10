import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeInclusionLeader = () => {
  const navigate = useNavigate();
  const [completedActs, setCompletedActs] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const inclusiveActs = [
    { id: 1, text: "Welcomed a new student to the school", emoji: "🤗", completed: false },
    { id: 2, text: "Stood up against discrimination", emoji: "🛡️", completed: false },
    { id: 3, text: "Included someone who was left out", emoji: "🤝", completed: false },
    { id: 4, text: "Learned about a different culture", emoji: "🌍", completed: false },
    { id: 5, text: "Helped create equal opportunities", emoji: "⚖️", completed: false }
  ];

  const [acts, setActs] = useState(inclusiveActs);

  const handleActComplete = (actId) => {
    setActs(prevActs => 
      prevActs.map(act => 
        act.id === actId ? { ...act, completed: !act.completed } : act
      )
    );
  };

  useEffect(() => {
    const completed = acts.filter(act => act.completed).length;
    if (completed === 5 && !showFeedback) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowFeedback(true);
    }
  }, [acts]);

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const completedCount = acts.filter(act => act.completed).length;

  return (
    <GameShell
      title="Badge: Inclusion Leader"
      subtitle="Complete 5 Acts of Inclusion"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-20"
      gameType="crgc"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-gold-50 to-yellow-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inclusion Leader Challenge</h2>
            <p className="text-lg text-gray-700">
              Complete 5 inclusive actions to earn your badge!
            </p>
            <div className="text-3xl font-bold text-yellow-600 mt-4">
              {completedCount}/5 Complete
            </div>
          </div>
        </div>

        {!showFeedback ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Check off each inclusive action:
            </h3>
            {acts.map((act) => (
              <button
                key={act.id}
                onClick={() => handleActComplete(act.id)}
                className={`w-full p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  act.completed
                    ? 'border-green-500 bg-green-100 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{act.emoji}</span>
                  <span className="text-lg font-medium text-gray-800 flex-1 text-left">
                    {act.text}
                  </span>
                  {act.completed && (
                    <span className="text-3xl">✅</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🎖️</div>
              <h3 className="text-3xl font-bold text-green-700 mb-4">
                Badge Earned: Inclusion Leader!
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Congratulations! You&apos;ve demonstrated leadership in inclusion through 5 meaningful actions. You are making the world a more welcoming place for everyone!
              </p>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-5xl mb-3">🌈</div>
                <div className="text-xl font-bold text-indigo-600">Inclusion Leader</div>
                <div className="text-gray-600 mt-2">Awarded for 5 acts of inclusion</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeInclusionLeader;

