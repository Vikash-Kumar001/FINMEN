import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HomeworkQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 Questions Data
  const questions = [
    {
      text: "You tell your teacher you did your homework, but you didn't. Is this honesty?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Yes - it's just a small lie", emoji: "😊", isCorrect: false },
        { id: 2, text: "No - lying is never okay", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "It's okay sometimes", emoji: "🤔", isCorrect: false },
      ],
      explanation:
        "Perfect! Lying is never okay, even about small things like homework. Honesty means telling the truth always.",
    },
    {
      text: "Your friend forgets their lunch. What’s the honest thing to do?",
      emoji: "🥪",
      choices: [
        { id: 1, text: "Pretend you didn’t see", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Share your food honestly", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Laugh about it", emoji: "😂", isCorrect: false },
      ],
      explanation: "Sharing is caring! Honesty and kindness go hand-in-hand when helping others.",
    },
    {
      text: "You find a lost pencil on the floor. What should you do?",
      emoji: "✏️",
      choices: [
        { id: 1, text: "Keep it for yourself", emoji: "😅", isCorrect: false },
        { id: 2, text: "Give it to the teacher", emoji: "👩‍🏫", isCorrect: true },
        { id: 3, text: "Hide it somewhere", emoji: "🙃", isCorrect: false },
      ],
      explanation:
        "Honesty means returning lost things. You did the right thing by giving it to the teacher!",
    },
    {
      text: "You break your toy at home. What’s the honest action?",
      emoji: "🧸",
      choices: [
        { id: 1, text: "Hide it so no one knows", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Tell your parents the truth", emoji: "👨‍👩‍👧", isCorrect: true },
        { id: 3, text: "Blame your sibling", emoji: "😬", isCorrect: false },
      ],
      explanation:
        "Telling the truth helps others trust you more. Admitting mistakes shows courage!",
    },
    {
      text: "Your teacher praises you for someone else’s work. What should you do?",
      emoji: "🏆",
      choices: [
        { id: 1, text: "Say nothing and take the credit", emoji: "😎", isCorrect: false },
        { id: 2, text: "Tell the truth that it wasn’t yours", emoji: "💬", isCorrect: true },
        { id: 3, text: "Thank them quietly", emoji: "🙊", isCorrect: false },
      ],
      explanation:
        "Honesty means giving credit where it’s due. Speaking up shows real integrity!",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setTotalCoins((prev) => prev + 3);
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
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      setShowFeedback("gameOver");
    }
  };

  const handleFinish = () => {
    navigate("/student/moral-values/kids/truth-reflex");
  };

  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Homework Quiz"
      subtitle="Understanding Honesty"
      onNext={handleFinish}
      nextEnabled={showFeedback === "gameOver"}
      showGameOver={showFeedback === "gameOver"}
      score={totalCoins}
      gameId="moral-kids-2"
      gameType="educational"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showFeedback === "gameOver"}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {showFeedback === "gameOver" ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Amazing Job!</h2>
            <p className="text-white/80 mb-6">
              You completed all 5 honesty posters. Keep being truthful and kind always!
            </p>
            <p className="text-yellow-400 text-2xl font-bold">Total Coins Earned: {totalCoins} 🪙</p>
            <button
              onClick={handleFinish}
              className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        ) : !showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
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
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">{currentQuestion.explanation}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 3 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Qouestion →
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! Try again — honesty is always the best policy!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HomeworkQuiz;
