import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchStudies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledProfessions, setShuffledProfessions] = useState([]);
  const [shuffledColleges, setShuffledColleges] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      profession: "Doctor",
      emoji: "👨‍⚕️",
      college: "Medical College",
      collegeEmoji: "🏥",
      description: "Doctors study at medical colleges to learn about human anatomy, diseases, and treatments."
    },
    {
      id: 2,
      profession: "Lawyer",
      emoji: "👨‍⚖️",
      college: "Law College",
      collegeEmoji: "⚖️",
      description: "Lawyers attend law colleges to study legal principles, court procedures, and case laws."
    },
    {
      id: 3,
      profession: "Artist",
      emoji: "🎨",
      college: "Design College",
      collegeEmoji: "🎭",
      description: "Artists develop their creative skills at design colleges through practice and exploration."
    },
    {
      id: 4,
      profession: "Engineer",
      emoji: "⚙️",
      college: "Engineering College",
      collegeEmoji: "🏗️",
      description: "Engineers study at engineering colleges to learn mathematics, physics, and technical skills."
    },
    {
      id: 5,
      profession: "Chef",
      emoji: "👨‍🍳",
      college: "Culinary School",
      collegeEmoji: "🔪",
      description: "Chefs train at culinary schools to master cooking techniques and food preparation."
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

    setShuffledProfessions(shuffleArray(puzzles.map(p => p.profession)));
    setShuffledColleges(shuffleArray(puzzles.map(p => p.college)));
  }, []);

  const handleProfessionSelect = (profession) => {
    if (selectedCollege) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.profession === profession && p.college === selectedCollege);
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
      setSelectedProfession(null);
      setSelectedCollege(null);
    } else {
      setSelectedProfession(profession);
    }
  };

  const handleCollegeSelect = (college) => {
    if (selectedProfession) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.profession === selectedProfession && p.college === college);
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
      setSelectedProfession(null);
      setSelectedCollege(null);
    } else {
      setSelectedCollege(college);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isProfessionSelected = (profession) => selectedProfession === profession;
  const isCollegeSelected = (college) => selectedCollege === college;

  return (
    <GameShell
      title="Puzzle: Match Studies"
      subtitle={`Match professions to colleges! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-64"
      gameType="ehe"
      totalLevels={10}
      currentLevel={64}
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
            {/* Professions column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Professions</h3>
              <div className="space-y-4">
                {shuffledProfessions.map((profession, index) => {
                  const puzzle = puzzles.find(p => p.profession === profession);
                  return (
                    <button
                      key={`profession-${index}`}
                      onClick={() => handleProfessionSelect(profession)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isProfessionSelected(profession)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{profession}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Colleges column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Colleges</h3>
              <div className="space-y-4">
                {shuffledColleges.map((college, index) => {
                  const puzzle = puzzles.find(p => p.college === college);
                  return (
                    <button
                      key={`college-${index}`}
                      onClick={() => handleCollegeSelect(college)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isCollegeSelected(college)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.collegeEmoji}</span>
                        <span className="text-white/90 text-lg">{college}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedProfession && selectedCollege && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedProfession} → {selectedCollege}
              </p>
            </div>
          )}
          
          {selectedProfession && !selectedCollege && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedProfession}. Now select a college to match!
              </p>
            </div>
          )}
          
          {!selectedProfession && selectedCollege && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedCollege}. Now select a profession to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all professions to their colleges!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchStudies;