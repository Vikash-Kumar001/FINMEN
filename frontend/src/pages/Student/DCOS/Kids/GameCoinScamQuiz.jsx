import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GameCoinScamQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "An app says ‘Buy unlimited coins for ₹100.’ Should you trust it?",
      emoji: "💰",
      choices: [
        { id: 1, text: "Yes, it’s a great deal!", emoji: "😄", isCorrect: false },
        { id: 2, text: "No, it might be a scam.", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Only if it looks cool.", emoji: "😎", isCorrect: false }
      ],
      correctFeedback:
        "Right! Never pay money for fake offers. Scammers try to steal your money or info.",
      wrongFeedback:
        "That’s risky! Fake apps may scam you by showing fake coin offers.",
    },
    {
      text: "A pop-up says ‘You won 10,000 game coins! Click to claim.’ What should you do?",
      emoji: "🎁",
      choices: [
        { id: 1, text: "Click it fast!", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Ignore or close it.", emoji: "❌", isCorrect: true },
        { id: 3, text: "Share with friends first.", emoji: "👥", isCorrect: false }
      ],
      correctFeedback:
        "Good job! These pop-ups are scams. Don’t click links or share info.",
      wrongFeedback:
        "Oops! Pop-ups like that are usually fake. Close them safely.",
    },
    {
      text: "A website asks for your game password to get free coins. What do you do?",
      emoji: "🔑",
      choices: [
        { id: 1, text: "Give it, to get coins.", emoji: "💸", isCorrect: false },
        { id: 2, text: "Never share your password.", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ask a stranger online.", emoji: "🤔", isCorrect: false }
      ],
      correctFeedback:
        "Perfect! Passwords are private. Never share them with anyone.",
      wrongFeedback:
        "Be careful! Sharing passwords lets scammers steal your account.",
    },
    {
      text: "A real game store always uses secure payment methods. What should you look for?",
      emoji: "💳",
      choices: [
        { id: 1, text: "🔒 Lock symbol & HTTPS", emoji: "🔒", isCorrect: true },
        { id: 2, text: "Random links or pop-ups", emoji: "⚠️", isCorrect: false },
        { id: 3, text: "Free download buttons", emoji: "⬇️", isCorrect: false }
      ],
      correctFeedback:
        "Excellent! Always check for 🔒 HTTPS — it means the site is secure.",
      wrongFeedback:
        "Not quite! Look for the lock icon or ‘https’ in the address bar.",
    },
    {
      text: "If you think a coin offer is fake, what should you do?",
      emoji: "🕵️‍♀️",
      choices: [
        { id: 1, text: "Report it to an adult or teacher.", emoji: "📢", isCorrect: true },
        { id: 2, text: "Try it once anyway.", emoji: "😬", isCorrect: false },
        { id: 3, text: "Ignore and forget.", emoji: "🤷‍♂️", isCorrect: false }
      ],
      correctFeedback:
        "Smart choice! Always tell an adult or report suspicious offers.",
      wrongFeedback:
        "Almost! Reporting helps others stay safe too.",
    },
  ];

  const current = questions[currentQuestion];
  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      setScore(score + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setEarnedBadge(true);
      setShowFeedback(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/stranger-gift-story");
  };

  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Game Coin Scam Quiz"
      subtitle="Spot the Scam and Stay Safe!"
      onNext={handleNext}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={score}
      gameId="dcos-kids-43"
      gameType="quiz"
      totalLevels={100}
      currentLevel={43}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!earnedBadge && !showFeedback && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {current.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
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
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
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
        )}

        {showFeedback && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✅ Correct!" : "❌ Oops!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.isCorrect
                ? current.correctFeedback
                : current.wrongFeedback}
            </p>

            <div className="flex justify-center">
              <button
                onClick={
                  selectedChoiceData.isCorrect
                    ? handleNextQuestion
                    : handleTryAgain
                }
                className={`mt-4 w-full ${
                  selectedChoiceData.isCorrect
                    ? "bg-gradient-to-r from-green-500 to-blue-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                } text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition`}
              >
                {selectedChoiceData.isCorrect
                  ? "Next Question →"
                  : "Try Again"}
              </button>
            </div>
          </div>
        )}

        {earnedBadge && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-3">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Scam Shield Hero!
            </h2>
            <p className="text-white text-lg mb-4">
              You learned how to spot fake offers and protect your game account!
            </p>
            <p className="text-white font-semibold text-xl">
              +5 Coins Earned 💰
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GameCoinScamQuiz;
