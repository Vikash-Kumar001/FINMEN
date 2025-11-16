import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafeKidBadge = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      text: "Say no to smoking and cigarettes",
      emoji: "🚬",
      description: "You chose health over harmful tobacco products",
      completed: false
    },
    {
      id: 2,
      text: "Refuse alcohol and drinking",
      emoji: "🍺",
      description: "You protected your growing body from alcohol",
      completed: false
    },
    {
      id: 3,
      text: "Avoid drugs and dangerous substances",
      emoji: "💊",
      description: "You made smart choices to stay away from drugs",
      completed: false
    },
    {
      id: 4,
      text: "Choose healthy activities over harmful ones",
      emoji: "🏃",
      description: "You picked exercise and fun over dangerous habits",
      completed: false
    },
    {
      id: 5,
      text: "Help friends make safe choices too",
      emoji: "🤝",
      description: "You supported others in staying healthy and safe",
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
      title="Safe Kid Badge"
      subtitle={`Complete ${completedChallenges.length} of ${challenges.length} anti-substance tasks`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedChallenges.length * 2}
      gameId="health-male-kids-90"
      gameType="health-male"
      totalLevels={90}
      currentLevel={90}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Earn Your Safe Kid Badge</h3>
            <p className="text-white/90">
              Complete 5 anti-substance tasks to prove you're a substance safety expert!
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
                <h3 className="text-3xl font-bold text-white mb-2">Safe Kid Badge Earned!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Congratulations! You've mastered substance safety and earned the Safe Kid Badge!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">SAFE KID</div>
                </div>
                <p className="text-white/80">
                  You're a champion at saying no to harmful substances! Amazing final achievement! 🌟🎉
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default SafeKidBadge;
