import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchRoles = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledRoles, setShuffledRoles] = useState([]);
  const [shuffledPeople, setShuffledPeople] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      role: "Doctor",
      emoji: "👩‍⚕️",
      person: "Woman",
      personEmoji: "👩",
      description: "Women can be doctors just as men can. Gender doesn't determine professional capability."
    },
    {
      id: 2,
      role: "Pilot",
      emoji: "👨‍✈️",
      person: "Man",
      personEmoji: "👨",
      description: "Men can be pilots, but so can women. Anyone can pursue any career they're interested in."
    },
    {
      id: 3,
      role: "Teacher",
      emoji: "👩‍🏫",
      person: "Both",
      personEmoji: "👥",
      description: "Both men and women can be excellent teachers. Gender doesn't determine teaching ability."
    },
    {
      id: 4,
      role: "Engineer",
      emoji: "👷",
      person: "Both",
      personEmoji: "👥",
      description: "Engineering is a field for anyone interested, regardless of gender."
    },
    {
      id: 5,
      role: "Chef",
      emoji: "👩‍🍳",
      person: "Both",
      personEmoji: "👥",
      description: "Cooking is a skill anyone can develop, regardless of gender."
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

    setShuffledRoles(shuffleArray(puzzles.map(p => p.role)));
    setShuffledPeople(shuffleArray(puzzles.map(p => p.person)));
  }, []);

  const handleRoleSelect = (role) => {
    if (selectedPerson) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.role === role && p.person === selectedPerson);
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
      setSelectedRole(null);
      setSelectedPerson(null);
    } else {
      setSelectedRole(role);
    }
  };

  const handlePersonSelect = (person) => {
    if (selectedRole) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.role === selectedRole && p.person === person);
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
      setSelectedRole(null);
      setSelectedPerson(null);
    } else {
      setSelectedPerson(person);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isRoleSelected = (role) => selectedRole === role;
  const isPersonSelected = (person) => selectedPerson === person;

  return (
    <GameShell
      title="Puzzle: Match Roles"
      subtitle={`Match roles to who can perform them! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-24"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={24}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{role}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* People column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Who Can Do This Role</h3>
              <div className="space-y-4">
                {shuffledPeople.map((person, index) => {
                  const puzzle = puzzles.find(p => p.person === person);
                  return (
                    <button
                      key={`person-${index}`}
                      onClick={() => handlePersonSelect(person)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isPersonSelected(person)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.personEmoji}</span>
                        <span className="text-white/90 text-lg">{person}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedRole && selectedPerson && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedRole} → {selectedPerson}
              </p>
            </div>
          )}
          
          {selectedRole && !selectedPerson && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedRole}. Now select who can do this role!
              </p>
            </div>
          )}
          
          {!selectedRole && selectedPerson && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedPerson}. Now select a role to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all roles correctly!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchRoles;