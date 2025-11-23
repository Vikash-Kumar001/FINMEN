import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoodDataVSBadDataPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const puzzles = [
    { id: 1, image: "📷 Clear Photo", correct: "Good", options: ["Good", "Bad"] },
    { id: 2, image: "📸 Blurry Photo", correct: "Bad", options: ["Good", "Bad"] },
    { id: 3, image: "🌅 High-Quality Landscape", correct: "Good", options: ["Good", "Bad"] },
    { id: 4, image: "🌄 Low-Resolution Image", correct: "Bad", options: ["Good", "Bad"] },
    { id: 5, image: "👩 Clear Portrait", correct: "Good", options: ["Good", "Bad"] }
  ];

  const currentPuzzleData = puzzles[currentPuzzle];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    const isCorrect = selectedAnswer === currentPuzzleData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(5, false);
    }

    setSelectedAnswer(null);

    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentPuzzle(prev => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      if ((score + (isCorrect ? 1 : 0)) >= 3) {
        setCoins(5);
      }
      setScore(prev => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentPuzzle(0);
    setSelectedAnswer(null);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-jobs-debate"); // Update the next path
  };

  return (
    <GameShell
      title="Good Data vs Bad Data Puzzle"
      score={coins}
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 3}
      
      gameId="ai-teen-85"
      gameType="ai"
      totalLevels={20}
      currentLevel={85}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Identify Good vs Bad Data</h3>
            
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-8 mb-6 text-center">
              <div className="text-7xl">{currentPuzzleData.image}</div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose the correct label:</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentPuzzleData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedAnswer === option
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-5xl font-bold text-white">{option}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedAnswer}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 3 ? "🎉 Data Expert!" : "💡 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You labeled {score} out of {puzzles.length} images correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                📊 AI needs ethical and clean datasets to learn properly. By choosing good data, you helped AI make better predictions.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 3 ? "You earned 5 Coins! 🪙" : "Get 3 or more correct to earn coins!"}
            </p>
            {score < 3 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GoodDataVSBadDataPuzzle;
