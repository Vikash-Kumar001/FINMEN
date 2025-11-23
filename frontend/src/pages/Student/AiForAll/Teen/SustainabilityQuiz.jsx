import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SustainabilityQuiz = () => {
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
      text: "Can AI save electricity by turning off lights when no one’s in the room?",
      emoji: "💡",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
    },
    {
      text: "Can AI predict energy demand to reduce wastage?",
      emoji: "⚡",
      choices: [
        { id: 1, text: "Yes", emoji: "🤖", isCorrect: true },
        { id: 2, text: "No", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      text: "Can AI help in detecting pollution levels in cities?",
      emoji: "🏙️",
      choices: [
        { id: 1, text: "Yes", emoji: "🌿", isCorrect: true },
        { id: 2, text: "No", emoji: "💨", isCorrect: false },
      ],
    },
    {
      text: "Can AI help design eco-friendly buildings?",
      emoji: "🏠",
      choices: [
        { id: 1, text: "Yes", emoji: "🏗️", isCorrect: true },
        { id: 2, text: "No", emoji: "🙅", isCorrect: false },
      ],
    },
    {
      text: "Can AI track water usage to prevent wastage?",
      emoji: "💧",
      choices: [
        { id: 1, text: "Yes", emoji: "💙", isCorrect: true },
        { id: 2, text: "No", emoji: "🚱", isCorrect: false },
      ],
    },
  ];

  const currentQ = questions[currentQuestion];
  const selectedChoiceData = currentQ.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQ.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/teen/robot-honesty-game"); // update route if needed
    }
  };

  return (
    <GameShell
      title="Sustainability Quiz"
      subtitle={`AI for Environment 🌍`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId="ai-teen-sustainability"
      gameType="ai"
      totalLevels={20}
      currentLevel={15}
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{currentQ.emoji}</div>
            <div className="bg-green-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {currentQ.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQ.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : choice.isCorrect
                      ? "bg-green-500/20 border-green-400 hover:bg-green-500/30"
                      : "bg-red-500/20 border-red-400 hover:bg-red-500/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-3xl">{choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
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
            <div className="text-8xl mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌱" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Eco Smart!" : "Not Quite..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That’s right! 🌍 AI can help reduce energy waste, manage resources efficiently, 
                    and protect the environment for a sustainable future.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! 🤖 AI is already used in smart homes and industries to save power, 
                    water, and reduce pollution.
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default SustainabilityQuiz;
