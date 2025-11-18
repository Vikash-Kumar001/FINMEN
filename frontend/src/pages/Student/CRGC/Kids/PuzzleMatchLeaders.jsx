import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchLeaders = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledLeaders, setShuffledLeaders] = useState([]);
  const [shuffledRoles, setShuffledRoles] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      leader: "Class Monitor",
      emoji: "📚",
      role: "Responsibility",
      roleEmoji: "📋",
      description: "A class monitor helps maintain order and assists the teacher in classroom management."
    },
    {
      id: 2,
      leader: "Mayor",
      emoji: "🏙️",
      role: "City",
      roleEmoji: "🏢",
      description: "A mayor leads a city, making decisions about local services, infrastructure, and community development."
    },
    {
      id: 3,
      leader: "Prime Minister",
      emoji: "🇮🇳",
      role: "Country",
      roleEmoji: "🏛️",
      description: "A Prime Minister leads a country, overseeing government operations and representing the nation."
    },
    {
      id: 4,
      leader: "Team Captain",
      emoji: "⚽",
      role: "Sports Team",
      roleEmoji: "🏅",
      description: "A team captain leads a sports team, motivating players and communicating with coaches."
    },
    {
      id: 5,
      leader: "Community Volunteer",
      emoji: "🤝",
      role: "Neighborhood",
      roleEmoji: "🏘️",
      description: "A community volunteer leads local initiatives to improve neighborhood conditions and help residents."
    }
  ];

  // Shuffle arrays for random positioning
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setShuffledLeaders(shuffleArray(puzzles));
    setShuffledRoles(shuffleArray(puzzles));
  }, []);

  const handleLeaderSelect = (leader) => {
    if (matchedPairs.some(pair => pair.leaderId === leader.id)) return;
    
    if (selectedRole) {
      // Check if it's a correct match
      if (selectedRole.id === leader.id) {
        const newPair = { leaderId: leader.id, roleId: selectedRole.id };
        setMatchedPairs(prev => [...prev, newPair]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => {
            setGameFinished(true);
            showAnswerConfetti();
          }, 1000);
        }
      }
      
      // Reset selections
      setSelectedLeader(null);
      setSelectedRole(null);
    } else {
      setSelectedLeader(leader);
    }
  };

  const handleRoleSelect = (role) => {
    if (matchedPairs.some(pair => pair.roleId === role.id)) return;
    
    if (selectedLeader) {
      // Check if it's a correct match
      if (selectedLeader.id === role.id) {
        const newPair = { leaderId: selectedLeader.id, roleId: role.id };
        setMatchedPairs(prev => [...prev, newPair]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => {
            setGameFinished(true);
            showAnswerConfetti();
          }, 1000);
        }
      }
      
      // Reset selections
      setSelectedLeader(null);
      setSelectedRole(null);
    } else {
      setSelectedRole(role);
    }
  };

  const isLeaderMatched = (leaderId) => {
    return matchedPairs.some(pair => pair.leaderId === leaderId);
  };

  const isRoleMatched = (roleId) => {
    return matchedPairs.some(pair => pair.roleId === roleId);
  };

  const isLeaderSelected = (leader) => {
    return selectedLeader && selectedLeader.id === leader.id;
  };

  const isRoleSelected = (role) => {
    return selectedRole && selectedRole.id === role.id;
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  if (gameFinished) {
    return (
      <GameShell
        title="Puzzle: Match Leaders"
        subtitle="Puzzle Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-kids-94"
        gameType="civic-responsibility"
        totalLevels={100}
        currentLevel={94}
        showConfetti={true}
        flashPoints={flashPoints}
        backPath="/games/civic-responsibility/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You matched all {puzzles.length} leader-role pairs!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're a leadership expert!
          </div>
          <p className="text-white/80">
            Remember: Leadership can happen at any level, from classroom to country!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Puzzle: Match Leaders"
      subtitle={`Match leaders with their responsibilities | Score: ${coins}/${puzzles.length}`}
      backPath="/games/civic-responsibility/kids"
      flashPoints={flashPoints}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Leaders column */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Leaders</h3>
              <div className="space-y-4">
                {shuffledLeaders.map((leader) => (
                  <button
                    key={leader.id}
                    onClick={() => handleLeaderSelect(leader)}
                    disabled={isLeaderMatched(leader.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all transform ${
                      isLeaderMatched(leader.id)
                        ? "bg-green-500/30 border-2 border-green-500"
                        : isLeaderSelected(leader)
                        ? "bg-blue-500/30 border-2 border-blue-500 scale-95"
                        : "bg-white/10 hover:bg-white/20 border-2 border-transparent hover:scale-105"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{leader.emoji}</div>
                      <div>
                        <h4 className="font-bold text-lg text-white">{leader.leader}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Roles column */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Responsibilities</h3>
              <div className="space-y-4">
                {shuffledRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    disabled={isRoleMatched(role.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all transform ${
                      isRoleMatched(role.id)
                        ? "bg-green-500/30 border-2 border-green-500"
                        : isRoleSelected(role)
                        ? "bg-blue-500/30 border-2 border-blue-500 scale-95"
                        : "bg-white/10 hover:bg-white/20 border-2 border-transparent hover:scale-105"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{role.roleEmoji}</div>
                      <div>
                        <h4 className="font-bold text-lg text-white">{role.role}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Show description when a pair is matched */}
          {matchedPairs.length > 0 && (
            <div className="mt-8 p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <h4 className="font-bold text-blue-300 mb-2">Leadership Insight:</h4>
              <p className="text-white/90">
                {puzzles.find(p => p.id === matchedPairs[matchedPairs.length - 1].leaderId)?.description}
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Match each leader with their area of responsibility!
            </p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchLeaders;