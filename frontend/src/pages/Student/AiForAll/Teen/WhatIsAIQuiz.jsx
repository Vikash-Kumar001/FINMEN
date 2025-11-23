import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WhatIsAIQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 Questions
  const questions = [
    {
      id: 1,
      text: "What does AI stand for?",
      emoji: "🤖",
      choices: [
        { id: 1, text: "Artificial Icecream", emoji: "🍦", isCorrect: false },
        { id: 2, text: "Artificial Intelligence", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Alien Idea", emoji: "👽", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "Which of these is an example of AI?",
      emoji: "📱",
      choices: [
        { id: 1, text: "Siri or Alexa", emoji: "🎙️", isCorrect: true },
        { id: 2, text: "A regular calculator", emoji: "🧮", isCorrect: false },
        { id: 3, text: "A simple lamp", emoji: "💡", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "What helps AI learn and make decisions?",
      emoji: "📊",
      choices: [
        { id: 1, text: "Magic", emoji: "✨", isCorrect: false },
        { id: 2, text: "Data", emoji: "💾", isCorrect: true },
        { id: 3, text: "Luck", emoji: "🍀", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "Which skill is most similar to what AI does?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Learning from experience", emoji: "📘", isCorrect: true },
        { id: 2, text: "Sleeping", emoji: "😴", isCorrect: false },
        { id: 3, text: "Cooking", emoji: "🍳", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "Where do we use AI in daily life?",
      emoji: "🏠",
      choices: [
        { id: 1, text: "Voice assistants like Alexa", emoji: "🎧", isCorrect: true },
        { id: 2, text: "Shoes and socks", emoji: "👟", isCorrect: false },
        { id: 3, text: "Plain notebooks", emoji: "📓", isCorrect: false },
      ],
    },
  ];

  // ✅ States
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find((c) => c.id === selectedChoice);

  // ✅ Handle Choice Selection
  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  // ✅ Confirm Answer
  const handleConfirm = () => {
    const choice = question.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      setCoins((prev) => prev + 5);
      setCorrectAnswers((prev) => prev + 1);
      showCorrectAnswerFeedback(5, true);
    }
    setShowFeedback(true);
  };

  // ✅ Next Question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    }
  };

  // ✅ Restart Quiz
  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCorrectAnswers(0);
    resetFeedback();
  };

  // ✅ Move to Next Game
  const handleNextGame = () => {
    navigate("/student/ai-for-all/teen/pattern-prediction-puzzle");
  };

  // ✅ All done?
  const isQuizCompleted = currentQuestion === questions.length - 1 && showFeedback;

  return (
    <GameShell
      title="What is AI? Quiz 🤖"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNextGame}
      nextEnabled={isQuizCompleted}
      showGameOver={isQuizCompleted}
      score={coins}
      gameId="ai-teen-1"
      gameType="quiz"
      totalLevels={100}
      currentLevel={1}
      showConfetti={isQuizCompleted}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* ✅ Question UI */}
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map((choice) => (
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
                    <div className="text-5xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
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
          // ✅ Feedback Section
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">
              {selectedChoiceData?.isCorrect ? "🎉" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Not Quite..."}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">
                {selectedChoiceData?.isCorrect
                  ? "Yes! AI stands for Artificial Intelligence — technology that can learn and solve problems like humans!"
                  : "AI means Artificial Intelligence — it’s not magic or aliens, but machines learning from data!"}
              </p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold mb-4">
                +5 Coins! 🪙
              </p>
            ) : null}

            {/* ✅ Navigation Buttons */}
            {isQuizCompleted ? (
              <div className="space-y-4">
                <p className="text-white text-xl font-semibold">
                  You finished all 5 questions! 🎯
                </p>
                <p className="text-yellow-400 text-2xl font-bold">
                  Total Coins: {coins} 🪙
                </p>
                <button
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </div>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question ➡️
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WhatIsAIQuiz;
