import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIInFarmingStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      title: "AI Weather Help 🌦️",
      situation: "The farmer wonders when to water the crops. Who gives the best advice?",
      choices: [
        { id: 1, text: "AI Weather Forecast 🤖", isCorrect: true },
        { id: 2, text: "Random Guess 🌾", isCorrect: false },
      ],
    },
    {
      title: "Smart Soil Sensor 🌱",
      situation: "The soil is drying fast. Who detects it and alerts the farmer?",
      choices: [
        { id: 1, text: "AI Soil Sensor 🛰️", isCorrect: true },
        { id: 2, text: "Farmer’s Intuition 👨‍🌾", isCorrect: false },
      ],
    },
    {
      title: "Pest Detection 🐛",
      situation: "Insects attack the field. Who spots them early?",
      choices: [
        { id: 1, text: "AI Drone Camera 🚁", isCorrect: true },
        { id: 2, text: "Scarecrow 🪶", isCorrect: false },
      ],
    },
    {
      title: "Fertilizer Suggestion 💧",
      situation: "The crops need nutrients. Who suggests the right fertilizer?",
      choices: [
        { id: 1, text: "AI Crop Advisor 🤖", isCorrect: true },
        { id: 2, text: "Old Farmer Tale 📜", isCorrect: false },
      ],
    },
    {
      title: "Harvest Time Prediction 🌾",
      situation: "The farmer asks: When is the best time to harvest?",
      choices: [
        { id: 1, text: "AI Growth Monitor 📈", isCorrect: true },
        { id: 2, text: "Random Calendar Date 📅", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins((prev) => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/teen/ai-in-banking-quiz"); // next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="AI in Farming Story"
      subtitle="Smart Agriculture 🌾"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-farming-story"
      gameType="ai"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">🌾</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-green-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.text.split(" ")[1]}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.text.split(" ")[1]}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌾 Smart Farming Success!" : "❌ Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! AI helps farmers predict, plan, and grow smarter! 🤖🌿
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +10 Coins Earned! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    AI tools make farming smarter! Try again to learn how they help! 🌿
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

export default AIInFarmingStory;
