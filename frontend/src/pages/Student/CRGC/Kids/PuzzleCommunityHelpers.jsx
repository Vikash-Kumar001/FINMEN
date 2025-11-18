import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleCommunityHelpers = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledHelpers, setShuffledHelpers] = useState([]);
  const [shuffledRoles, setShuffledRoles] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      helper: "Doctor",
      emoji: "👨‍⚕️",
      role: "Health",
      roleEmoji: "🩺",
      description: "Doctors help keep us healthy by treating illnesses and injuries."
    },
    {
      id: 2,
      helper: "Firefighter",
      emoji: "👨‍🚒",
      role: "Safety",
      roleEmoji: "🚒",
      description: "Firefighters protect us by putting out fires and rescuing people."
    },
    {
      id: 3,
      helper: "Teacher",
      emoji: "👩‍🏫",
      role: "Education",
      roleEmoji: "📚",
      description: "Teachers help us learn new things and develop our skills."
    },
    {
      id: 4,
      helper: "Police Officer",
      emoji: "👮",
      role: "Protection",
      roleEmoji: "🚔",
      description: "Police officers keep our communities safe by enforcing laws."
    },
    {
      id: 5,
      helper: "Volunteer",
      emoji: " volunte️",
      role: "Service",
      roleEmoji: "❤️",
      description: "Volunteers help others and improve communities without expecting payment."
    }
  ];

  // Shuffle arrays when component mounts
  useEffect(() => {
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledHelpers(shuffleArray(puzzles.map(p => p.helper)));
    setShuffledRoles(shuffleArray(puzzles.map(p => p.role)));
  }, []);

  const handleHelperSelect = (helper) => {
    if (selectedRole) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.helper === helper && p.role === selectedRole);
      if (puzzle) {
        // Correct match
        setMatchedPairs([...matchedPairs, puzzle.id]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all puzzles are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => setGameFinished(true), 1500);
        }
      }
      
      // Reset selection
      setSelectedHelper(null);
      setSelectedRole(null);
    } else {
      setSelectedHelper(helper);
    }
  };

  const handleRoleSelect = (role) => {
    if (selectedHelper) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.helper === selectedHelper && p.role === role);
      if (puzzle) {
        // Correct match
        setMatchedPairs([...matchedPairs, puzzle.id]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all puzzles are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => setGameFinished(true), 1500);
        }
      }
      
      // Reset selection
      setSelectedHelper(null);
      setSelectedRole(null);
    } else {
      setSelectedRole(role);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isHelperSelected = (helper) => selectedHelper === helper;
  const isRoleSelected = (role) => selectedRole === role;

  return (
    <GameShell
      title="Puzzle: Community Helpers"
      subtitle={`Match helpers to their roles! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-54"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={54}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Helpers column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Community Helpers</h3>
              <div className="space-y-4">
                {shuffledHelpers.map((helper, index) => {
                  const puzzle = puzzles.find(p => p.helper === helper);
                  return (
                    <button
                      key={`helper-${index}`}
                      onClick={() => handleHelperSelect(helper)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isHelperSelected(helper)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{helper}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Roles column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Roles</h3>
              <div className="space-y-4">
                {shuffledRoles.map((role, index) => {
                  const puzzle = puzzles.find(p => p.role === role);
                  return (
                    <button
                      key={`role-${index}`}
                      onClick={() => handleRoleSelect(role)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isRoleSelected(role)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.roleEmoji}</span>
                        <span className="text-white/90 text-lg">{role}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedHelper && selectedRole && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedHelper} → {selectedRole}
              </p>
            </div>
          )}
          
          {selectedHelper && !selectedRole && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedHelper}. Now select a role to match!
              </p>
            </div>
          )}
          
          {!selectedHelper && selectedRole && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedRole}. Now select a helper to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all community helpers to their roles!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleCommunityHelpers;