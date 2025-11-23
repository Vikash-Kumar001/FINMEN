import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OTPReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      emoji: "📩",
      message: 'You get a message: "Your bank OTP is 456789. Please share to confirm." What do you do?',
      choices: [
        { id: 1, text: "Share OTP immediately", emoji: "📤", isCorrect: false },
        { id: 2, text: "Never share it", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ask a friend what to do", emoji: "🤔", isCorrect: false },
      ],
    },
    {
      id: 2,
      emoji: "💬",
      message: "A delivery person asks for your OTP on call. What’s the right action?",
      choices: [
        { id: 1, text: "Tell the OTP", emoji: "☎️", isCorrect: false },
        { id: 2, text: "Say no and report the call", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Ignore it and hang up", emoji: "😶", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "📱",
      message: "You receive an email offering a gift card. It asks for your OTP. What should you do?",
      choices: [
        { id: 1, text: "Enter the OTP", emoji: "🎁", isCorrect: false },
        { id: 2, text: "Ignore and delete the email", emoji: "🗑️", isCorrect: true },
        { id: 3, text: "Reply with your phone number", emoji: "📞", isCorrect: false },
      ],
    },
    {
      id: 4,
      emoji: "💻",
      message: "A pop-up says: 'Login failed! Enter OTP to secure your account.' What do you do?",
      choices: [
        { id: 1, text: "Enter OTP on pop-up", emoji: "⚠️", isCorrect: false },
        { id: 2, text: "Close it and check the official site", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Take a screenshot and share", emoji: "📸", isCorrect: false },
      ],
    },
    {
      id: 5,
      emoji: "🔢",
      message: "Someone says they sent you money by mistake and need your OTP to reverse it. You should…",
      choices: [
        { id: 1, text: "Give them the OTP", emoji: "😅", isCorrect: false },
        { id: 2, text: "Refuse and block the number", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Ask your friends about it", emoji: "💬", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      handleNext(); // move to next game after last question
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/puzzle-of-traps");
  };

  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="OTP Reflex"
      subtitle="Protect Your Secret Code"
      onNext={handleNext}
      nextEnabled={showFeedback && currentIndex === questions.length - 1}
      showGameOver={showFeedback && currentIndex === questions.length - 1}
      score={coins}
      gameId="dcos-kids-45"
      gameType="educational"
      totalLevels={100}
      currentLevel={45}
      showConfetti={showFeedback && currentIndex === questions.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQuestion.emoji}</div>
            <p className="text-white text-lg mb-6 text-center font-semibold">{currentQuestion.message}</p>

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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "💡 Smart Move!" : "⚠️ Not Safe!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great job! OTPs are secret and meant only for you. Never share them — not even with
                    someone pretending to be from the bank or company.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">+3 Coins! 🪙</p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oh no! Never share OTPs with anyone. Scammers use them to steal money or accounts.
                    Always report such messages to an adult.
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

            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentIndex === questions.length - 1 ? "Finish Game" : "Next Question ➜"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OTPReflex;
