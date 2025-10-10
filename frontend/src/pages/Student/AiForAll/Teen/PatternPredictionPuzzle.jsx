import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PatternPredictionPuzzle = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const puzzles = [
    { id: 1, sequence: ["2", "4", "6", "8", "?"], correct: "10", options: ["9", "10", "12"] },
    { id: 2, sequence: ["5", "10", "15", "20", "?"], correct: "25", options: ["22", "25", "30"] },
    { id: 3, sequence: ["1", "4", "9", "16", "?"], correct: "25", options: ["20", "25", "30"] },
    { id: 4, sequence: ["100", "90", "80", "70", "?"], correct: "60", options: ["50", "60", "65"] },
    { id: 5, sequence: ["1", "1", "2", "3", "5", "?"], correct: "8", options: ["6", "7", "8"] },
    { id: 6, sequence: ["3", "6", "12", "24", "?"], correct: "48", options: ["36", "48", "50"] }
  ];

  const currentPuzzleData = puzzles[currentPuzzle];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    const isCorrect = selectedAnswer === currentPuzzleData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedAnswer(null);
    
    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentPuzzle(prev => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      if ((score + (isCorrect ? 1 : 0)) >= 5) {
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
    navigate("/student/ai-for-all/teen/image-classifier-game");
  };

  return (
    <GameShell
      title="Pattern Prediction Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 5}
      showGameOver={showResult && score >= 5}
      score={coins}
      gameId="ai-teen-2"
      gameType="ai"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showResult && score >= 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">What comes next?</h3>
            
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-8 mb-6">
              <div className="flex justify-center items-center gap-4">
                {currentPuzzleData.sequence.map((num, idx) => (
                  <div key={idx} className="text-6xl font-bold text-white">
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose the answer:</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 5 ? "🎉 Pattern Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You solved {score} out of {puzzles.length} patterns correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI uses pattern recognition to make predictions - from weather forecasting to 
                recommendation systems. You just did what AI does!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 5 ? "You earned 5 Coins! 🪙" : "Get 5 or more correct to earn coins!"}
            </p>
            {score < 5 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default PatternPredictionPuzzle;

