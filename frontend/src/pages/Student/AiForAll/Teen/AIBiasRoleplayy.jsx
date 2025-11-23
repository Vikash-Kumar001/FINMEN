import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIBiasRoleplayy = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Job Allocation Bias",
      emoji: "⚖️",
      situation: "AI is giving jobs only to boys. What should you do?",
      choices: [
        { id: 1, text: "Let it continue", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Correct it to include everyone", emoji: "✅", isCorrect: true }
      ]
    },
    {
      title: "School Admission Bias",
      emoji: "🏫",
      situation: "AI only selects students from one neighborhood. How do you fix it?",
      choices: [
        { id: 1, text: "Leave it as is", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Ensure all neighborhoods are considered", emoji: "✅", isCorrect: true }
      ]
    },
    {
      title: "Medical AI Bias",
      emoji: "🏥",
      situation: "AI recommends treatments mostly for men. What’s the fair approach?",
      choices: [
        { id: 1, text: "Accept the bias", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Include all genders equally", emoji: "✅", isCorrect: true }
      ]
    },
    {
      title: "Loan Approval Bias",
      emoji: "💰",
      situation: "AI denies loans to certain groups unfairly. How should you respond?",
      choices: [
        { id: 1, text: "Do nothing", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Adjust AI to be fair to everyone", emoji: "✅", isCorrect: true }
      ]
    },
    {
      title: "Hiring AI Bias",
      emoji: "👔",
      situation: "AI favors candidates of a certain age. What’s the correct action?",
      choices: [
        { id: 1, text: "Let AI continue", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Ensure age-neutral hiring", emoji: "✅", isCorrect: true }
      ]
    }
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(15, true);
      setCoins(coins + 15);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate("/student/ai-for-all/teen/fake-news-detector-game"); // next game
    }
  };

  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="AI Bias Roleplay"
      subtitle="Understanding Fairness"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion + 1 === questions.length && showFeedback}
      score={coins}
      gameId="ai-teen-78"
      gameType="ai"
      totalLevels={20}
      currentLevel={78}
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
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Correct!" : "⚠️ Try Again"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question ➡️
              </button>
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

export default AIBiasRoleplayy;
