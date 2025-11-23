import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizRightChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "You want to borrow a friend's toy. What should you do?",
      emoji: "🧸",
      choices: [
        { id: 1, text: "Take it without asking", emoji: "😏", isCorrect: false },
        { id: 2, text: "Ask permission first", emoji: "🙋", isCorrect: true }
      ]
    },
    {
      text: "You need a book from the library. What's right?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Take it without checking", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Ask librarian for permission", emoji: "🫱", isCorrect: true }
      ]
    },
    {
      text: "You want to eat a cookie from the jar. What is right?",
      emoji: "🍪",
      choices: [
        { id: 1, text: "Take it secretly", emoji: "😋", isCorrect: false },
        { id: 2, text: "Ask your parents first", emoji: "🫵", isCorrect: true }
      ]
    },
    {
      text: "You want to use your friend's coloring set. Correct choice?",
      emoji: "🖍️",
      choices: [
        { id: 1, text: "Use it without asking", emoji: "😎", isCorrect: false },
        { id: 2, text: "Ask permission first", emoji: "🙌", isCorrect: true }
      ]
    },
    {
      text: "You found a pencil on the floor. What should you do?",
      emoji: "✏️",
      choices: [
        { id: 1, text: "Keep it without asking", emoji: "🤭", isCorrect: false },
        { id: 2, text: "Return it or ask if someone lost it", emoji: "🫂", isCorrect: true }
      ]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(prev => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/reflex-choices");
    }
  };

  const selectedChoiceData = currentQuestion.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Quiz on Right Choice"
      subtitle="Choosing the Right Action"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={false}
      score={coins}
      gameId="moral-kids-92"
      gameType="educational"
      totalLevels={100}
      currentLevel={92}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          // 🔹 Question Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          // 🔹 Feedback Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Perfect! Asking permission is always the right choice.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  You earned 3 Coins! 🪙
                </p>

                {/* ✅ NEXT BUTTON ADDED HERE */}
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Taking without permission is wrong. Always ask first.
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

export default QuizRightChoice;
