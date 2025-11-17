import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HumanVsAIQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Is Google Translate powered by AI?",
      emoji: "🌐",
      choices: [
        { id: 1, text: "Yes", emoji: "✓", isCorrect: true },
        { id: 2, text: "No", emoji: "✗", isCorrect: false },
      ],
      explanation:
        "Yes! Google Translate uses AI (Neural Machine Translation) to understand and translate languages accurately.",
    },
    {
      text: "Can AI recognize faces in photos?",
      emoji: "📸",
      choices: [
        { id: 1, text: "Yes", emoji: "🙂", isCorrect: true },
        { id: 2, text: "No", emoji: "🙃", isCorrect: false },
      ],
      explanation:
        "Correct! AI uses facial recognition algorithms to detect and identify people in photos and videos.",
    },
    {
      text: "Which one is an example of AI?",
      emoji: "💡",
      choices: [
        { id: 1, text: "A calculator", emoji: "🧮", isCorrect: false },
        { id: 2, text: "ChatGPT", emoji: "🤖", isCorrect: true },
      ],
      explanation:
        "Right! ChatGPT is an AI because it can understand and generate human-like language responses.",
    },
    {
      text: "Can AI drive cars automatically?",
      emoji: "🚗",
      choices: [
        { id: 1, text: "Yes", emoji: "🟢", isCorrect: true },
        { id: 2, text: "No", emoji: "🔴", isCorrect: false },
      ],
      explanation:
        "Yes! Self-driving cars use AI to analyze surroundings, detect objects, and make driving decisions.",
    },
    {
      text: "Which of these is NOT an AI system?",
      emoji: "❓",
      choices: [
        { id: 1, text: "Siri", emoji: "🎤", isCorrect: false },
        { id: 2, text: "Paper Notebook", emoji: "📓", isCorrect: true },
      ],
      explanation:
        "Correct! A paper notebook doesn’t use AI — it’s just for writing manually.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins(totalCoins + 5);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/teen/predict-next-word");
    }
  };

  return (
    <GameShell
      title="Human vs AI Quiz"
      subtitle="Recognizing AI Systems"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && currentQuestionIndex === questions.length - 1}
      score={totalCoins}
      gameId="ai-teen-4"
      gameType="ai"
      totalLevels={100}
      currentLevel={4}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
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
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{coins > 0 ? "🌟" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "Correct!" : "Not Quite..."}
            </h2>

            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.explanation}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.explanation}</p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}

            {coins > 0 && (
              <button
                onClick={handleNextQuestion}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question →" : "Finish Quiz 🎯"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HumanVsAIQuiz;
