import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlayVsStudyPuzzle = () => {
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
      text: "Match the correct pair: Study = ?",
      options: [
        { id: "homework", text: "Homework", isCorrect: true },
        { id: "ball", text: "Ball", isCorrect: false },
        { id: "bed", text: "Bed", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "Match the correct pair: Play = ?",
      options: [
        { id: "books", text: "Books", isCorrect: false },
        { id: "playground", text: "Playground", isCorrect: true },
        { id: "table", text: "Study Table", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "Match the correct pair: Sleep = ?",
      options: [
        { id: "bed", text: "Bed", isCorrect: true },
        { id: "school", text: "School", isCorrect: false },
        { id: "garden", text: "Garden", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "Match the correct pair: Eat = ?",
      options: [
        { id: "plate", text: "Plate", isCorrect: true },
        { id: "pencil", text: "Pencil", isCorrect: false },
        { id: "toy", text: "Toy", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "Match the correct pair: Read = ?",
      options: [
        { id: "book", text: "Book", isCorrect: true },
        { id: "bat", text: "Bat", isCorrect: false },
        { id: "ball", text: "Ball", isCorrect: false },
      ],
    },
  ];

  const handleAnswer = (optionId) => {
    const question = questions[currentQuestion];
    const option = question.options.find((opt) => opt.id === optionId);

    const newAnswers = [
      ...answers,
      {
        questionId: question.id,
        answer: optionId,
        isCorrect: option.isCorrect,
      },
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
        setCoins(5);
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
    navigate("/student/dcos/kids/family-rules-story1");
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <GameShell
      title="Play vs Study Puzzle"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && percentage >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && percentage >= 70}
      
      gameId="dcos-kids-22"
      gameType="puzzle"
      totalLevels={100}
      currentLevel={22}
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
              {percentage >= 70 ? "🧩 Smart Matcher!" : "🔁 Try Matching Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {correctCount} out of {questions.length} correctly ({percentage}%)
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Each activity has its right place — Study = Homework, Play = Playground, Sleep = Bed.  
                Balance both for a happy mind!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {percentage >= 70 ? "You earned 5 Coins! 🪙" : "Get 70% or higher to earn coins!"}
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

export default PlayVsStudyPuzzle;
