import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InclusiveKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-20";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [completedActions, setCompletedActions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const inclusionActions = [
    {
      id: 1,
      title: "Invite Someone New",
      description: "Invite a new or shy student to join your activity",
      emoji: "🤝",
      category: "Invitation"
    },
    {
      id: 2,
      title: "Include Everyone",
      description: "Make sure no one is left out of a game or activity",
      emoji: "⚽",
      category: "Inclusion"
    },
    {
      id: 3,
      title: "Welcome Newcomer",
      description: "Greet and welcome a new student to the class",
      emoji: "👋",
      category: "Welcoming"
    },
    {
      id: 4,
      title: "Share Materials",
      description: "Share your supplies with someone who needs them",
      emoji: "✏️",
      category: "Sharing"
    },
    {
      id: 5,
      title: "Defend Someone",
      description: "Stand up for someone being excluded or teased",
      emoji: "🛡️",
      category: "Protection"
    },
    {
      id: 6,
      title: "Sit Together",
      description: "Sit with someone who is sitting alone",
      emoji: "🪑",
      category: "Companionship"
    },
    {
      id: 7,
      title: "Listen to Ideas",
      description: "Listen and value everyone's ideas in group work",
      emoji: "💡",
      category: "Respect"
    },
    {
      id: 8,
      title: "Be a Buddy",
      description: "Be a buddy to help someone feel less alone",
      emoji: "👫",
      category: "Friendship"
    },
    {
      id: 9,
      title: "Celebrate Differences",
      description: "Appreciate and celebrate what makes each person unique",
      emoji: "🌈",
      category: "Diversity"
    },
    {
      id: 10,
      title: "Make Room",
      description: "Make space for someone to join your table or group",
      emoji: "🎯",
      category: "Inclusion"
    }
  ];

  const handleActionToggle = (actionId) => {
    if (completedActions.includes(actionId)) {
      setCompletedActions(completedActions.filter(id => id !== actionId));
    } else {
      const newCompletedActions = [...completedActions, actionId];
      setCompletedActions(newCompletedActions);
      
      if (newCompletedActions.length === 5) {
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, false);
        setEarnedBadge(true);
        setTimeout(() => {
          setShowResult(true);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    // This is the last level of the second set - navigate back to games menu
    navigate("/games/uvls/kids");
  };

  const progressPercentage = (completedActions.length / 5) * 100;

  return (
    <GameShell
      title="Inclusive Kid Badge"
      subtitle={`Complete 5 Inclusion Acts (${completedActions.length}/5)`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="uvls-kids-20"
      gameType="uvls"
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      currentLevel={20}
      showConfetti={showResult}
      backPath="/games/uvls/kids"
    
      maxScore={20} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Progress to Badge</span>
                  <span className="text-yellow-400 font-bold">{completedActions.length}/5</span>
                </div>
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <p className="text-white/80 text-sm mb-6 text-center">
                Complete 5 inclusion actions this week. Ask your teacher to verify each one!
              </p>

              <div className="space-y-3">
                {inclusionActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionToggle(action.id)}
                    disabled={completedActions.length >= 5 && !completedActions.includes(action.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      completedActions.includes(action.id)
                        ? 'bg-green-500/40 border-green-400 ring-2 ring-green-300'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${completedActions.length >= 5 && !completedActions.includes(action.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{action.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{action.title}</h4>
                          {completedActions.includes(action.id) && (
                            <span className="text-green-400 text-xl">✓</span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mb-1">{action.description}</p>
                        <span className="inline-block bg-white/20 px-2 py-1 rounded text-white/70 text-xs">
                          {action.category}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/20 border-2 border-blue-400/50 rounded-xl">
                <p className="text-white/90 text-sm">
                  <strong>Teacher Tip:</strong> Celebrate completed actions in class circle. 
                  Verify each action to ensure fairness and encourage genuine inclusion!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-9xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-4xl font-bold text-white mb-4">🎉 Congratulations!</h2>
            <p className="text-white/90 text-xl mb-6">
              You've earned the Inclusive Kid Badge!
            </p>
            
            <div className="bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 rounded-2xl p-6 mb-6 transform hover:scale-105 transition-all">
              <div className="text-6xl mb-3">🌟</div>
              <h3 className="text-white text-2xl font-bold mb-2">Inclusive Kid</h3>
              <p className="text-white/90 text-sm">Badge of Belonging & Unity</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold mb-3">Your Completed Actions:</p>
              <div className="space-y-2">
                {inclusionActions
                  .filter(action => completedActions.includes(action.id))
                  .map(action => (
                    <div key={action.id} className="flex items-center gap-2 text-white/80 text-sm">
                      <span>{action.emoji}</span>
                      <span>{action.title}</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  ))}
              </div>
            </div>

            <p className="text-yellow-400 text-xl font-bold mb-4">
              You earned 3 Coins! Achievement Unlocked! 🏆
            </p>
            <p className="text-white/70 text-sm">
              Keep including everyone and making our classroom a welcoming place!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusiveKidBadge;

