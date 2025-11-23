import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BalancedDataStory = () => {
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
      title: "Daylight Only 📸",
      situation: "The AI was trained only on photos taken during the day. It fails to recognize objects at night. Why?",
      choices: [
        { id: 1, text: "Lack of balanced data 🌙", emoji: "🌙", isCorrect: true },
        { id: 2, text: "AI hates night 🌌", emoji: "❌", isCorrect: false },
        { id: 3, text: "Camera malfunction 📷", emoji: "❌", isCorrect: false }
      ]
    },
    {
      title: "Adding Night Photos 🌃",
      situation: "The teen adds night photos to the dataset. What happens?",
      choices: [
        { id: 1, text: "AI learns to recognize at night 🌙", emoji: "🌙", isCorrect: true },
        { id: 2, text: "AI ignores new photos 🚫", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI deletes old photos 🗑️", emoji: "❌", isCorrect: false }
      ]
    },
    {
      title: "Better Predictions ✅",
      situation: "After adding diverse lighting conditions, AI predictions improve. This shows?",
      choices: [
        { id: 1, text: "Balanced data improves AI 🌟", emoji: "🌟", isCorrect: true },
        { id: 2, text: "AI is always perfect 🤖", emoji: "❌", isCorrect: false },
        { id: 3, text: "Night photos confuse AI 🌙", emoji: "❌", isCorrect: false }
      ]
    },
    {
      title: "Avoiding Bias ⚖️",
      situation: "Training AI only in one condition can lead to bias. True or False?",
      choices: [
        { id: 1, text: "True ✅", emoji: "✔️", isCorrect: true },
        { id: 2, text: "False ❌", emoji: "❌", isCorrect: false }
      ]
    },
    {
      title: "Lesson Learned 📚",
      situation: "What is the key takeaway from this balanced data exercise?",
      choices: [
        { id: 1, text: "AI needs diverse data to perform well 🌈", emoji: "🌈", isCorrect: true },
        { id: 2, text: "AI performs best in daylight only 🌞", emoji: "❌", isCorrect: false },
        { id: 3, text: "Night photos are optional 🌙", emoji: "❌", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(prev => prev + 10);
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
      navigate("/student/ai-for-all/teen/training-hero-badgee"); // update next game path
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
      title="Balanced Data Story"
      subtitle={`Learning from Mistakes`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId="ai-teen-balanced-data-story"
      gameType="ai"
      totalLevels={20}
      currentLevel={74}
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
            <div className="text-9xl mb-4 text-center">{current.choices.find(c => c.isCorrect)?.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
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
                  <div className="text-4xl">{choice.emoji}</div>
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Correct!" : "❌ Try Again"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Correct! Balanced data ensures AI can perform well under all conditions, not just the training environment. 🌟
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +10 Coins Earned! 🪙
                </p>
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

export default BalancedDataStory;
