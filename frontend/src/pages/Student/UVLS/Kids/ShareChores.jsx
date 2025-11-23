import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShareChores = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedChore, setSelectedChore] = useState(null); // State for tracking selected chore
  const [selectedCharacter, setSelectedCharacter] = useState(null); // State for tracking selected character
  const [choreAssignments, setChoreAssignments] = useState([]); // State for tracking chore assignments
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      chores: ["Wash dishes", "Clean room", "Take out trash"],
      characters: ["Boy", "Girl", "Dad", "Mom"],
      text: "Assign chores in the home fairly."
    },
    {
      id: 2,
      chores: ["Sweep floor", "Water plants", "Set table"],
      characters: ["Sister", "Brother", "Grandma", "Grandpa"],
      text: "Make sure everyone shares classroom duties."
    },
    {
      id: 3,
      chores: ["Fold laundry", "Dust shelves", "Walk dog"],
      characters: ["Kid1", "Kid2", "Teacher", "Parent"],
      text: "Balance chores equally among family."
    },
    {
      id: 4,
      chores: ["Mop floor", "Cook meal", "Garden work"],
      characters: ["Uncle", "Aunt", "Cousin Boy", "Cousin Girl"],
      text: "Assign tasks without gender bias."
    },
    {
      id: 5,
      chores: ["Vacuum", "Shop groceries", "Fix toy"],
      characters: ["Friend1", "Friend2", "Boy", "Girl"],
      text: "Ensure fair distribution in group."
    }
  ];

  // Function to select a chore
  const selectChore = (chore) => {
    setSelectedChore(chore);
    // If a character is already selected, create an assignment
    if (selectedCharacter) {
      // Check if this chore is already assigned
      const isAlreadyAssigned = choreAssignments.some(ass => ass.chore === chore);
      if (!isAlreadyAssigned) {
        setChoreAssignments(prev => [
          ...prev,
          { chore, character: selectedCharacter }
        ]);
      }
      setSelectedCharacter(null); // Clear character selection after assignment
    }
  };

  // Function to select a character
  const selectCharacter = (character) => {
    setSelectedCharacter(character);
    // If a chore is already selected, create an assignment
    if (selectedChore) {
      // Check if this chore is already assigned
      const isAlreadyAssigned = choreAssignments.some(ass => ass.chore === selectedChore);
      if (!isAlreadyAssigned) {
        setChoreAssignments(prev => [
          ...prev,
          { chore: selectedChore, character }
        ]);
      }
      setSelectedChore(null); // Clear chore selection after assignment
    }
  };

  const handleAssignment = () => {
    const newAssignments = [...assignments, choreAssignments];
    setAssignments(newAssignments);

    const isFair = checkFairness(choreAssignments);
    if (isFair) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedChore(null); // Reset selection for next level
        setSelectedCharacter(null); // Reset selection for next level
        setChoreAssignments([]); // Reset assignments for next level
      }, isFair ? 800 : 0);
    } else {
      const fairAssignments = newAssignments.filter(ass => checkFairness(ass)).length;
      setFinalScore(fairAssignments);
      if (fairAssignments >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const checkFairness = (assignments) => {
    // For this game, we'll consider it fair if all chores are assigned
    // and no character has significantly more chores than others
    if (assignments.length === 0) return false;
    
    const countPerChar = {};
    assignments.forEach(ass => {
      countPerChar[ass.character] = (countPerChar[ass.character] || 0) + 1;
    });
    
    // Check if all chores are assigned (equal to chores in current level)
    const allChoresAssigned = assignments.length === getCurrentLevel().chores.length;
    
    // Check if distribution is relatively fair
    const counts = Object.values(countPerChar);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const isDistributionFair = maxCount - minCount <= 1;
    
    return allChoresAssigned && isDistributionFair;
  };

  // Function to remove an assignment
  const removeAssignment = (chore) => {
    setChoreAssignments(prev => prev.filter(ass => ass.chore !== chore));
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setAssignments([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedChore(null); // Reset selection
    setSelectedCharacter(null); // Reset selection
    setChoreAssignments([]); // Reset assignments
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Share Chores"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-21"
      gameType="uvls"
      totalLevels={30}
      currentLevel={21}
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
              
              {/* Chores section */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Chores:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().chores.map(chore => (
                    <button
                      key={chore}
                      onClick={() => selectChore(chore)}
                      className={`p-3 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                        selectedChore === chore
                          ? "bg-blue-400 border-2 border-blue-200" // Visual feedback for selected
                          : choreAssignments.some(ass => ass.chore === chore)
                          ? "bg-green-500 border-2 border-green-300" // Visual feedback for assigned
                          : "bg-blue-500 hover:bg-blue-400 border-2 border-blue-600"
                      }`}
                    >
                      <span>{chore}</span>
                      <span>🧹</span>
                      {choreAssignments.some(ass => ass.chore === chore) && (
                        <span className="text-lg">✅</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Characters section */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Characters:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().characters.map(char => (
                    <button
                      key={char}
                      onClick={() => selectCharacter(char)}
                      className={`p-3 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                        selectedCharacter === char
                          ? "bg-green-400 border-2 border-green-200" // Visual feedback for selected
                          : "bg-green-500 hover:bg-green-400 border-2 border-green-600"
                      }`}
                    >
                      <span>{char}</span>
                      <span>👤</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current assignments display */}
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Your Assignments:</h3>
                <div className="flex flex-wrap gap-2">
                  {choreAssignments.map((assignment, index) => (
                    <div key={index} className="bg-purple-500 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                      <span>{assignment.chore} → {assignment.character}</span>
                      <button 
                        onClick={() => removeAssignment(assignment.chore)}
                        className="text-white hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {choreAssignments.length === 0 && (
                    <div className="text-white/70 italic">No assignments yet. Click a chore and a character to create an assignment.</div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleAssignment} 
                className="mt-2 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={choreAssignments.length === 0}
              >
                Submit Assignment ({choreAssignments.length} assigned)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Fair Sharing!" : "💪 Try Fairer!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {finalScore} fair assignments!
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

export default ShareChores;