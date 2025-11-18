import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LabelErrorPuzzle = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const puzzles = [
    {
      id: 1,
      image: "🐶",
      wrongLabel: "Cat 🐱",
      correct: "Dog 🐶",
      options: ["Cat 🐱", "Dog 🐶", "Lion 🦁"],
    },
    {
      id: 2,
      image: "🍎",
      wrongLabel: "Tomato 🍅",
      correct: "Apple 🍎",
      options: ["Tomato 🍅", "Apple 🍎", "Cherry 🍒"],
    },
    {
      id: 3,
      image: "🚗",
      wrongLabel: "Bus 🚌",
      correct: "Car 🚗",
      options: ["Bus 🚌", "Car 🚗", "Bike 🏍️"],
    },
    {
      id: 4,
      image: "🐘",
      wrongLabel: "Rhino 🦏",
      correct: "Elephant 🐘",
      options: ["Rhino 🦏", "Elephant 🐘", "Hippo 🦛"],
    },
    {
      id: 5,
      image: "🌻",
      wrongLabel: "Sun ☀️",
      correct: "Flower 🌻",
      options: ["Sun ☀️", "Flower 🌻", "Tree 🌳"],
    },
  ];

  const currentPuzzleData = puzzles[currentPuzzle];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    const isCorrect = selectedAnswer === currentPuzzleData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setSelectedAnswer(null);

    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentPuzzle((prev) => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      if ((score + (isCorrect ? 1 : 0)) >= 4) {
        setCoins(5);
      }
      setScore((prev) => prev + (isCorrect ? 1 : 0));
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
    navigate("/student/ai-for-all/teen/ai-training-badgee");
  };

  return (
    <GameShell
      title="Label Error Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-teen-59"
      gameType="ai"
      totalLevels={20}
      currentLevel={59}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Identify the Correct Label!
            </h3>

            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-8 mb-6 text-center">
              <div className="text-[8rem]">{currentPuzzleData.image}</div>
              <p className="text-white mt-4 text-lg">
                ❌ Wrong Label: <span className="font-bold">{currentPuzzleData.wrongLabel}</span>
              </p>
              <p className="text-white/80 text-sm mt-2">
                Can you correct it to help the AI learn better?
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose the correct label:</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentPuzzleData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedAnswer === option
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-3xl font-bold text-white">{option}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedAnswer}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAnswer
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Label
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎉 Labeling Expert!" : "🧩 Keep Training!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You corrected {score} out of {puzzles.length} labels!
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Incorrect labeling can confuse AI! Proper labels help AI make accurate
                predictions — just like you fixed today! 🤖
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>

            {score < 4 && (
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

export default LabelErrorPuzzle;
