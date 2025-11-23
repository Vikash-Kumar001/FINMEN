import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WrongPredictionQuiz = () => {
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
  const [totalScore, setTotalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "The robot says Dog = Cat. Is it right?",
      emoji: "🐶🐱",
      choices: [
        { id: 1, text: "Yes", emoji: "✔️", isCorrect: false },
        { id: 2, text: "No", emoji: "❌", isCorrect: true }
      ],
      feedback: "AI sometimes makes wrong predictions! Dog ≠ Cat."
    },
    {
      text: "The robot calls a car a bicycle. Is that correct?",
      emoji: "🚗🚲",
      choices: [
        { id: 1, text: "No", emoji: "❌", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✔️", isCorrect: false }
      ],
      feedback: "Good catch! AI can confuse similar shapes like cars and bikes."
    },
    {
      text: "AI says ‘Birds can swim like fish.’ What do you think?",
      emoji: "🐦🐠",
      choices: [
        { id: 1, text: "That’s wrong", emoji: "🚫", isCorrect: true },
        { id: 2, text: "That’s right", emoji: "✅", isCorrect: false }
      ],
      feedback: "Correct! Not all birds swim; AI made an overgeneralization."
    },
    {
      text: "AI thinks all fruits are apples. Is that okay?",
      emoji: "🍎🍌🍊",
      choices: [
        { id: 1, text: "Yes", emoji: "✔️", isCorrect: false },
        { id: 2, text: "No", emoji: "❌", isCorrect: true }
      ],
      feedback: "Perfect! AI must learn differences — not all fruits are apples."
    },
    {
      text: "AI says 2 + 2 = 5. Should we trust it?",
      emoji: "🤖➕➕",
      choices: [
        { id: 1, text: "No way!", emoji: "❌", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✔️", isCorrect: false }
      ],
      feedback: "Exactly! AI can make simple logical errors too."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleChoice = (id) => {
    setSelectedChoice(id);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);
    const correct = choice?.isCorrect;

    if (correct) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalScore(prev => prev + 5);
    } else {
      setCoins(0);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setTotalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/garbage-in-garbage-out-story");
  };

  return (
    <GameShell
      title="Wrong Prediction Quiz"
      score={coins}
      subtitle="AI Can Make Mistakes!"
      onNext={handleNext}
      nextEnabled={isLastQuestion && showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={isLastQuestion && showFeedback}
      
      gameId="ai-kids-58"
      gameType="ai"
      totalLevels={100}
      currentLevel={58}
      showConfetti={isLastQuestion && showFeedback && totalScore >= 20}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto ">
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <p className="text-white text-2xl font-semibold text-center mb-6">
              Q{currentQuestionIndex + 1}. {currentQuestion.text}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-8 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-blue-500/20 border-blue-400 hover:bg-blue-500/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-2xl">{choice.text}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">{coins > 0 ? "✅" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins > 0 ? "Correct!" : "Oops!"}
            </h2>
            <p className="text-white mb-4">{currentQuestion.feedback}</p>

            {coins > 0 && (
              <p className="text-yellow-400 text-2xl font-bold mb-4">
                You earned 5 Coins! 🪙
              </p>
            )}

            {!isLastQuestion ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question →
              </button>
            ) : (
              <>
                <p className="text-white text-xl mb-4">
                  🎯 Final Score: {totalScore} Coins
                </p>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Continue
                </button>
                <button
                  onClick={handleTryAgain}
                  className="mt-3 w-full bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition"
                >
                  Play Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WrongPredictionQuiz;
