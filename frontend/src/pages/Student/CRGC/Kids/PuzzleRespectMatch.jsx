import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleRespectMatch = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledPeople, setShuffledPeople] = useState([]);
  const [shuffledActions, setShuffledActions] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      person: "Teacher",
      emoji: "👩‍🏫",
      action: "Listen",
      actionEmoji: "👂",
      description: "We show respect to teachers by listening carefully during class."
    },
    {
      id: 2,
      person: "Elder",
      emoji: "🧓",
      action: "Help",
      actionEmoji: "🤝",
      description: "We show respect to elders by offering help when they need it."
    },
    {
      id: 3,
      person: "Friend",
      emoji: "👫",
      action: "Share",
      actionEmoji: "📦",
      description: "We show respect to friends by sharing and including them in activities."
    },
    {
      id: 4,
      person: "Classmate",
      emoji: "🧑‍🎓",
      action: "Include",
      actionEmoji: "🙌",
      description: "We show respect to classmates by including them in group activities."
    },
    {
      id: 5,
      person: "Stranger",
      emoji: "👤",
      action: "Be Polite",
      actionEmoji: "🙏",
      description: "We show respect to strangers by being polite and courteous."
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

    setShuffledPeople(shuffleArray(puzzles.map(p => p.person)));
    setShuffledActions(shuffleArray(puzzles.map(p => p.action)));
  }, []);

  const handlePersonSelect = (person) => {
    if (selectedAction) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.person === person && p.action === selectedAction);
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
      setSelectedPerson(null);
      setSelectedAction(null);
    } else {
      setSelectedPerson(person);
    }
  };

  const handleActionSelect = (action) => {
    if (selectedPerson) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.person === selectedPerson && p.action === action);
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
      setSelectedPerson(null);
      setSelectedAction(null);
    } else {
      setSelectedAction(action);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isPersonSelected = (person) => selectedPerson === person;
  const isActionSelected = (action) => selectedAction === action;

  return (
    <GameShell
      title="Puzzle: Respect Match"
      subtitle={`Match people to respectful actions! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-14"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={14}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* People column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">People</h3>
              <div className="space-y-4">
                {shuffledPeople.map((person, index) => {
                  const puzzle = puzzles.find(p => p.person === person);
                  return (
                    <button
                      key={`person-${index}`}
                      onClick={() => handlePersonSelect(person)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isPersonSelected(person)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{person}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Actions column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Respectful Actions</h3>
              <div className="space-y-4">
                {shuffledActions.map((action, index) => {
                  const puzzle = puzzles.find(p => p.action === action);
                  return (
                    <button
                      key={`action-${index}`}
                      onClick={() => handleActionSelect(action)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isActionSelected(action)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.actionEmoji}</span>
                        <span className="text-white/90 text-lg">{action}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedPerson && selectedAction && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedPerson} → {selectedAction}
              </p>
            </div>
          )}
          
          {selectedPerson && !selectedAction && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedPerson}. Now select an action to match!
              </p>
            </div>
          )}
          
          {!selectedPerson && selectedAction && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedAction}. Now select a person to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all people to their respectful actions!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleRespectMatch;