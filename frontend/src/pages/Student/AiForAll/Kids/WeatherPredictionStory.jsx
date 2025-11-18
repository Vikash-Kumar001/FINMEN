import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WeatherPredictionStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🌦️ 5 AI Weather Questions
  const questions = [
    {
      title: "AI Weather Prediction",
      emoji: "🌦️",
      situation:
        'The news says "Tomorrow it will rain." Who is most likely predicting it correctly?',
      choices: [
        { id: 1, text: "AI Weather Forecast 🤖", emoji: "🌐", isCorrect: true },
        { id: 2, text: "Just guessing 🌤️", emoji: "❓", isCorrect: false },
        { id: 3, text: "Looking at clouds ☁️", emoji: "☁️", isCorrect: false },
        { id: 4, text: "Asking a neighbor 🗣️", emoji: "👤", isCorrect: false },
      ],
      explanation:
        "AI uses historical and real-time data to predict weather accurately. Not random guessing!",
    },
    {
      title: "Data for Prediction",
      emoji: "📊",
      situation: "What kind of data helps AI predict the weather?",
      choices: [
        { id: 1, text: "Temperature, humidity & wind 🌡️💨", emoji: "🌦️", isCorrect: true },
        { id: 2, text: "Movie ratings 🍿", emoji: "🎬", isCorrect: false },
        { id: 3, text: "Random numbers 🎲", emoji: "🎲", isCorrect: false },
        { id: 4, text: "Astrology signs ♈", emoji: "✨", isCorrect: false },
      ],
      explanation:
        "AI studies temperature, humidity, and wind data to predict rainfall and storms.",
    },
    {
      title: "Smart Weather Apps",
      emoji: "📱",
      situation: "How do apps like AccuWeather or Google Weather work?",
      choices: [
        { id: 1, text: "Using AI models & satellites 🛰️", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Guessing randomly 🤷‍♂️", emoji: "❌", isCorrect: false },
        { id: 3, text: "By reading newspapers 📰", emoji: "🗞️", isCorrect: false },
        { id: 4, text: "By people’s opinions 💬", emoji: "👥", isCorrect: false },
      ],
      explanation:
        "These apps use AI models with satellite and sensor data to forecast the weather.",
    },
    {
      title: "AI vs Humans",
      emoji: "🧠",
      situation: "Can AI predict weather better than humans?",
      choices: [
        { id: 1, text: "Yes, using data & patterns 📈", emoji: "✅", isCorrect: true },
        { id: 2, text: "No, humans guess better 👨‍🏫", emoji: "👎", isCorrect: false },
        { id: 3, text: "Only during summer ☀️", emoji: "☀️", isCorrect: false },
        { id: 4, text: "Never 🌫️", emoji: "🚫", isCorrect: false },
      ],
      explanation:
        "AI can analyze massive data and detect complex patterns that humans may miss.",
    },
    {
      title: "Helping Farmers",
      emoji: "🌾",
      situation: "How does AI weather prediction help farmers?",
      choices: [
        { id: 1, text: "Plan crops & save from floods 🌧️", emoji: "🌻", isCorrect: true },
        { id: 2, text: "Tell jokes 😂", emoji: "🤣", isCorrect: false },
        { id: 3, text: "Change the weather ☁️", emoji: "⚡", isCorrect: false },
        { id: 4, text: "Make animals talk 🐮", emoji: "🐮", isCorrect: false },
      ],
      explanation:
        "AI predictions help farmers decide when to plant and protect crops from bad weather.",
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    if (!selectedChoice) return;
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      setCoins((prev) => prev + 10);
      showCorrectAnswerFeedback(10, true);
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
      // 🎯 All questions done → move to next game
      navigate("/student/ai-for-all/kids/smartwatch-game");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Weather Prediction Story"
      subtitle="Forecasting with AI"
      score={coins}
      gameId="ai-kids-38"
      gameType="ai"
      totalLevels={100}
      currentLevel={38}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      backPath="/games/ai-for-all/kids"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg text-center font-semibold">
                {current.situation}
              </p>
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
                    <div className="text-4xl">{choice.emoji}</div>
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
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "🌤️ Correct!" : "🤔 Try Again!"}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{current.explanation}</p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-6">
                  +10 Coins 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question →
                </button>
              </>
            ) : (
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

export default WeatherPredictionStory;
