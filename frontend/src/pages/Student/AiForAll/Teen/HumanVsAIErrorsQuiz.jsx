import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HumanVsAIErrorsQuiz = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "Can humans also make mistakes like AI?",
      emoji: "🤔",
      choices: [
        { id: 1, text: "Yes ✅", emoji: "✔️", isCorrect: true },
        { id: 2, text: "No ❌", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "If a human types wrong data in a system, is it an error?",
      emoji: "💻",
      choices: [
        { id: 1, text: "Yes ✅", emoji: "✔️", isCorrect: true },
        { id: 2, text: "No ❌", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Humans misjudge or miscalculate sometimes. Does this resemble AI mistakes?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Yes ✅", emoji: "✔️", isCorrect: true },
        { id: 2, text: "No ❌", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Both humans and AI need correction to improve. True or False?",
      emoji: "⚡",
      choices: [
        { id: 1, text: "True ✅", emoji: "✔️", isCorrect: true },
        { id: 2, text: "False ❌", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "Understanding human errors helps us design better AI. Agree?",
      emoji: "🌟",
      choices: [
        { id: 1, text: "Yes ✅", emoji: "✔️", isCorrect: true },
        { id: 2, text: "No ❌", emoji: "❌", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/teen/balanced-data-story"); // update next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Human vs AI Errors Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId="ai-teen-human-vs-ai-errors"
      gameType="ai"
      totalLevels={20}
      currentLevel={57}
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
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-2xl font-semibold text-center">{current.text}</p>
            </div>

            <div className="space-y-4 mb-6">
              {current.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all flex items-center gap-4 ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-5xl">{choice.emoji}</div>
                  <div className="text-white font-semibold text-lg">{choice.text}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{selectedChoiceData?.isCorrect ? "✅" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Yes! Humans make mistakes too, just like AI. Understanding errors helps improve learning. 🌟
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">+5 Coins Earned! 🪙</p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➡️
                </button>
              </>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HumanVsAIErrorsQuiz;
