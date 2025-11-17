import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIRightsPuzzle = () => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const puzzles = [
    {
      id: 1,
      question: "Who should make the rules?",
      options: ["🤖 AI", "👩‍💼 Humans", "🦾 Robots"],
      correct: "👩‍💼 Humans",
    },
    {
      id: 2,
      question: "Who should follow the rules?",
      options: ["🧠 Humans", "🤖 AI", "🪴 Plants"],
      correct: "🤖 AI",
    },
    {
      id: 3,
      question: "AI helps humans by...",
      options: ["Making new laws", "Following instructions", "Firing humans"],
      correct: "Following instructions",
    },
    {
      id: 4,
      question: "What is the right order?",
      options: [
        "AI makes rules → Humans follow",
        "Humans make rules → AI follows",
        "No one follows rules",
      ],
      correct: "Humans make rules → AI follows",
    },
  ];

  const currentPuzzle = puzzles[currentMatch];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
  };

  const handleConfirm = () => {
    const isCorrect = selectedChoice === currentPuzzle.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setSelectedChoice(null);

    if (currentMatch < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentMatch((prev) => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      if (score + (isCorrect ? 1 : 0) >= 3) {
        setCoins(5);
      }
      setScore((prev) => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentMatch(0);
    setSelectedChoice(null);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/robot-friend-story"); // next route
  };

  return (
    <GameShell
      title="AI Rights Puzzle"
      subtitle={`Puzzle ${currentMatch + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      showGameOver={showResult && score >= 3}
      score={coins}
      gameId="ai-kids-8"
      gameType="ai"
      totalLevels={20}
      currentLevel={8}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              {currentPuzzle.question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {currentPuzzle.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(option)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedChoice === option
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-3xl text-white font-semibold text-center">{option}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 3 ? "🤖 AI Follows Human Rules!" : "🧩 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You solved {score} out of {puzzles.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 AI does not replace humans — it follows our rules. You just learned about AI responsibility!
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
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIRightsPuzzle;
