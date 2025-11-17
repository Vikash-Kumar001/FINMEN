import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FairnessQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Which is fair?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Sharing equal turns", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Skipping someone’s turn", emoji: "🙅‍♂️", isCorrect: false },
      ],
    },
    {
      text: "Two friends want the same toy. What’s the fair thing to do?",
      emoji: "🧸",
      choices: [
        { id: 1, text: "Take it without asking", emoji: "😠", isCorrect: false },
        { id: 2, text: "Take turns playing with it", emoji: "😊", isCorrect: true },
      ],
    },
    {
      text: "In a race, one person starts early. Is that fair?",
      emoji: "🏃‍♀️",
      choices: [
        { id: 1, text: "No, everyone should start together", emoji: "🛑", isCorrect: true },
        { id: 2, text: "Yes, it’s fine if they win", emoji: "😏", isCorrect: false },
      ],
    },
    {
      text: "You and your sibling get candies. What’s fair?",
      emoji: "🍬",
      choices: [
        { id: 1, text: "Share them equally", emoji: "🎁", isCorrect: true },
        { id: 2, text: "Keep all for yourself", emoji: "😈", isCorrect: false },
      ],
    },
    {
      text: "Your friend forgot their lunch. What’s fair?",
      emoji: "🍱",
      choices: [
        { id: 1, text: "Share your lunch", emoji: "❤️", isCorrect: true },
        { id: 2, text: "Ignore them", emoji: "🙄", isCorrect: false },
      ],
    },
  ];

  const currentQ = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQ.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // End of quiz
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/reflex-fair-play");
  };

  const selectedChoiceData = currentQ.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Fairness Quiz"
      subtitle="Learning to Be Fair"
      onNext={handleNext}
      nextEnabled={showFeedback && currentQuestion === questions.length - 1}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="moral-kids-42"
      gameType="educational"
      totalLevels={100}
      currentLevel={42}
      showConfetti={showFeedback && currentQuestion === questions.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQ.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQ.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQ.choices.map((choice) => (
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
        ) : currentQuestion < questions.length - 1 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Great! Fairness means treating everyone equally and giving everyone the same
                    chance. You earned 3 Coins! 🪙
                  </p>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question →
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That’s not fair. Fairness means everyone gets the same opportunity. Try again!
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Fairness Master!</h2>
            <p className="text-white text-lg mb-6">
              You completed all 5 fairness questions and proved you know how to treat everyone equally!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              Total Coins Earned: {coins} 🪙
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FairnessQuiz;
