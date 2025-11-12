import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmpathyChampionBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const empathyTasks = [
    {
      id: 1,
      title: "Active Listening Practice",
      description: "Have a 10-minute conversation where you actively listen without interrupting",
      emoji: "👂",
      category: "Listening"
    },
    {
      id: 2,
      title: "Support Someone in Need",
      description: "Offer genuine support to someone going through a difficult time",
      emoji: "🤝",
      category: "Support"
    },
    {
      id: 3,
      title: "Perspective Taking",
      description: "Write about a situation from someone else's perspective",
      emoji: "👁️",
      category: "Understanding"
    },
    {
      id: 4,
      title: "Challenge Exclusion",
      description: "Speak up when you see someone being excluded or treated unfairly",
      emoji: "🛡️",
      category: "Advocacy"
    },
    {
      id: 5,
      title: "Validate Emotions",
      description: "Validate someone's feelings without trying to fix or minimize them",
      emoji: "💝",
      category: "Validation"
    },
    {
      id: 6,
      title: "Cultural Understanding",
      description: "Learn about and appreciate a culture different from your own",
      emoji: "🌍",
      category: "Diversity"
    },
    {
      id: 7,
      title: "Empathetic Response",
      description: "Respond empathetically to someone sharing a personal struggle",
      emoji: "💬",
      category: "Communication"
    }
  ];

  const handleTaskToggle = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      const newCompletedTasks = [...completedTasks, taskId];
      setCompletedTasks(newCompletedTasks);
      
      if (newCompletedTasks.length === 5) {
        showCorrectAnswerFeedback(3, false);
        setEarnedBadge(true);
        setTimeout(() => {
          setShowResult(true);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/cultural-greeting");
  };

  const progressPercentage = (completedTasks.length / 5) * 100;

  return (
    <GameShell
      title="Empathy Champion Badge"
      subtitle={`Complete 5 Empathy Tasks (${completedTasks.length}/5)`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={earnedBadge ? 3 : 0}
      gameId="uvls-teen-10"
      gameType="uvls"
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      currentLevel={10}
      showConfetti={showResult}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Progress to Badge</span>
                  <span className="text-yellow-400 font-bold">{completedTasks.length}/5</span>
                </div>
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <p className="text-white/80 text-sm mb-6 text-center">
                Complete 5 empathy tasks to earn your champion badge!
              </p>

              <div className="space-y-3">
                {empathyTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskToggle(task.id)}
                    disabled={completedTasks.length >= 5 && !completedTasks.includes(task.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      completedTasks.includes(task.id)
                        ? 'bg-purple-500/40 border-purple-400 ring-2 ring-purple-300'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${completedTasks.length >= 5 && !completedTasks.includes(task.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{task.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{task.title}</h4>
                          {completedTasks.includes(task.id) && (
                            <span className="text-green-400 text-xl">✓</span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mb-1">{task.description}</p>
                        <span className="inline-block bg-white/20 px-2 py-1 rounded text-white/70 text-xs">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-500/20 border-2 border-purple-400/50 rounded-xl">
                <p className="text-white/90 text-sm">
                  <strong>Teacher Note:</strong> Encourage peer recognition for badge winners.
                  These tasks build deep empathy skills!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-9xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-4xl font-bold text-white mb-4">🎉 Congratulations!</h2>
            <p className="text-white/90 text-xl mb-6">
              You've earned the Empathy Champion Badge!
            </p>
            
            <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-2xl p-6 mb-6 transform hover:scale-105 transition-all">
              <div className="text-6xl mb-3">🌟</div>
              <h3 className="text-white text-2xl font-bold mb-2">Empathy Champion</h3>
              <p className="text-white/90 text-sm">Master of Understanding & Compassion</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold mb-3">Your Completed Tasks:</p>
              <div className="space-y-2">
                {empathyTasks
                  .filter(task => completedTasks.includes(task.id))
                  .map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-white/80 text-sm">
                      <span>{task.emoji}</span>
                      <span>{task.title}</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  ))}
              </div>
            </div>

            <p className="text-yellow-400 text-xl font-bold mb-4">
              You earned 3 Coins! Achievement Unlocked! 🏆
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathyChampionBadge;

