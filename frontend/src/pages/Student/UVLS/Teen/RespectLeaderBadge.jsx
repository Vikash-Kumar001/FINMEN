import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RespectLeaderBadge = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-20";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const leadershipTasks = [
    {
      id: 1,
      title: "Lead an Inclusion Initiative",
      description: "Organize and lead an activity or event that promotes inclusion in your school",
      emoji: "🎯",
      category: "Leadership",
      example: "Start a buddy program, organize a diversity celebration, create an inclusion club"
    },
    {
      id: 2,
      title: "Mentor a Peer",
      description: "Mentor someone who is struggling with feeling excluded or different",
      emoji: "🤝",
      category: "Mentorship",
      example: "Regular check-ins, help with social integration, academic support"
    },
    {
      id: 3,
      title: "Challenge Discrimination",
      description: "Actively challenge discriminatory behavior or policies (safely)",
      emoji: "🛡️",
      category: "Advocacy",
      example: "Report bullying, propose policy changes, support affected students"
    },
    {
      id: 4,
      title: "Create Inclusive Content",
      description: "Create content (poster, presentation, video) promoting respect and inclusion",
      emoji: "🎨",
      category: "Creativity",
      example: "Anti-bullying campaign, diversity awareness materials, inclusive messaging"
    },
    {
      id: 5,
      title: "Facilitate Dialogue",
      description: "Facilitate a respectful dialogue on a challenging inclusion topic",
      emoji: "💬",
      category: "Facilitation",
      example: "Lead classroom discussion, moderate peer conversations, bridge differences"
    },
    {
      id: 6,
      title: "Support Policy Change",
      description: "Research and advocate for an inclusive policy change at your school",
      emoji: "📋",
      category: "Policy",
      example: "Gender-neutral facilities, accessibility improvements, anti-bias curriculum"
    },
    {
      id: 7,
      title: "Build Bridges",
      description: "Create connections between different groups or communities in your school",
      emoji: "🌉",
      category: "Community Building",
      example: "Cross-cultural events, mixed-ability activities, peer mentoring across grades"
    },
    {
      id: 8,
      title: "Document Impact",
      description: "Document and share stories of inclusion successes in your school",
      emoji: "📸",
      category: "Documentation",
      example: "Interview peers, create case studies, share positive changes"
    }
  ];

  const handleTaskToggle = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      const newCompletedTasks = [...completedTasks, taskId];
      setCompletedTasks(newCompletedTasks);
      
      if (newCompletedTasks.length === 5) {
        setEarnedBadge(true);
        showCorrectAnswerFeedback(1, false);
        setTimeout(() => {
          setShowResult(true);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    // Last game - navigate back to category
    navigate("/games/uvls/teens");
  };

  const progressPercentage = (completedTasks.length / 5) * 100;

  return (
    <GameShell
      title="Respect Leader Badge"
      subtitle={`Complete 5 Leadership Tasks (${completedTasks.length}/5)`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={earnedBadge ? 1 : 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-20"
      gameType="uvls"
      totalLevels={20}
      currentLevel={20}
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
                Complete 5 inclusion leadership tasks to earn your Respect Leader credential!
              </p>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {leadershipTasks.map(task => (
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
                      <div className="text-3xl">{task.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{task.title}</h4>
                          {completedTasks.includes(task.id) && (
                            <span className="text-green-400 text-xl">✓</span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mb-2">{task.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="inline-block bg-white/20 px-2 py-1 rounded text-white/70 text-xs">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs mt-2 italic">
                          Example: {task.example}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/20 border-2 border-blue-400/50 rounded-xl">
                <p className="text-white/90 text-sm">
                  <strong>Teacher Note:</strong> Use this badge as a leadership credential. 
                  Recognize badge winners publicly to inspire others!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-9xl mb-6 animate-bounce">👑</div>
            <h2 className="text-4xl font-bold text-white mb-4">🎉 Congratulations, Leader!</h2>
            <p className="text-white/90 text-xl mb-6">
              You've earned the Respect Leader Badge!
            </p>
            
            <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-2xl p-6 mb-6 transform hover:scale-105 transition-all">
              <div className="text-6xl mb-3">🏆</div>
              <h3 className="text-white text-2xl font-bold mb-2">Respect Leader</h3>
              <p className="text-white/90 text-sm">Champion of Inclusion & Diversity</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
              <p className="text-white font-semibold mb-3">Your Leadership Accomplishments:</p>
              <div className="space-y-2">
                {leadershipTasks
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
              You earned 3 Coins! Leadership Credential Unlocked! 🏆
            </p>
            <p className="text-white/70 text-sm">
              Continue leading with respect and inclusion in your community!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RespectLeaderBadge;

