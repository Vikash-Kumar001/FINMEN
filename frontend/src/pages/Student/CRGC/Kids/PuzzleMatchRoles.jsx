import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchRoles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Roles (left side) - 5 items
  const roles = [
    { id: 1, name: "Doctor", emoji: "👩‍⚕️", description: "Medical professional who treats patients" },
    { id: 2, name: "Pilot", emoji: "👨‍✈️", description: "Professional who flies aircraft" },
    { id: 3, name: "Teacher", emoji: "👩‍🏫", description: "Educator who teaches students" },
    { id: 4, name: "Engineer", emoji: "👷", description: "Professional who designs and builds structures" },
    { id: 5, name: "Chef", emoji: "👩‍🍳", description: "Professional who cooks food" }
  ];

  // People (right side) - 5 items
  const people = [
    { id: 2, name: "Man", emoji: "👨", description: "Adult male person" },
    { id: 3, name: "Both", emoji: "👥", description: "Either gender can do this role" },
    { id: 1, name: "Woman", emoji: "👩", description: "Adult female person" },
    { id: 5, name: "Specialist", emoji: "🤓", description: "Person with specific skills or training" },
    { id: 4, name: "Anyone", emoji: "🧑", description: "Any person regardless of characteristics" },
  ];

  // Correct matches
  "io"
  const correctMatches = [
  { roleId: 1, personId: 5 }, // Doctor → Specialist 🤓
  { roleId: 2, personId: 2 }, // Pilot → Man 👨
  { roleId: 3, personId: 1 }, // Teacher → Woman 👩
  { roleId: 4, personId: 4 }, // Engineer → Anyone 🧑
  { roleId: 5, personId: 3 }  // Chef → Both 👥
];


  const handleRoleSelect = (role) => {
    if (gameFinished) return;
    setSelectedRole(role);
  };

  const handlePersonSelect = (person) => {
    if (gameFinished) return;
    setSelectedPerson(person);
  };

  const handleMatch = () => {
    if (!selectedRole || !selectedPerson || gameFinished) return;

    resetFeedback();

    const newMatch = {
      roleId: selectedRole.id,
      personId: selectedPerson.id,
      isCorrect: correctMatches.some(
        match => match.roleId === selectedRole.id && match.personId === selectedPerson.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add score and show flash/confetti
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === roles.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedRole(null);
    setSelectedPerson(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedRole(null);
    setSelectedPerson(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  // Check if a role is already matched
  const isRoleMatched = (roleId) => {
    return matches.some(match => match.roleId === roleId);
  };

  // Check if a person is already matched
  const isPersonMatched = (personId) => {
    return matches.some(match => match.personId === personId);
  };

  // Get match result for a role
  const getMatchResult = (roleId) => {
    const match = matches.find(m => m.roleId === roleId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Roles"
      subtitle={gameFinished ? "Game Complete!" : `Match Roles with People Who Can Perform Them (${matches.length}/${roles.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-kids-24"
      gameType="civic-responsibility"
      totalLevels={roles.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
      maxScore={roles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Roles */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Roles</h3>
              <div className="space-y-4">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    disabled={isRoleMatched(role.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRoleMatched(role.id)
                        ? getMatchResult(role.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedRole?.id === role.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{role.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{role.name}</h4>
                        <p className="text-white/80 text-sm">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedRole 
                    ? `Selected: ${selectedRole.name}` 
                    : "Select a Role"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedRole || !selectedPerson}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedRole && selectedPerson
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{roles.length}</p>
                  <p>Matched: {matches.length}/{roles.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - People */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Who Can Do This Role</h3>
              <div className="space-y-4">
                {people.map(person => (
                  <button
                    key={person.id}
                    onClick={() => handlePersonSelect(person)}
                    disabled={isPersonMatched(person.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPersonMatched(person.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPerson?.id === person.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{person.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{person.name}</h4>
                        <p className="text-white/80 text-sm">{person.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {roles.length} roles with the people who can perform them!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Anyone can pursue any career they're interested in, regardless of gender or other characteristics!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {roles.length} roles correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about who can perform each role - gender doesn't determine capability!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchRoles;