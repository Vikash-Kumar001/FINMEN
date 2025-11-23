import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchFeelings2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledEmotions, setShuffledEmotions] = useState([]);
  const [shuffledResponses, setShuffledResponses] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      emotion: "Sadness",
      emoji: "😢",
      response: "Talk to a friend",
      responseEmoji: "💬",
      description: "Talking to someone you trust can help you process your feelings and feel supported."
    },
    {
      id: 2,
      emotion: "Anger",
      emoji: "😠",
      response: "Take deep breaths",
      responseEmoji: "🌬️",
      description: "Deep breathing activates your body's relaxation response and helps calm intense emotions."
    },
    {
      id: 3,
      emotion: "Anxiety",
      emoji: "😰",
      response: "Practice mindfulness",
      responseEmoji: "🧘",
      description: "Mindfulness techniques help you stay present and manage overwhelming thoughts or feelings."
    },
    {
      id: 4,
      emotion: "Joy",
      emoji: "😄",
      response: "Share with others",
      responseEmoji: "🤗",
      description: "Sharing positive experiences with others can multiply your happiness and strengthen relationships."
    },
    {
      id: 5,
      emotion: "Frustration",
      emoji: "😤",
      response: "Take a break",
      responseEmoji: "⏸️",
      description: "Taking a break gives you time to cool down and approach challenges with a fresh perspective."
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

    setShuffledEmotions(shuffleArray(puzzles.map(p => p.emotion)));
    setShuffledResponses(shuffleArray(puzzles.map(p => p.response)));
  }, []);

  const handleEmotionSelect = (emotion) => {
    if (selectedResponse) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.emotion === emotion && p.response === selectedResponse);
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
      setSelectedEmotion(null);
      setSelectedResponse(null);
    } else {
      setSelectedEmotion(emotion);
    }
  };

  const handleResponseSelect = (response) => {
    if (selectedEmotion) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.emotion === selectedEmotion && p.response === response);
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
      setSelectedEmotion(null);
      setSelectedResponse(null);
    } else {
      setSelectedResponse(response);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isEmotionSelected = (emotion) => selectedEmotion === emotion;
  const isResponseSelected = (response) => selectedResponse === response;

  return (
    <GameShell
      title="Puzzle: Match Feelings"
      subtitle={`Match emotions to responses! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-44"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={44}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={50} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Emotions column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Emotions</h3>
              <div className="space-y-4">
                {shuffledEmotions.map((emotion, index) => {
                  const puzzle = puzzles.find(p => p.emotion === emotion);
                  return (
                    <button
                      key={`emotion-${index}`}
                      onClick={() => handleEmotionSelect(emotion)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isEmotionSelected(emotion)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{emotion}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Responses column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Healthy Responses</h3>
              <div className="space-y-4">
                {shuffledResponses.map((response, index) => {
                  const puzzle = puzzles.find(p => p.response === response);
                  return (
                    <button
                      key={`response-${index}`}
                      onClick={() => handleResponseSelect(response)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isResponseSelected(response)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.responseEmoji}</span>
                        <span className="text-white/90 text-lg">{response}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedEmotion && selectedResponse && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedEmotion} → {selectedResponse}
              </p>
            </div>
          )}
          
          {selectedEmotion && !selectedResponse && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedEmotion}. Now select a healthy response!
              </p>
            </div>
          )}
          
          {!selectedEmotion && selectedResponse && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedResponse}. Now select an emotion to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all emotions to healthy responses!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchFeelings2;