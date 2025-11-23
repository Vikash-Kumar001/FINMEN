import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchCareers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledCareers, setShuffledCareers] = useState([]);
  const [shuffledSchools, setShuffledSchools] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      career: "Farmer",
      emoji: "🌾",
      school: "Agriculture School",
      schoolEmoji: "🚜",
      description: "Farmers study at agriculture schools to learn crop management and farming techniques."
    },
    {
      id: 2,
      career: "Engineer",
      emoji: "⚙️",
      school: "College",
      schoolEmoji: "🏛️",
      description: "Engineers attend college to study mathematics, physics, and engineering principles."
    },
    {
      id: 3,
      career: "Chef",
      emoji: "👨‍🍳",
      school: "Culinary School",
      schoolEmoji: "🔪",
      description: "Chefs train at culinary schools to master cooking techniques and food preparation."
    },
    {
      id: 4,
      career: "Doctor",
      emoji: "👨‍⚕️",
      school: "Medical School",
      schoolEmoji: "🏥",
      description: "Doctors complete medical school to learn about human anatomy, diseases, and treatments."
    },
    {
      id: 5,
      career: "Artist",
      emoji: "🎨",
      school: "Art School",
      schoolEmoji: "🎭",
      description: "Artists develop their skills at art schools through practice and creative exploration."
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

    setShuffledCareers(shuffleArray(puzzles.map(p => p.career)));
    setShuffledSchools(shuffleArray(puzzles.map(p => p.school)));
  }, []);

  const handleCareerSelect = (career) => {
    if (selectedSchool) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.career === career && p.school === selectedSchool);
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
      setSelectedCareer(null);
      setSelectedSchool(null);
    } else {
      setSelectedCareer(career);
    }
  };

  const handleSchoolSelect = (school) => {
    if (selectedCareer) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.career === selectedCareer && p.school === school);
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
      setSelectedCareer(null);
      setSelectedSchool(null);
    } else {
      setSelectedSchool(school);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isCareerSelected = (career) => selectedCareer === career;
  const isSchoolSelected = (school) => selectedSchool === school;

  return (
    <GameShell
      title="Puzzle: Match Careers"
      subtitle={`Match careers to schools! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-54"
      gameType="ehe"
      totalLevels={10}
      currentLevel={54}
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
            {/* Careers column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Careers</h3>
              <div className="space-y-4">
                {shuffledCareers.map((career, index) => {
                  const puzzle = puzzles.find(p => p.career === career);
                  return (
                    <button
                      key={`career-${index}`}
                      onClick={() => handleCareerSelect(career)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isCareerSelected(career)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{career}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Schools column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Schools</h3>
              <div className="space-y-4">
                {shuffledSchools.map((school, index) => {
                  const puzzle = puzzles.find(p => p.school === school);
                  return (
                    <button
                      key={`school-${index}`}
                      onClick={() => handleSchoolSelect(school)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isSchoolSelected(school)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.schoolEmoji}</span>
                        <span className="text-white/90 text-lg">{school}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedCareer && selectedSchool && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedCareer} → {selectedSchool}
              </p>
            </div>
          )}
          
          {selectedCareer && !selectedSchool && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedCareer}. Now select a school to match!
              </p>
            </div>
          )}
          
          {!selectedCareer && selectedSchool && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedSchool}. Now select a career to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all careers to their schools!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchCareers;