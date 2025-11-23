import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JusticeQuiz = () => {
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
      id: 1,
      text: "Which is just? Punishing the guilty or punishing the innocent?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Punish the innocent", emoji: "❌", isCorrect: false },
        { id: 2, text: "Punish the guilty", emoji: "✅", isCorrect: true },
      ],
    },
    {
      id: 2,
      text: "If a friend broke the rules, should they face consequences?",
      emoji: "👥",
      choices: [
        { id: 1, text: "No, protect your friend", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Yes, they should be held accountable", emoji: "⚖️", isCorrect: true },
      ],
    },
    {
      id: 3,
      text: "Is it fair to blame someone else for your mistake?",
      emoji: "😶",
      choices: [
        { id: 1, text: "Yes, if it avoids trouble", emoji: "🤷", isCorrect: false },
        { id: 2, text: "No, honesty and justice must prevail", emoji: "💎", isCorrect: true },
      ],
    },
    {
      id: 4,
      text: "If rules are broken accidentally, should punishment be different?",
      emoji: "📝",
      choices: [
        { id: 1, text: "Yes, consider intent and fairness", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "No, punishment should be the same always", emoji: "❌", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "Is it just to reward good actions only?",
      emoji: "🏆",
      choices: [
        { id: 1, text: "Yes, fair actions deserve recognition", emoji: "✅", isCorrect: true },
        { id: 2, text: "No, everyone should be rewarded equally", emoji: "❌", isCorrect: false },
      ],
    },
  ];

  const currentQuestionData = questions[currentQuestion];
  const selectedChoiceData = currentQuestionData?.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;

    const choice = currentQuestionData.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(prev => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // End of quiz → move to next game
      navigate("/student/moral-values/teen/reflex-justice-symbols");
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    resetFeedback();
  };

  return (
    <GameShell
      title="Justice Quiz"
      subtitle="Understanding Fairness"
      score={coins}
      gameId="moral-teen-42"
      gameType="moral"
      totalLevels={100}
      currentLevel={42}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* Progress indicator */}
        <p className="text-center text-white/70 font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </p>

        {!showFeedback ? (
          // ---- QUESTION SCREEN ----
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestionData.choices.map(choice => (
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
              Submit Answer
            </button>
          </div>
        ) : (
          // ---- FEEDBACK SCREEN ----
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Think Deeper..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Great! You made a fair choice that upholds justice and integrity.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  +3 Coins 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-xl hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question ➡️" : "Finish Quiz 🎯"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Justice means being fair and honest — try again to make the right choice!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition"
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

export default JusticeQuiz;
