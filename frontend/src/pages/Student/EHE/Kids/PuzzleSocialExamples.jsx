import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSocialExamples = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledSolutions, setShuffledSolutions] = useState([]);
  const [shuffledAreas, setShuffledAreas] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      solution: "Solar Lamps",
      emoji: "💡",
      area: "Villages",
      areaEmoji: "🏘️",
      description: "Solar lamps provide clean, affordable lighting to villages without electricity."
    },
    {
      id: 2,
      solution: "Clean Water",
      emoji: "💧",
      area: "Rural Areas",
      areaEmoji: "🌾",
      description: "Clean water systems improve health and quality of life in rural communities."
    },
    {
      id: 3,
      solution: "Microloans",
      emoji: "💰",
      area: "Poor Families",
      areaEmoji: "👨‍👩‍👧‍👦",
      description: "Small loans help poor families start businesses and improve their livelihoods."
    },
    {
      id: 4,
      solution: "Recycling Programs",
      emoji: "♻️",
      area: "Urban Communities",
      areaEmoji: "🏙️",
      description: "Recycling programs reduce waste and create jobs in urban areas."
    },
    {
      id: 5,
      solution: "Mobile Health Clinics",
      emoji: "🚑",
      area: "Remote Regions",
      areaEmoji: "🗺️",
      description: "Mobile clinics bring healthcare services to remote regions with limited access."
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

    setShuffledSolutions(shuffleArray(puzzles.map(p => p.solution)));
    setShuffledAreas(shuffleArray(puzzles.map(p => p.area)));
  }, []);

  const handleSolutionSelect = (solution) => {
    if (selectedArea) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.solution === solution && p.area === selectedArea);
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
      setSelectedSolution(null);
      setSelectedArea(null);
    } else {
      setSelectedSolution(solution);
    }
  };

  const handleAreaSelect = (area) => {
    if (selectedSolution) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.solution === selectedSolution && p.area === area);
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
      setSelectedSolution(null);
      setSelectedArea(null);
    } else {
      setSelectedArea(area);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isSolutionSelected = (solution) => selectedSolution === solution;
  const isAreaSelected = (area) => selectedArea === area;

  return (
    <GameShell
      title="Puzzle: Social Examples"
      subtitle={`Match solutions to areas! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-84"
      gameType="ehe"
      totalLevels={10}
      currentLevel={84}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Solutions column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Solutions</h3>
              <div className="space-y-4">
                {shuffledSolutions.map((solution, index) => {
                  const puzzle = puzzles.find(p => p.solution === solution);
                  return (
                    <button
                      key={`solution-${index}`}
                      onClick={() => handleSolutionSelect(solution)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isSolutionSelected(solution)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{solution}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Areas column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Areas</h3>
              <div className="space-y-4">
                {shuffledAreas.map((area, index) => {
                  const puzzle = puzzles.find(p => p.area === area);
                  return (
                    <button
                      key={`area-${index}`}
                      onClick={() => handleAreaSelect(area)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isAreaSelected(area)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.areaEmoji}</span>
                        <span className="text-white/90 text-lg">{area}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedSolution && selectedArea && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedSolution} → {selectedArea}
              </p>
            </div>
          )}
          
          {selectedSolution && !selectedArea && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedSolution}. Now select an area to match!
              </p>
            </div>
          )}
          
          {!selectedSolution && selectedArea && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedArea}. Now select a solution to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all social solutions to their areas!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleSocialExamples;