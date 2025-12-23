import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneToolsPuzzle44 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-44";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hygiene Tools (left side) - 5 items
  const tools = [
    { id: 1, name: "Toothbrush", emoji: "🪥", description: "Dental cleaner" },
    { id: 2, name: "Comb", emoji: "💇", description: "Hair detangler" },
    { id: 3, name: "Deodorant", emoji: "🧴", description: "Odor controller" },
    { id: 4, name: "Nail Clipper", emoji: "💅", description: "Nail trimmer" },
    { id: 5, name: "Loofah/Sponge", emoji: "🧽", description: "Skin scrubber" }
  ];

  // Body Parts/Purposes (right side) - 5 items
  const bodyParts = [
    { id: 3, name: "Underarms", emoji: "🦿", description: "Sweat zone" },
    { id: 5, name: "Back/Body", emoji: "🧼", description: "Full cleansing" },
    { id: 1, name: "Teeth/Mouth", emoji: "🦷", description: "Oral care" },
    { id: 4, name: "Fingers/Toes", emoji: "👐", description: "Nail area" },
    { id: 2, name: "Head/Hair", emoji: "🧠", description: "Scalp care" }
  ];

  // Correct matches
  const correctMatches = [
    { toolId: 1, bodyPartId: 1 }, // Toothbrush → Teeth/Mouth
    { toolId: 2, bodyPartId: 2 }, // Comb → Head/Hair
    { toolId: 3, bodyPartId: 3 }, // Deodorant → Underarms
    { toolId: 4, bodyPartId: 4 }, // Nail Clipper → Fingers/Toes
    { toolId: 5, bodyPartId: 5 }  // Loofah/Sponge → Back/Body
  ];

  const handleToolSelect = (tool) => {
    if (gameFinished) return;
    setSelectedTool(tool);
  };

  const handleBodyPartSelect = (bodyPart) => {
    if (gameFinished) return;
    setSelectedBodyPart(bodyPart);
  };

  const handleMatch = () => {
    if (!selectedTool || !selectedBodyPart || gameFinished) return;

    resetFeedback();

    const newMatch = {
      toolId: selectedTool.id,
      bodyPartId: selectedBodyPart.id,
      isCorrect: correctMatches.some(
        match => match.toolId === selectedTool.id && match.bodyPartId === selectedBodyPart.id
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
    };

    // Check if all items are matched
    if (newMatches.length === tools.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTool(null);
    setSelectedBodyPart(null);
  };

  // Check if a tool is already matched
  const isToolMatched = (toolId) => {
    return matches.some(match => match.toolId === toolId);
  };

  // Check if a body part is already matched
  const isBodyPartMatched = (bodyPartId) => {
    return matches.some(match => match.bodyPartId === bodyPartId);
  };

  // Get match result for a tool
  const getMatchResult = (toolId) => {
    const match = matches.find(m => m.toolId === toolId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/night-sweat-story");
  };

  return (
    <GameShell
      title="Hygiene Tools Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Tools with Body Parts (${matches.length}/${tools.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={tools.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === tools.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/teens"
      maxScore={tools.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Hygiene Tools */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Hygiene Tools</h3>
              <div className="space-y-4">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    disabled={isToolMatched(tool.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isToolMatched(tool.id)
                        ? getMatchResult(tool.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTool?.id === tool.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{tool.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{tool.name}</h4>
                        <p className="text-white/80 text-sm">{tool.description}</p>
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
                  {selectedTool 
                    ? `Selected: ${selectedTool.name}` 
                    : "Select a Tool"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTool || !selectedBodyPart}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTool && selectedBodyPart
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{tools.length}</p>
                  <p>Matched: {matches.length}/{tools.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Body Parts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Body Parts</h3>
              <div className="space-y-4">
                {bodyParts.map(bodyPart => (
                  <button
                    key={bodyPart.id}
                    onClick={() => handleBodyPartSelect(bodyPart)}
                    disabled={isBodyPartMatched(bodyPart.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isBodyPartMatched(bodyPart.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedBodyPart?.id === bodyPart.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{bodyPart.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{bodyPart.name}</h4>
                        <p className="text-white/80 text-sm">{bodyPart.description}</p>
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
                  You correctly matched {score} out of {tools.length} hygiene tools with body parts!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Using the right hygiene tools on the right body parts keeps you clean and healthy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {tools.length} tools correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which tool is specifically designed for each body part!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneToolsPuzzle44;
