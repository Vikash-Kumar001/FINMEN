import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIBankingQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "Is ATM fraud detection an example of AI?",
      emoji: "🏦",
      choices: [
        { id: 1, text: "Yes, it uses AI 🤖", emoji: "✅", isCorrect: true },
        { id: 2, text: "No, it's not AI ❌", emoji: "❌", isCorrect: false },
      ],
      correct: "Yes! AI detects fraud patterns and protects user accounts.",
      wrong: "Incorrect! AI identifies suspicious transactions and prevents fraud.",
    },
    {
      text: "What helps banks identify unusual spending activity?",
      emoji: "💳",
      choices: [
        { id: 1, text: "AI monitoring system 👁️", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Manual checking 🧾", emoji: "📋", isCorrect: false },
      ],
      correct: "Correct! AI tracks spending patterns to flag unusual behavior.",
      wrong: "Nope! AI, not humans, monitors for unusual transactions in real time.",
    },
    {
      text: "How do chatbots help in banking?",
      emoji: "💬",
      choices: [
        { id: 1, text: "By answering customer questions 24/7 🤖", emoji: "💡", isCorrect: true },
        { id: 2, text: "By taking deposits 💰", emoji: "🏧", isCorrect: false },
      ],
      correct: "Exactly! AI chatbots assist customers anytime, anywhere.",
      wrong: "Not quite! AI chatbots handle conversations, not money directly.",
    },
    {
      text: "What does AI analyze to approve a loan faster?",
      emoji: "📊",
      choices: [
        { id: 1, text: "Credit data and history 📈", emoji: "📉", isCorrect: true },
        { id: 2, text: "Random numbers 🎲", emoji: "🎲", isCorrect: false },
      ],
      correct: "Right! AI reviews credit data to speed up loan decisions.",
      wrong: "Nope! AI studies credit history—not random data—to decide loans.",
    },
    {
      text: "How do banks use AI for customer safety?",
      emoji: "🔐",
      choices: [
        { id: 1, text: "By detecting fraud and securing transactions 🧠", emoji: "🛡️", isCorrect: true },
        { id: 2, text: "By guessing passwords 🔑", emoji: "❌", isCorrect: false },
      ],
      correct: "Perfect! AI ensures secure and safe digital banking.",
      wrong: "Wrong! AI defends accounts—it never guesses passwords.",
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      navigate("/student/ai-for-all/kids/smart-city-traffic-game"); // Next game route
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
  };

  return (
    <GameShell
      title="AI in Banking Quiz"
      subtitle={`Smart Finance Tech • Question ${currentQuestion + 1}/5`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && coins > 0 && currentQuestion === questions.length - 1}
      score={totalCoins}
      gameId="ai-kids-45"
      gameType="ai"
      totalLevels={100}
      currentLevel={45}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {current.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {current.choices.map((choice) => (
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
                  <div className="text-white font-bold text-2xl text-center">
                    {choice.text}
                  </div>
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
              {selectedChoiceData?.isCorrect ? current.emoji : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🎉 Correct!" : "Think Again..."}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">
                {selectedChoiceData?.isCorrect ? current.correct : current.wrong}
              </p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  +5 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === questions.length - 1
                    ? "Finish Quiz →"
                    : "Next Question →"}
                </button>
              </>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIBankingQuiz;
