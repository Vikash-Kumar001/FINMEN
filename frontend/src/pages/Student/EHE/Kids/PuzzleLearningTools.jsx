import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleLearningTools = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Create arrays for left and right columns
  const tools = [
    { id: 1, name: "Books", emoji: "📚" },
    { id: 2, name: "Internet", emoji: "🌐" },
    { id: 3, name: "Practice", emoji: "🏋️" }
  ];

  const outcomes = [
    { id: 1, name: "Knowledge", emoji: "🧠" },
    { id: 2, name: "Information", emoji: "ℹ️" },
    { id: 3, name: "Skills", emoji: "🔧" }
  ];

  // Define correct matches
  const correctMatches = [
    { tool: "Books", outcome: "Knowledge" },
    { tool: "Internet", outcome: "Information" },
    { tool: "Practice", outcome: "Skills" }
  ];

  // Shuffle arrays to randomize positions
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
  
  const shuffledTools = shuffleArray(tools);
  const shuffledOutcomes = shuffleArray(outcomes);

  const handleToolSelect = (toolName) => {
    if (selectedOutcome) {
      // Check if this is a correct match
      const isCorrect = correctMatches.some(match => 
        match.tool === toolName && match.outcome === selectedOutcome
      );
      
      if (isCorrect) {
        // Correct match
        const matchId = `${toolName}-${selectedOutcome}`;
        setMatchedPairs([...matchedPairs, matchId]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all puzzles are matched
        if (matchedPairs.length + 1 === correctMatches.length) {
          setTimeout(() => setGameFinished(true), 1500);
        }
      }
      
      // Reset selection
      setSelectedTool(null);
      setSelectedOutcome(null);
    } else {
      setSelectedTool(toolName);
    }
  };

  const handleOutcomeSelect = (outcomeName) => {
    if (selectedTool) {
      // Check if this is a correct match
      const isCorrect = correctMatches.some(match => 
        match.tool === selectedTool && match.outcome === outcomeName
      );
      
      if (isCorrect) {
        // Correct match
        const matchId = `${selectedTool}-${outcomeName}`;
        setMatchedPairs([...matchedPairs, matchId]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all puzzles are matched
        if (matchedPairs.length + 1 === correctMatches.length) {
          setTimeout(() => setGameFinished(true), 1500);
        }
      }
      
      // Reset selection
      setSelectedTool(null);
      setSelectedOutcome(null);
    } else {
      setSelectedOutcome(outcomeName);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isToolSelected = (toolName) => selectedTool === toolName;
  const isOutcomeSelected = (outcomeName) => selectedOutcome === outcomeName;

  return (
    <GameShell
      title="Puzzle: Learning Tools"
      subtitle={`Match learning tools to their outcomes! ${matchedPairs.length}/${correctMatches.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-94"
      gameType="ehe"
      totalLevels={10}
      currentLevel={94}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tools column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Learning Tools</h3>
              <div className="space-y-4">
                {shuffledTools.map((tool) => (
                  <button
                    key={`tool-${tool.id}`}
                    onClick={() => handleToolSelect(tool.name)}
                    disabled={matchedPairs.includes(`${tool.name}-Knowledge`) || 
                              matchedPairs.includes(`${tool.name}-Information`) || 
                              matchedPairs.includes(`${tool.name}-Skills`)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      matchedPairs.includes(`${tool.name}-Knowledge`) || 
                      matchedPairs.includes(`${tool.name}-Information`) || 
                      matchedPairs.includes(`${tool.name}-Skills`)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isToolSelected(tool.name)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{tool.emoji}</span>
                      <span className="text-white/90 text-lg">{tool.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Outcomes column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Learning Outcomes</h3>
              <div className="space-y-4">
                {shuffledOutcomes.map((outcome) => (
                  <button
                    key={`outcome-${outcome.id}`}
                    onClick={() => handleOutcomeSelect(outcome.name)}
                    disabled={matchedPairs.includes(`Books-${outcome.name}`) || 
                              matchedPairs.includes(`Internet-${outcome.name}`) || 
                              matchedPairs.includes(`Practice-${outcome.name}`)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      matchedPairs.includes(`Books-${outcome.name}`) || 
                      matchedPairs.includes(`Internet-${outcome.name}`) || 
                      matchedPairs.includes(`Practice-${outcome.name}`)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isOutcomeSelected(outcome.name)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{outcome.emoji}</span>
                      <span className="text-white/90 text-lg">{outcome.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedTool && selectedOutcome && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedTool} → {selectedOutcome}
              </p>
            </div>
          )}
          
          {selectedTool && !selectedOutcome && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedTool}. Now select an outcome to match!
              </p>
            </div>
          )}
          
          {!selectedTool && selectedOutcome && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedOutcome}. Now select a tool to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all learning tools to their outcomes!
              </p>
              <p className="text-green-300 text-center mt-2">
                Books give you Knowledge, Internet provides Information, and Practice builds Skills!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleLearningTools;