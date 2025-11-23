import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleWhoDoesWhat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      worker: "Farmer",
      emoji: "👨‍🌾",
      job: "Crops",
      jobEmoji: "🌾",
      description: "Farmers grow crops like wheat, rice, and vegetables."
    },
    {
      id: 2,
      worker: "Pilot",
      emoji: "👨‍✈️",
      job: "Plane",
      jobEmoji: "✈️",
      description: "Pilots fly airplanes to take people to different places."
    },
    {
      id: 3,
      worker: "Chef",
      emoji: "👨‍🍳",
      job: "Food",
      jobEmoji: "🍲",
      description: "Chefs cook delicious meals in restaurants and hotels."
    },
    {
      id: 4,
      worker: "Doctor",
      emoji: "👨‍⚕️",
      job: "Hospital",
      jobEmoji: "🏥",
      description: "Doctors work in hospitals to treat sick patients."
    },
    {
      id: 5,
      worker: "Teacher",
      emoji: "👩‍🏫",
      job: "Students",
      jobEmoji: "📚",
      description: "Teachers help students learn new things in school."
    }
  ];

  const handleWorkerSelect = (worker) => {
    if (selectedJob) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.worker === worker && p.job === selectedJob);
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
      setSelectedWorker(null);
      setSelectedJob(null);
    } else {
      setSelectedWorker(worker);
    }
  };

  const handleJobSelect = (job) => {
    if (selectedWorker) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.worker === selectedWorker && p.job === job);
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
      setSelectedWorker(null);
      setSelectedJob(null);
    } else {
      setSelectedJob(job);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isWorkerSelected = (worker) => selectedWorker === worker;
  const isJobSelected = (job) => selectedJob === job;

  return (
    <GameShell
      title="Puzzle: Who Does What?"
      subtitle={`Match workers to their jobs! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-4"
      gameType="ehe"
      totalLevels={10}
      currentLevel={4}
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
            {/* Workers column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Workers</h3>
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <button
                    key={`worker-${puzzle.id}`}
                    onClick={() => handleWorkerSelect(puzzle.worker)}
                    disabled={isMatched(puzzle.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMatched(puzzle.id)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isWorkerSelected(puzzle.worker)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{puzzle.emoji}</span>
                      <span className="text-white/90 text-lg">{puzzle.worker}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Jobs column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Jobs/Places</h3>
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <button
                    key={`job-${puzzle.id}`}
                    onClick={() => handleJobSelect(puzzle.job)}
                    disabled={isMatched(puzzle.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMatched(puzzle.id)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isJobSelected(puzzle.job)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{puzzle.jobEmoji}</span>
                      <span className="text-white/90 text-lg">{puzzle.job}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedWorker && selectedJob && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedWorker} → {selectedJob}
              </p>
            </div>
          )}
          
          {selectedWorker && !selectedJob && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedWorker}. Now select a job to match!
              </p>
            </div>
          )}
          
          {!selectedWorker && selectedJob && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedJob}. Now select a worker to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all workers to their jobs!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleWhoDoesWhat;