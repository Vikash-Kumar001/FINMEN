import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FutureOfAIQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Will AI fly cars in 2050?",
      emoji: "🚗🤖",
      choices: [
        { id: 1, text: "Maybe", emoji: "🤔", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 3, text: "No", emoji: "❌", isCorrect: false },
      ],
    },
    {
      text: "Will AI teachers replace humans completely?",
      emoji: "🧑‍🏫🤖",
      choices: [
        { id: 1, text: "Maybe", emoji: "🧠", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 3, text: "No", emoji: "❌", isCorrect: false },
      ],
    },
    {
      text: "Could AI create its own city one day?",
      emoji: "🏙️🤖",
      choices: [
        { id: 1, text: "Maybe", emoji: "🤔", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 3, text: "No", emoji: "❌", isCorrect: false },
      ],
    },
    {
      text: "Will AI become smarter than humans?",
      emoji: "🧠⚡",
      choices: [
        { id: 1, text: "Maybe", emoji: "🤔", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 3, text: "No", emoji: "❌", isCorrect: false },
      ],
    },
    {
      text: "Can AI dream like humans in the future?",
      emoji: "💭🤖",
      choices: [
        { id: 1, text: "Maybe", emoji: "🤔", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 3, text: "No", emoji: "❌", isCorrect: false },
      ],
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleNext();
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ethics-badge"); // update next route
  };

  return (
    <GameShell
      title="Future of AI Quiz"
      subtitle="Sparks Imagination"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect && currentQuestion === questions.length - 1}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-teen-90"
      gameType="ai"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4">{current.emoji}</div>
            <p className="text-white text-2xl font-semibold mb-6">{current.text}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl py-6 px-4 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-5xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-xl">{choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4">{selectedChoiceData.isCorrect ? "🚀" : "🤷‍♀️"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "Nice Thinking!" : "Hmm, not exactly..."}
            </h2>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! “Maybe” keeps imagination open — we can dream about amazing AI futures but also stay realistic! 🌍
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question ➡️"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    “Maybe” is the best answer! AI’s future is exciting but uncertain — anything’s possible with imagination! 💡
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FutureOfAIQuiz;
