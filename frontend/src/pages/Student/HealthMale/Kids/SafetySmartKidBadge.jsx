import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetySmartKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      text: "Get vaccinated to prevent diseases",
      emoji: "💉",
      description: "Vaccines protect you and others from serious illnesses",
      completed: false
    },
    {
      id: 2,
      text: "Tell adults when you're sick",
      emoji: "🤒",
      description: "Early treatment helps you get better faster",
      completed: false
    },
    {
      id: 3,
      text: "Wear safety gear like helmets",
      emoji: "⛑️",
      description: "Protection prevents injuries during activities",
      completed: false
    },
    {
      id: 4,
      text: "Visit doctor and dentist regularly",
      emoji: "👩‍⚕️",
      description: "Check-ups catch problems before they get serious",
      completed: false
    },
    {
      id: 5,
      text: "Follow safety rules every day",
      emoji: "🛡️",
      description: "Daily safe habits keep you healthy and strong",
      completed: false
    }
  ];

  const handleChallengeComplete = (challengeId) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges(prev => [...prev, challengeId]);
      showCorrectAnswerFeedback(2, true); // 2 coins per challenge
    }
  };

  React.useEffect(() => {
    if (completedChallenges.length === challenges.length && !gameFinished) {
      setGameFinished(true);
    }
  }, [completedChallenges, gameFinished]);

  const handleNext = () => {
    navigate("/student/health-male/kids/smoking-story");
  };

  return (
    <GameShell
      title="Safety Smart Kid Badge"
      subtitle={`Complete ${completedChallenges.length} of ${challenges.length} safety activities`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedChallenges.length * 2}
      gameId="health-male-kids-80"
      gameType="health-male"
      totalLevels={80}
      currentLevel={80}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={80} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Earn Your Safety Smart Kid Badge</h3>
            <p className="text-white/90">
              Complete 5 safety activities to prove you're a health and safety expert!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {challenges.map((challenge) => {
              const isCompleted = completedChallenges.includes(challenge.id);

              return (
                <button
                  key={challenge.id}
                  onClick={() => handleChallengeComplete(challenge.id)}
                  disabled={isCompleted}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isCompleted
                      ? 'bg-green-100/20 border-green-500 text-white'
                      : 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`text-3xl mr-4 ${isCompleted ? 'opacity-100' : 'opacity-60'}`}>
                        {challenge.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                          {isCompleted ? '✅ ' : '☐ '}{challenge.text}
                        </h3>
                        <p className="text-white/80 text-sm">{challenge.description}</p>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="text-2xl">🎉</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-2">Safety Smart Kid Badge Earned!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Congratulations! You've completed all safety activities and earned the Safety Smart Kid Badge!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">SAFETY SMART KID</div>
                </div>
                <p className="text-white/80">
                  You're a champion at staying safe and healthy! Amazing accomplishment! 🌟🎉
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default SafetySmartKidBadge;
