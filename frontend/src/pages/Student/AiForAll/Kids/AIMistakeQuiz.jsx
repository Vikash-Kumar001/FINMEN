import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIMistakeQuiz = () => {
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
      id: 1,
      text: "Can AI always be right?",
      emoji: "🤖",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 2, text: "No", emoji: "❌", isCorrect: true },
      ],
      correctFeedback:
        "Right! AI is not always correct. It can make mistakes, so humans must check its output.",
      incorrectFeedback:
        "AI is powerful but not perfect. Always verify AI's answers—it can make mistakes!",
    },
    {
      id: 2,
      text: "Why can AI make mistakes?",
      emoji: "💭",
      choices: [
        { id: 1, text: "Because data can be biased or incomplete", emoji: "📊", isCorrect: true },
        { id: 2, text: "Because AI is lazy", emoji: "😴", isCorrect: false },
      ],
      correctFeedback:
        "Exactly! If the data AI learns from is biased or incomplete, its answers can be wrong.",
      incorrectFeedback:
        "AI doesn’t have feelings like laziness. Mistakes happen due to poor or biased data.",
    },
    {
      id: 3,
      text: "What should we do when AI gives a wrong answer?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Believe it anyway", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Check and correct it", emoji: "🔍", isCorrect: true },
      ],
      correctFeedback:
        "Perfect! Always double-check AI answers and correct them when needed.",
      incorrectFeedback:
        "We shouldn’t blindly believe AI. Always verify and fix its mistakes.",
    },
    {
      id: 4,
      text: "Can AI understand emotions like humans?",
      emoji: "💬",
      choices: [
        { id: 1, text: "No, it only recognizes patterns", emoji: "🧩", isCorrect: true },
        { id: 2, text: "Yes, it has real feelings", emoji: "❤️", isCorrect: false },
      ],
      correctFeedback:
        "Correct! AI doesn’t truly feel emotions—it only detects patterns like facial expressions or tone.",
      incorrectFeedback:
        "AI doesn’t have real feelings. It can only recognize emotional patterns, not feel them.",
    },
    {
      id: 5,
      text: "How can we make AI better?",
      emoji: "🚀",
      choices: [
        { id: 1, text: "Give it more diverse and fair data", emoji: "🌍", isCorrect: true },
        { id: 2, text: "Hide its mistakes", emoji: "🙈", isCorrect: false },
      ],
      correctFeedback:
        "Awesome! AI improves when trained on diverse, fair, and high-quality data.",
      incorrectFeedback:
        "Hiding mistakes won’t help. AI learns better when trained with more fair, diverse data.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (!choice) return;

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/train-robot-shapes"); // final next route
    }
  };

  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="AI Mistake Quiz"
      subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestionIndex === questions.length - 1}
      score={totalCoins}
      gameId="ai-kids-69"
      gameType="ai"
      totalLevels={100}
      currentLevel={69}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
                  <div className="text-white font-bold text-2xl text-center">{choice.text}</div>
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
            <div className="text-8xl mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "💡" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Think Again..."}
            </h2>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.correctFeedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙 (Total: {totalCoins})
                </p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">{currentQuestion.incorrectFeedback}</p>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIMistakeQuiz;
