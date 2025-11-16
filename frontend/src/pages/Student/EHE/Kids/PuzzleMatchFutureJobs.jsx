import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchFutureJobs = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledJobs, setShuffledJobs] = useState([]);
  const [shuffledFields, setShuffledFields] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      job: "Game Designer",
      emoji: "🎮",
      field: "Games",
      fieldEmoji: "🕹️",
      description: "Game designers create the concepts, rules, and experiences for video games."
    },
    {
      id: 2,
      job: "Drone Pilot",
      emoji: "🚁",
      field: "Flying Robots",
      fieldEmoji: "🤖",
      description: "Drone pilots operate unmanned aerial vehicles for various commercial and recreational purposes."
    },
    {
      id: 3,
      job: "Data Scientist",
      emoji: "📊",
      field: "Numbers",
      fieldEmoji: "🔢",
      description: "Data scientists analyze complex data sets to find patterns and make predictions."
    },
    {
      id: 4,
      job: "AI Engineer",
      emoji: "🤖",
      field: "Artificial Intelligence",
      fieldEmoji: "🧠",
      description: "AI engineers develop intelligent systems that can learn and make decisions."
    },
    {
      id: 5,
      job: "Renewable Energy Technician",
      emoji: "⚡",
      field: "Green Energy",
      fieldEmoji: "🌿",
      description: "Renewable energy technicians install and maintain solar panels, wind turbines, and other clean energy systems."
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

    setShuffledJobs(shuffleArray(puzzles.map(p => p.job)));
    setShuffledFields(shuffleArray(puzzles.map(p => p.field)));
  }, []);

  const handleJobSelect = (job) => {
    if (selectedField) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.job === job && p.field === selectedField);
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
      setSelectedJob(null);
      setSelectedField(null);
    } else {
      setSelectedJob(job);
    }
  };

  const handleFieldSelect = (field) => {
    if (selectedJob) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.job === selectedJob && p.field === field);
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
      setSelectedJob(null);
      setSelectedField(null);
    } else {
      setSelectedField(field);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isJobSelected = (job) => selectedJob === job;
  const isFieldSelected = (field) => selectedField === field;

  return (
    <GameShell
      title="Puzzle: Match Future Jobs"
      subtitle={`Match jobs to fields! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-74"
      gameType="ehe"
      totalLevels={10}
      currentLevel={74}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Jobs column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Jobs</h3>
              <div className="space-y-4">
                {shuffledJobs.map((job, index) => {
                  const puzzle = puzzles.find(p => p.job === job);
                  return (
                    <button
                      key={`job-${index}`}
                      onClick={() => handleJobSelect(job)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isJobSelected(job)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{job}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Fields column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Fields</h3>
              <div className="space-y-4">
                {shuffledFields.map((field, index) => {
                  const puzzle = puzzles.find(p => p.field === field);
                  return (
                    <button
                      key={`field-${index}`}
                      onClick={() => handleFieldSelect(field)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isFieldSelected(field)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.fieldEmoji}</span>
                        <span className="text-white/90 text-lg">{field}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedJob && selectedField && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedJob} → {selectedField}
              </p>
            </div>
          )}
          
          {selectedJob && !selectedField && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedJob}. Now select a field to match!
              </p>
            </div>
          )}
          
          {!selectedJob && selectedField && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedField}. Now select a job to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all future jobs to their fields!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchFutureJobs;