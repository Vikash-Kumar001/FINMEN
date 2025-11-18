import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoodAIVSBadAIQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "AI used for helping hospitals = Good AI?",
      emoji: "🏥",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "AI for generating fake news = Good AI?",
      emoji: "📰",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 2, text: "No", emoji: "❌", isCorrect: true }
      ]
    },
    {
      text: "AI for autonomous car safety features = Good AI?",
      emoji: "🚗",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "AI for spam email filtering = Good AI?",
      emoji: "📧",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ]
    },
    {
      text: "AI used for stealing personal data = Good AI?",
      emoji: "💻",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 2, text: "No", emoji: "❌", isCorrect: true }
      ]
    }
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
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
      navigate("/student/ai-for-all/teen/privacy-protection-story"); // next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Good AI vs Bad AI Quiz"
      subtitle="Understanding Ethical AI"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-5"
      gameType="ai"
      totalLevels={20}
      currentLevel={5}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {current.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {current.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-3xl">{choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{selectedChoiceData?.isCorrect ? "🌟" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Not Quite..."}
            </h2>

            <div className={`rounded-lg p-4 mb-4 ${selectedChoiceData?.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p className="text-white text-center">
                {selectedChoiceData?.isCorrect
                  ? "Good choice! Ethical AI improves lives and supports society."
                  : "Incorrect. Some AI applications, like helping hospitals or safety, are considered Good AI, while harmful uses are Bad AI."}
              </p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                +5 Coins Earned! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}

            {selectedChoiceData?.isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default GoodAIVSBadAIQuiz;
