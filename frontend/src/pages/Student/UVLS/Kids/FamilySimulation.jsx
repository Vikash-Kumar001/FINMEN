import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FamilySimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-78";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedChore, setSelectedChore] = useState(null);
  const [choreAssignments, setChoreAssignments] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      chores: ["Wash dishes", "Clean room", "Walk dog"],
      members: ["Mom", "Dad", "Kid"],
      text: "Assign family chores fairly."
    },
    {
      id: 2,
      chores: ["Cook dinner", "Laundry", "Garden"],
      members: ["Sister", "Brother", "Parent"],
      text: "Balance home tasks."
    },
    {
      id: 3,
      chores: ["Shop groceries", "Fix light", "Dust"],
      members: ["Grandma", "Grandpa", "Child"],
      text: "Fair family duties."
    },
    {
      id: 4,
      chores: ["Mop floor", "Vacuum", "Trash out"],
      members: ["Aunt", "Uncle", "Cousin"],
      text: "Share housework."
    },
    {
      id: 5,
      chores: ["Set table", "Water plants", "Fold clothes"],
      members: ["Family1", "Family2", "Family3"],
      text: "Equitable allocation."
    }
  ];

  const handleChoreClick = (chore) => {
    setSelectedChore(chore);
  };

  const handleMemberClick = (member) => {
    if (selectedChore) {
      // Create a new assignment
      const newAssignment = { chore: selectedChore, member: member };
      setChoreAssignments([...choreAssignments, newAssignment]);
      setSelectedChore(null); // Reset selection
    }
  };

  const handleAssignment = () => {
    const newAssignments = [...assignments, choreAssignments];
    setAssignments(newAssignments);

    const isFair = checkFairness(choreAssignments);
    if (isFair) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setChoreAssignments([]); // Reset for next level
        setSelectedChore(null);
      }, isFair ? 800 : 0);
    } else {
      const fairAssignments = newAssignments.filter(ass => checkFairness(ass)).length;
      setFinalScore(fairAssignments);
      setShowResult(true);
    }
  };

  const checkFairness = (assignments) => {
    const countPerMember = {};
    assignments.forEach(ass => {
      countPerMember[ass.member] = (countPerMember[ass.member] || 0) + 1;
    });
    return Object.values(countPerMember).every(count => count === 1);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setAssignments([]);
    setCoins(0);
    setFinalScore(0);
    setChoreAssignments([]);
    setSelectedChore(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Family Simulation"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-78"
      gameType="uvls"
      totalLevels={100}
      currentLevel={78}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">{getCurrentLevel().text}</p>
              
              {/* Display current assignments */}
              <div className="mb-4 min-h-[30px]">
                {choreAssignments.map((assignment, idx) => (
                  <p key={idx} className="text-white">
                    {assignment.chore} → {assignment.member} ✅
                  </p>
                ))}
                {selectedChore && (
                  <p className="text-yellow-300">
                    Selected: {selectedChore} (now tap a family member)
                  </p>
                )}
              </div>
              
              {/* Chores */}
              <div className="flex flex-wrap gap-4">
                {getCurrentLevel().chores.map(chore => (
                  <div 
                    key={chore} 
                    className={`p-2 rounded cursor-pointer ${selectedChore === chore ? 'bg-yellow-500' : choreAssignments.some(a => a.chore === chore) ? 'bg-green-500' : 'bg-blue-500'}`}
                    onClick={() => handleChoreClick(chore)}
                  >
                    {chore} 🏡
                  </div>
                ))}
              </div>
              
              {/* Family Members */}
              <div className="flex flex-wrap gap-4 mt-4">
                {getCurrentLevel().members.map(member => (
                  <div 
                    key={member} 
                    className={`p-2 rounded cursor-pointer ${choreAssignments.some(a => a.member === member) ? 'bg-green-500' : 'bg-green-500'}`}
                    onClick={() => handleMemberClick(member)}
                  >
                    {member} 👨‍👩‍👧
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleAssignment} 
                className="mt-4 bg-purple-500 text-white p-2 rounded"
                disabled={choreAssignments.length !== getCurrentLevel().chores.length}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Family Balancer!" : "💪 Balance Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You balanced fairly {finalScore} times!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FamilySimulation;