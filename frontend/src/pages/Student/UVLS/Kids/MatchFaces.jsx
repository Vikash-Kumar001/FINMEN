import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const MatchFaces = () => {
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-4";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [currentMatch, setCurrentMatch] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const faceMatches = [
    { id: 1, emoji: "😊", correct: "Happy", options: ["Happy", "Sad", "Angry"] },
    { id: 2, emoji: "😢", correct: "Sad", options: ["Excited", "Sad", "Sleepy"] },
    { id: 3, emoji: "😡", correct: "Angry", options: ["Happy", "Angry", "Scared"] },
    { id: 4, emoji: "😨", correct: "Scared", options: ["Scared", "Bored", "Happy"] },
    { id: 5, emoji: "😴", correct: "Sleepy", options: ["Angry", "Sleepy", "Excited"] }
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
      setCoins(prev => prev + 1); // 1 coin for correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedEmotion(null);
    
    if (currentMatch < faceMatches.length - 1) {
      setTimeout(() => {
        setCurrentMatch(prev => prev + 1);
      }, isCorrect ? 800 : 0);
    } else {
      setShowResult(true);
    }
  };


  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const currentFace = faceMatches[currentMatch];
  const correctMatches = matches.filter(m => m.isCorrect).length;
  // Score should be the number of correct answers for backend
  const finalScore = showResult ? correctMatches : coins;

  return (
    <GameShell
      title="Match Faces"
      score={finalScore}
      subtitle={`Face ${currentMatch + 1} of ${faceMatches.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctMatches === 5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      totalLevels={5}
      maxScore={5}
      gameId="uvls-kids-4"
      gameType="uvls"
      showConfetti={showResult && correctMatches === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
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
        )}
      </div>
    </GameShell>
  );
};

export default MatchFaces;

