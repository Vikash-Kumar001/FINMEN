import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PatternVsNoiseGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Question 1",
      prompt: "Which image is clean training data?",
      options: [
        { id: 1, label: "Noisy Scribbles", isCorrect: false },
        { id: 2, label: "Clear Pattern", isCorrect: true },
      ],
    },
    {
      id: 2,
      title: "Question 2",
      prompt: "Pick the correct data for AI training.",
      options: [
        { id: 1, label: "Random Noise", isCorrect: false },
        { id: 2, label: "Structured Pattern", isCorrect: true },
      ],
    },
    {
      id: 3,
      title: "Question 3",
      prompt: "Identify good quality data for AI.",
      options: [
        { id: 1, label: "Blurry Scribbles", isCorrect: false },
        { id: 2, label: "Clear Shapes", isCorrect: true },
      ],
    },
    {
      id: 4,
      title: "Question 4",
      prompt: "Which training set will help AI learn better?",
      options: [
        { id: 1, label: "Messy Noise", isCorrect: false },
        { id: 2, label: "Clean Data", isCorrect: true },
      ],
    },
    {
      id: 5,
      title: "Question 5",
      prompt: "Pick the correct data for teaching AI.",
      options: [
        { id: 1, label: "Random Scribbles", isCorrect: false },
        { id: 2, label: "Organized Pattern", isCorrect: true },
      ],
    },
  ];

  const current = questions[currentQuestion];
  const selectedOption = current.options.find(opt => opt.id === selectedAnswer);

  const handleSelect = (id) => {
    setSelectedAnswer(id);
  };

  const handleConfirm = () => {
    if (selectedOption.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setScore(prev => prev + 1);
      setCoins(prev => prev + 5);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        resetFeedback();
      }, 800);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/teach-ai-emotions"); // Update to next game
  };

  return (
    <GameShell
      title="Pattern vs Noise Game"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="ai-teen-70"
      gameType="ai"
      totalLevels={20}
      currentLevel={70}
      showConfetti={showResult && score >= 3}
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">{current.title}</h3>
            <p className="text-white/90 mb-6 text-center">{current.prompt}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {current.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedAnswer === opt.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-bold text-lg">{opt.label}</div>
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
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 3 ? "🎉 Well Done!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You selected {score} out of {questions.length} correct data patterns!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI learns better with clean data. Choosing good training examples ensures smarter AI predictions.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 3 ? `You earned ${coins} Coins! 🪙` : "Try again to earn coins!"}
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

export default PatternVsNoiseGame;
