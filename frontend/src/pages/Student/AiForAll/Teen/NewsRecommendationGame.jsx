import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NewsRecommendationGame = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 scenario questions (each with AI recommendations)
  const questions = [
    {
      id: 1,
      title: "You select 🧠 ‘Technology’ as your favorite topic.",
      options: [
        { label: "AI News 🤖", isCorrect: true },
        { label: "Sports Updates ⚽", isCorrect: false },
        { label: "Cooking Recipes 🍳", isCorrect: false },
        { label: "Fashion Trends 👗", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "You choose 🎮 ‘Gaming’ category.",
      options: [
        { label: "Game Launch News 🕹️", isCorrect: true },
        { label: "Stock Market 📈", isCorrect: false },
        { label: "Gardening Tips 🌿", isCorrect: false },
        { label: "Political News 🏛️", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "You click on 🌍 ‘Environment’ topic.",
      options: [
        { label: "Climate Change Articles 🌦️", isCorrect: true },
        { label: "Celebrity Gossip 💃", isCorrect: false },
        { label: "Car Reviews 🚗", isCorrect: false },
        { label: "Movie Ratings 🎬", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "You prefer 📚 ‘Education’ stories.",
      options: [
        { label: "Learning Apps News 📱", isCorrect: true },
        { label: "Football Scores ⚽", isCorrect: false },
        { label: "Makeup Tutorials 💄", isCorrect: false },
        { label: "Music Albums 🎵", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "You select 🚀 ‘Space Exploration’.",
      options: [
        { label: "NASA Discoveries 🌌", isCorrect: true },
        { label: "Cooking Blogs 🍰", isCorrect: false },
        { label: "Video Game Reviews 🎮", isCorrect: false },
        { label: "Fashion Week 👠", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 1); // Each correct choice = 1 coin
      showCorrectAnswerFeedback(1, false);
    }

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 400);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentStep(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/self-driving-car-reflexx"); // next path
  };

  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <GameShell
      title="News Recommendation Game 📰"
      subtitle={`Question ${currentStep + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-teen-37"
      gameType="ai"
      totalLevels={40}
      currentLevel={37}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              {currentQuestion.title}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option.isCorrect)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border border-blue-300 rounded-xl p-6 text-white font-semibold text-lg transition-all transform hover:scale-105"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎯 News Guru!" : "📰 Keep Exploring!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You got {score} out of {questions.length} right! ({accuracy}%)
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI recommends personalized news based on your interests — like Technology or Space! The more it learns, the better it suggests what you’ll enjoy reading.
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>

            {accuracy < 70 && (
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

export default NewsRecommendationGame;
