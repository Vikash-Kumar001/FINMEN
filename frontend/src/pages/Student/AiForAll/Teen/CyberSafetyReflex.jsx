import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CyberSafetyReflex = () => {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const messages = [
    {
      id: 1,
      message: "Click the unknown link to win a phone!",
      correct: "Stay Safe",
      hint: "Never click suspicious links."
    },
    {
      id: 2,
      message: "A stranger sent you a file named virus.exe",
      correct: "Stay Safe",
      hint: "Avoid downloading unknown attachments."
    },
    {
      id: 3,
      message: "Your bank asks for OTP over email!",
      correct: "Stay Safe",
      hint: "Banks never ask for OTP online."
    },
    {
      id: 4,
      message: "Ad: You won $10,000! Click here!",
      correct: "Stay Safe",
      hint: "Scams often use such offers."
    },
    {
      id: 5,
      message: "Use strong passwords and keep them private.",
      correct: "Stay Safe",
      hint: "That’s a good cyber safety habit!"
    }
  ];

  const currentMessage = messages[currentRound];

  const handleChoice = (choice) => {
    setUserChoice(choice);
    const isCorrect = choice === currentMessage.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setTimeout(() => {
      if (currentRound < messages.length - 1) {
        setCurrentRound((prev) => prev + 1);
        setUserChoice(null);
      } else {
        if ((score + (isCorrect ? 1 : 0)) >= 4) {
          setCoins(5);
        }
        setScore((prev) => prev + (isCorrect ? 1 : 0));
        setShowResult(true);
      }
    }, 700);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentRound(0);
    setUserChoice(null);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/global-fairness-quiz");
  };

  return (
    <GameShell
      title="Cyber Safety Reflex"
      subtitle={`Round ${currentRound + 1} of ${messages.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-teen-12"
      gameType="ai"
      totalLevels={20}
      currentLevel={12}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              React Fast! Decide if it’s safe or risky! ⚡
            </h3>

            <div className="bg-red-500/20 rounded-xl p-6 mb-6">
              <p className="text-white text-2xl text-center font-semibold">
                {currentMessage.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("Click Link")}
                disabled={userChoice !== null}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                <div className="text-4xl mb-2">⚠️</div>
                <div className="text-white font-bold text-xl">Click Link</div>
              </button>

              <button
                onClick={() => handleChoice("Stay Safe")}
                disabled={userChoice !== null}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                <div className="text-4xl mb-2">🛡️</div>
                <div className="text-white font-bold text-xl">Stay Safe</div>
              </button>
            </div>

            {userChoice && (
              <p className="text-center text-white/80 mt-4 text-lg italic">
                {currentMessage.hint}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🛡️ Cyber Defender!" : "⚠️ Stay Alert!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You stayed safe in {score} out of {messages.length} situations!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Cyber safety means recognizing online threats like phishing,
                fake links, and scams — AI also helps detect such dangers online!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Avoid more risks to earn coins!"}
            </p>
            {score < 4 && (
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

export default CyberSafetyReflex;
