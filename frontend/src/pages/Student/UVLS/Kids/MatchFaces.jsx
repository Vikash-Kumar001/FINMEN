import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MatchFaces = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentMatch, setCurrentMatch] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const faceMatches = [
    { id: 1, emoji: "😊", correct: "Happy", options: ["Happy", "Sad", "Angry"] },
    { id: 2, emoji: "😢", correct: "Sad", options: ["Excited", "Sad", "Sleepy"] },
    { id: 3, emoji: "😡", correct: "Angry", options: ["Happy", "Angry", "Scared"] },
    { id: 4, emoji: "😨", correct: "Scared", options: ["Scared", "Bored", "Happy"] },
    { id: 5, emoji: "😴", correct: "Sleepy", options: ["Angry", "Sleepy", "Excited"] },
    { id: 6, emoji: "😮", correct: "Surprised", options: ["Surprised", "Sad", "Calm"] },
    { id: 7, emoji: "🤔", correct: "Thinking", options: ["Happy", "Thinking", "Angry"] },
    { id: 8, emoji: "😰", correct: "Worried", options: ["Worried", "Excited", "Sleepy"] },
    { id: 9, emoji: "🥳", correct: "Excited", options: ["Sad", "Scared", "Excited"] },
    { id: 10, emoji: "😌", correct: "Calm", options: ["Angry", "Calm", "Worried"] }
  ];

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleConfirm = () => {
    if (!selectedEmotion) return;

    const isCorrect = faceMatches[currentMatch].correct === selectedEmotion;
    const newMatches = [...matches, {
      faceId: faceMatches[currentMatch].id,
      selected: selectedEmotion,
      isCorrect
    }];
    
    setMatches(newMatches);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedEmotion(null);
    
    if (currentMatch < faceMatches.length - 1) {
      setTimeout(() => {
        setCurrentMatch(prev => prev + 1);
      }, isCorrect ? 800 : 0);
    } else {
      const correctMatches = newMatches.filter(m => m.isCorrect).length;
      if (correctMatches >= 8) {
        setCoins(3); // +3 Coins for ≥8/10 matches (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentMatch(0);
    setMatches([]);
    setSelectedEmotion(null);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const currentFace = faceMatches[currentMatch];
  const correctMatches = matches.filter(m => m.isCorrect).length;

  return (
    <GameShell
      title="Match Faces"
      score={coins}
      subtitle={`Face ${currentMatch + 1} of ${faceMatches.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctMatches >= 8}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && correctMatches >= 8}
      
      gameId="uvls-kids-4"
      gameType="uvls"
      // totalLevels={10}
      // currentLevel={4}
      showConfetti={showResult && correctMatches >= 8}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Face {currentMatch + 1}/{faceMatches.length}</span>
                <span className="text-yellow-400 font-bold">Matches: {correctMatches}/{currentMatch}</span>
              </div>
              
              <div className="text-9xl mb-6 text-center animate-pulse">{currentFace.emoji}</div>
              
              <p className="text-white text-lg mb-6 text-center font-semibold">
                How is this person feeling?
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {currentFace.options.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => handleEmotionSelect(emotion)}
                    className={`border-2 rounded-xl p-4 transition-all transform hover:scale-105 ${
                      selectedEmotion === emotion
                        ? 'bg-blue-500/50 border-blue-400'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-white font-bold">{emotion}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedEmotion}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedEmotion
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Choice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctMatches >= 8 ? "🎉 Excellent Matching!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {correctMatches} out of {faceMatches.length} faces correctly!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctMatches >= 8 ? "You earned 3 Coins! 🪙" : "Get 8 or more correct to earn coins!"}
            </p>
            {correctMatches < 8 && (
              <button
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MatchFaces;

