import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AISuperpowerPuzzle = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const puzzles = [
    ["AI", "is", "Powerful", "but", "Needs", "Rules"],
    ["AI", "can", "Learn", "from", "Data"],
    ["AI", "helps", "Humans", "solve", "Problems"],
    ["AI", "needs", "Ethics", "and", "Guidelines"],
    ["AI", "is", "Fast", "Accurate", "and", "Helpful"]
  ];

  const shuffledPuzzles = [
    ["Needs", "AI", "Powerful", "Rules", "is", "but"],
    ["Learn", "can", "from", "AI", "Data"],
    ["Humans", "solve", "AI", "helps", "Problems"],
    ["and", "Ethics", "AI", "needs", "Guidelines"],
    ["Fast", "AI", "Helpful", "Accurate", "and", "is"]
  ];

  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const correctOrder = puzzles[currentPuzzle];
  const shuffledWords = shuffledPuzzles[currentPuzzle];

  const isLastPuzzle = currentPuzzle === puzzles.length - 1;

  const handleSelectWord = (word) => {
    if (!currentOrder.includes(word)) {
      setCurrentOrder([...currentOrder, word]);
    }
  };

  const handleConfirm = () => {
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);

    if (isCorrect) {
      setCoins((prev) => prev + 5);
      showCorrectAnswerFeedback(5, true);
    }

    setShowResult(true);
  };

  const handleTryAgain = () => {
    setCurrentOrder([]);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (!isLastPuzzle) {
      setCurrentPuzzle((prev) => prev + 1);
      setCurrentOrder([]);
      setShowResult(false);
    } else {
      navigate("/student/ai-for-all/kids/robot-spy-story");
    }
  };

  return (
    <GameShell
      title="AI Superpower Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={isLastPuzzle && showResult && coins > 0}
      score={coins}
      gameId={`ai-kids-90-${currentPuzzle + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={90 + currentPuzzle}
      showConfetti={showResult && coins > 0}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Arrange the words to form a sentence:
            </h3>

            <div className="bg-blue-500/20 rounded-lg p-6 mb-6 min-h-[100px] flex flex-wrap gap-2 justify-center items-center">
              {currentOrder.map((word, idx) => (
                <div
                  key={idx}
                  className="bg-purple-500/50 text-white px-4 py-2 rounded-lg font-semibold text-lg"
                >
                  {word}
                </div>
              ))}
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Select a word:</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {shuffledWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectWord(word)}
                  disabled={currentOrder.includes(word)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    currentOrder.includes(word)
                      ? "bg-gray-500/50 cursor-not-allowed"
                      : "bg-green-500/30 border-green-400 hover:bg-green-500/50"
                  }`}
                >
                  <div className="text-white font-bold text-lg">{word}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={currentOrder.length !== correctOrder.length}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                currentOrder.length === correctOrder.length
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Sentence
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "🎉 Perfect!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              {coins > 0
                ? "You arranged the sentence correctly!"
                : `The correct sentence was: '${correctOrder.join(" ")}'`}
            </p>

            {coins > 0 ? (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                You earned 5 Coins! 🪙
              </p>
            ) : null}

            <button
              onClick={coins > 0 ? handleNext : handleTryAgain}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {isLastPuzzle ? "Finish" : coins > 0 ? "Next Puzzle" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AISuperpowerPuzzle;
