import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchStories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledStories, setShuffledStories] = useState([]);
  const [shuffledSkills, setShuffledSkills] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      story: "Girl Sells Crafts",
      emoji: "🎨",
      skill: "Creativity",
      skillEmoji: "💡",
      description: "Creating and selling handmade crafts shows creativity and artistic skills."
    },
    {
      id: 2,
      story: "Boy Runs App",
      emoji: "💻",
      skill: "Tech",
      skillEmoji: "🖥️",
      description: "Developing and managing an app requires technical and digital skills."
    },
    {
      id: 3,
      story: "Teen Sells Cakes",
      emoji: "🎂",
      skill: "Cooking",
      skillEmoji: "👩‍🍳",
      description: "Baking and selling cakes demonstrates culinary expertise."
    },
    {
      id: 4,
      story: "Kid Repairs Toys",
      emoji: "🔧",
      skill: "Problem-solving",
      skillEmoji: "🧩",
      description: "Fixing broken toys shows technical knowledge and problem-solving abilities."
    },
    {
      id: 5,
      story: "Student Teaches Peers",
      emoji: "📚",
      skill: "Leadership",
      skillEmoji: "👑",
      description: "Teaching others requires leadership and communication skills."
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

    setShuffledStories(shuffleArray(puzzles.map(p => p.story)));
    setShuffledSkills(shuffleArray(puzzles.map(p => p.skill)));
  }, []);

  const handleStorySelect = (story) => {
    if (selectedSkill) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.story === story && p.skill === selectedSkill);
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
      setSelectedStory(null);
      setSelectedSkill(null);
    } else {
      setSelectedStory(story);
    }
  };

  const handleSkillSelect = (skill) => {
    if (selectedStory) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.story === selectedStory && p.skill === skill);
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
      setSelectedStory(null);
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isStorySelected = (story) => selectedStory === story;
  const isSkillSelected = (skill) => selectedSkill === skill;

  return (
    <GameShell
      title="Puzzle: Match Stories"
      subtitle={`Match stories to skills! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-44"
      gameType="ehe"
      totalLevels={10}
      currentLevel={44}
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
            {/* Stories column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Stories</h3>
              <div className="space-y-4">
                {shuffledStories.map((story, index) => {
                  const puzzle = puzzles.find(p => p.story === story);
                  return (
                    <button
                      key={`story-${index}`}
                      onClick={() => handleStorySelect(story)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isStorySelected(story)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{story}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Skills column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Skills</h3>
              <div className="space-y-4">
                {shuffledSkills.map((skill, index) => {
                  const puzzle = puzzles.find(p => p.skill === skill);
                  return (
                    <button
                      key={`skill-${index}`}
                      onClick={() => handleSkillSelect(skill)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isSkillSelected(skill)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.skillEmoji}</span>
                        <span className="text-white/90 text-lg">{skill}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedStory && selectedSkill && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedStory} → {selectedSkill}
              </p>
            </div>
          )}
          
          {selectedStory && !selectedSkill && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedStory}. Now select a skill to match!
              </p>
            </div>
          )}
          
          {!selectedStory && selectedSkill && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedSkill}. Now select a story to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all stories to their skills!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchStories;