import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeCompassionLeader = () => {
  const navigate = useNavigate();
  const [completedActs, setCompletedActs] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const compassionateActs = [
    { id: 1, text: "Helped an elderly person carry bags", emoji: "👵", completed: false },
    { id: 2, text: "Welcomed a new student with kindness", emoji: "🤗", completed: false },
    { id: 3, text: "Defended someone from bullying", emoji: "🛡️", completed: false },
    { id: 4, text: "Visited a sick friend", emoji: "🏥", completed: false },
    { id: 5, text: "Donated to a good cause", emoji: "💝", completed: false }
  ];

  const [acts, setActs] = useState(compassionateActs);

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
    navigate("/student/civic-responsibility/teen/cultural-story");
  };

  const completedCount = acts.filter(act => act.completed).length;

  return (
    <GameShell
      title="Badge: Compassion Leader"
      subtitle="Complete 5 Acts of Compassion"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-10"
      gameType="crgc"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Compassion Leader Challenge</h2>
            <p className="text-lg text-gray-700">
              Complete 5 compassionate acts to earn your badge!
            </p>
            <div className="text-3xl font-bold text-amber-600 mt-4">
              {completedCount}/5 Complete
            </div>
          </div>
        </div>

        {!showFeedback ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Check off each compassionate act:
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
                Badge Earned: Compassion Leader!
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Congratulations! You&apos;ve demonstrated compassion through 5 meaningful acts. You are a true leader in showing kindness to others!
              </p>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-5xl mb-3">💝</div>
                <div className="text-xl font-bold text-purple-600">Compassion Leader</div>
                <div className="text-gray-600 mt-2">Awarded for 5 acts of compassion</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeCompassionLeader;

