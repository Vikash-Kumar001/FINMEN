import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BiasInDataQuiz = () => {
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
  const [totalEarned, setTotalEarned] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "If AI is only trained on city photos, will it work well in villages?",
      emoji: "🏙️🌾",
      choices: [
        { id: 1, text: "Yes", emoji: "👍", isCorrect: false },
        { id: 2, text: "No", emoji: "👎", isCorrect: true },
      ],
      explanation: "Correct! 🧠 AI needs data from both cities and villages to work fairly everywhere.",
    },
    {
      text: "If a voice AI is trained only on male voices, can it understand female voices well?",
      emoji: "🎙️👩‍🦰",
      choices: [
        { id: 1, text: "Yes", emoji: "✔️", isCorrect: false },
        { id: 2, text: "No", emoji: "❌", isCorrect: true },
      ],
      explanation: "Right! 🗣️ AI becomes biased if it’s not trained on all types of voices.",
    },
    {
      text: "An AI trained mostly on English text may struggle with Hindi. True or False?",
      emoji: "🇬🇧🇮🇳",
      choices: [
        { id: 1, text: "True", emoji: "✅", isCorrect: true },
        { id: 2, text: "False", emoji: "❌", isCorrect: false },
      ],
      explanation: "Exactly! 📚 Training language matters for accurate understanding.",
    },
    {
      text: "If an AI sees more light-skinned faces, will it perform equally on dark-skinned faces?",
      emoji: "👩🏽‍🦱👨🏻‍🦰",
      choices: [
        { id: 1, text: "Yes", emoji: "👍", isCorrect: false },
        { id: 2, text: "No", emoji: "👎", isCorrect: true },
      ],
      explanation: "Correct! 🎯 Lack of diversity in training data can cause unfairness.",
    },
    {
      text: "How can we make AI fairer?",
      emoji: "⚖️🤖",
      choices: [
        { id: 1, text: "Use diverse data", emoji: "🌍", isCorrect: true },
        { id: 2, text: "Use only rich-country data", emoji: "💰", isCorrect: false },
      ],
      explanation: "Perfect! 💡 Diversity in training data helps reduce bias and improve fairness.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);
    const isCorrect = choice.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalEarned(prev => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions complete
      showCorrectAnswerFeedback(25, true);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/robot-confusion-storyy"); // Next game path
  };

  return (
    <GameShell
      title="Bias in Data Quiz 🤖⚖️"
      subtitle="Understanding fairness in AI"
      onNext={handleNext}
      nextEnabled={currentQuestionIndex === questions.length - 1 && showFeedback}
      showGameOver={currentQuestionIndex === questions.length - 1 && showFeedback}
      score={totalEarned}
      gameId="ai-teen-62"
      gameType="ai"
      totalLevels={20}
      currentLevel={62}
      showConfetti={currentQuestionIndex === questions.length - 1 && showFeedback}
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
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/10 border-white/20 hover:bg-white/20"
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{coins > 0 ? "🌟" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "Correct!" : "Not Quite..."}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                coins > 0 ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{currentQuestion.explanation}</p>
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question ➡️
              </button>
            ) : (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You completed all questions! 🎉 Total Earned: {totalEarned} Coins 🪙
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BiasInDataQuiz;
