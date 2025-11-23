import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchSkills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedMeaning, setSelectedMeaning] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      skill: "Leader",
      emoji: "👑",
      meaning: "Guide",
      meaningEmoji: "🧭",
      description: "A leader guides and inspires others toward a common goal."
    },
    {
      id: 2,
      skill: "Innovator",
      emoji: "🔧",
      meaning: "Invent",
      meaningEmoji: "💡",
      description: "An innovator creates new ideas, products, or solutions."
    },
    {
      id: 3,
      skill: "Team Player",
      emoji: "🤝",
      meaning: "Support",
      meaningEmoji: "🤲",
      description: "A team player works well with others and supports their teammates."
    },
    {
      id: 4,
      skill: "Problem Solver",
      emoji: "🧩",
      meaning: "Fix",
      meaningEmoji: "🔧",
      description: "A problem solver finds solutions to challenges and obstacles."
    },
    {
      id: 5,
      skill: "Communicator",
      emoji: "💬",
      meaning: "Share",
      meaningEmoji: "📤",
      description: "A communicator shares ideas and information clearly with others."
    }
  ];

  const handleSkillSelect = (skill) => {
    if (selectedMeaning) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.skill === skill && p.meaning === selectedMeaning);
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
      setSelectedSkill(null);
      setSelectedMeaning(null);
    } else {
      setSelectedSkill(skill);
    }
  };

  const handleMeaningSelect = (meaning) => {
    if (selectedSkill) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.skill === selectedSkill && p.meaning === meaning);
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
      setSelectedSkill(null);
      setSelectedMeaning(null);
    } else {
      setSelectedMeaning(meaning);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isSkillSelected = (skill) => selectedSkill === skill;
  const isMeaningSelected = (meaning) => selectedMeaning === meaning;

  return (
    <GameShell
      title="Puzzle: Match Skills"
      subtitle={`Match skills to their meanings! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-14"
      gameType="ehe"
      totalLevels={10}
      currentLevel={14}
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
            {/* Skills column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Skills</h3>
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <button
                    key={`skill-${puzzle.id}`}
                    onClick={() => handleSkillSelect(puzzle.skill)}
                    disabled={isMatched(puzzle.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMatched(puzzle.id)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isSkillSelected(puzzle.skill)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{puzzle.emoji}</span>
                      <span className="text-white/90 text-lg">{puzzle.skill}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Meanings column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Meanings</h3>
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <button
                    key={`meaning-${puzzle.id}`}
                    onClick={() => handleMeaningSelect(puzzle.meaning)}
                    disabled={isMatched(puzzle.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMatched(puzzle.id)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isMeaningSelected(puzzle.meaning)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{puzzle.meaningEmoji}</span>
                      <span className="text-white/90 text-lg">{puzzle.meaning}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedSkill && selectedMeaning && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedSkill} → {selectedMeaning}
              </p>
            </div>
          )}
          
          {selectedSkill && !selectedMeaning && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedSkill}. Now select a meaning to match!
              </p>
            </div>
          )}
          
          {!selectedSkill && selectedMeaning && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedMeaning}. Now select a skill to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all skills to their meanings!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchSkills;