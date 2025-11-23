import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const KindVsMeanQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which word is kind?",
      options: [
        { id: "a", text: "Stupid", isCorrect: false },
        { id: "b", text: "Friend", isCorrect: true },
        { id: "c", text: "Ugly", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Choose the kind word:",
      options: [
        { id: "a", text: "Nice", isCorrect: true },
        { id: "b", text: "Loser", isCorrect: false },
        { id: "c", text: "Hate", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What’s the kind word to call someone?",
      options: [
        { id: "a", text: "Buddy", isCorrect: true },
        { id: "b", text: "Idiot", isCorrect: false },
        { id: "c", text: "Dumb", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Pick the kind expression:",
      options: [
        { id: "a", text: "You can do it!", isCorrect: true },
        { id: "b", text: "You’re useless", isCorrect: false },
        { id: "c", text: "Go away", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Which word spreads kindness?",
      options: [
        { id: "a", text: "Kind", isCorrect: true },
        { id: "b", text: "Mean", isCorrect: false },
        { id: "c", text: "Rude", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    const question = questions[currentQuestion];
    const option = question.options.find((opt) => opt.id === optionId);

    const newAnswers = [
      ...answers,
      { questionId: question.id, answer: optionId, isCorrect: option.isCorrect }
    ];
    setAnswers(newAnswers);

    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, option.isCorrect ? 800 : 600);
    } else {
      const correctCount = newAnswers.filter((a) => a.isCorrect).length;
      const percentage = (correctCount / questions.length) * 100;
      if (percentage >= 70) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/reflex-respect1");
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <GameShell
      title="Kind vs Mean Words Quiz"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && percentage >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && percentage >= 70}
      
      gameId="dcos-kids-81"
      gameType="educational"
      totalLevels={100}
      currentLevel={81}
      showConfetti={showResult && percentage >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 font-semibold text-center">
                {questions[currentQuestion].text}
              </p>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102"
                  >
                    <div className="text-white font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {percentage >= 70 ? "🌈 Kindness Champion!" : "💪 Keep Spreading Kindness!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {correctCount} out of {questions.length} correct ({percentage}%)
            </p>
            <div className="bg-pink-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Kind words make everyone feel happier. Always choose positive, friendly words!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {percentage >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            {percentage < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default KindVsMeanQuiz;
