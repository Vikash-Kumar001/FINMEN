import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyRoutineKidBadge = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      text: "Wake up and start day with good hygiene",
      emoji: "🌅",
      description: "Morning routines set a positive tone for your whole day",
      completed: false
    },
    {
      id: 2,
      text: "Eat healthy meals and stay hydrated",
      emoji: "🥗",
      description: "Good nutrition gives you energy and helps you grow strong",
      completed: false
    },
    {
      id: 3,
      text: "Exercise and play every day",
      emoji: "🏃",
      description: "Physical activity keeps your body healthy and mind happy",
      completed: false
    },
    {
      id: 4,
      text: "Read books and learn new things",
      emoji: "📚",
      description: "Reading builds knowledge and imagination for life",
      completed: false
    },
    {
      id: 5,
      text: "Get enough sleep every night",
      emoji: "😴",
      description: "Quality sleep helps your body rest and brain learn",
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
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Healthy Routine Kid Badge"
      subtitle={`Complete ${completedChallenges.length} of ${challenges.length} routine tasks`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedChallenges.length * 2}
      gameId="health-male-kids-100"
      gameType="health-male"
      totalLevels={100}
      currentLevel={100}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Earn Your Healthy Routine Kid Badge</h3>
            <p className="text-white/90">
              Complete 5 routine tasks to prove you're a master of healthy daily habits!
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
                <h3 className="text-3xl font-bold text-white mb-2">Healthy Routine Kid Badge Earned!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  🎉 CONGRATULATIONS! 🎉 You've completed all 100 Health-Male Kids games and earned the ultimate Healthy Routine Kid Badge!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">HEALTHY ROUTINE KID</div>
                </div>
                <p className="text-white/80">
                  You've mastered the complete health curriculum! You're a true health champion! 🌟🏆✨
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HealthyRoutineKidBadge;
