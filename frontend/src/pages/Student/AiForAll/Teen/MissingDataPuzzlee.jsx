import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MissingDataPuzzlee = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const puzzles = [
    { id: 1, info: ["Name: Alice", "Age: ?", "City: NY"], correct: "25", options: ["25", "30", "20"] },
    { id: 2, info: ["Product: Laptop", "Price: ?", "Stock: 50"], correct: "1000", options: ["900", "1000", "1100"] },
    { id: 3, info: ["Temperature: ?", "Humidity: 60%", "Wind: 10km/h"], correct: "25°C", options: ["25°C", "30°C", "20°C"] },
    { id: 4, info: ["Student: Bob", "Grade: ?", "Section: A"], correct: "B", options: ["A", "B", "C"] },
    { id: 5, info: ["Item: Apple", "Quantity: ?", "Price: $2"], correct: "10", options: ["5", "10", "15"] },
  ];

  const currentPuzzleData = puzzles[currentPuzzle];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    const isCorrect = selectedAnswer === currentPuzzleData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(5, true);
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
    navigate("/student/ai-for-all/teen/train-with-sounds"); // update with next game path
  };

  return (
    <GameShell
      title="Missing Data Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 5}
      showGameOver={showResult && score >= 5}
      score={coins}
      gameId="ai-teen-missing-data-puzzle"
      gameType="ai"
      totalLevels={20}
      currentLevel={53}
      showConfetti={showResult && score >= 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Complete the missing data!</h3>
            
            <div className="bg-gradient-to-br from-yellow-500/30 to-red-500/30 rounded-xl p-8 mb-6">
              <div className="flex flex-col gap-4 text-white text-2xl font-bold">
                {currentPuzzleData.info.map((item, idx) => (
                  <div key={idx}>{item}</div>
                ))}
              </div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose the correct value:</h3>
            
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
              {score >= 5 ? "🎉 Data Complete!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You completed {score} out of {puzzles.length} puzzles correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI needs complete and accurate data to make correct predictions. Missing data can confuse AI systems!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 5 ? "You earned 5 Coins! 🪙" : "Get all correct to earn coins!"}
            </p>
            {score < 5 && (
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

export default MissingDataPuzzlee;
