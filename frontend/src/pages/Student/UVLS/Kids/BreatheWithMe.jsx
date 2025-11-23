import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BreatheWithMe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completions, setCompletions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false); // State for breathing exercise
  const [breathPhase, setBreathPhase] = useState("ready"); // ready, inhale, hold, exhale
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      instruction: "Breathe in for 4, hold 4, out 4."
    },
    {
      id: 2,
      instruction: "Inhale slowly, exhale longer."
    },
    {
      id: 3,
      instruction: "Belly breathe like balloon."
    },
    {
      id: 4,
      instruction: "Count breaths to 5."
    },
    {
      id: 5,
      instruction: "Imagine calm place while breathing."
    }
  ];

  // Function to start the breathing exercise
  const startBreathing = () => {
    setIsBreathing(true);
    setBreathPhase("inhale");
    
    // Inhale phase (4 seconds)
    setTimeout(() => {
      setBreathPhase("hold");
      // Hold phase (4 seconds)
      setTimeout(() => {
        setBreathPhase("exhale");
        // Exhale phase (4 seconds)
        setTimeout(() => {
          setBreathPhase("ready");
          setIsBreathing(false);
        }, 4000);
      }, 4000);
    }, 4000);
  };

  const handleComplete = () => {
    const newCompletions = [...completions, true];
    setCompletions(newCompletions);

    showCorrectAnswerFeedback(1, true);

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, 800);
    } else {
      const completed = newCompletions.length;
      setFinalScore(completed);
      if (completed >= 3) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setCompletions([]);
    setCoins(0);
    setFinalScore(0);
    setIsBreathing(false);
    setBreathPhase("ready");
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  // Get animation class based on breath phase
  const getBreathAnimationClass = () => {
    switch (breathPhase) {
      case "inhale":
        return "bg-gradient-to-r from-blue-400 to-green-400 scale-110";
      case "hold":
        return "bg-gradient-to-r from-green-400 to-yellow-400 scale-110";
      case "exhale":
        return "bg-gradient-to-r from-yellow-400 to-blue-400 scale-90";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-500";
    }
  };

  // Get instruction text based on breath phase
  const getBreathInstruction = () => {
    switch (breathPhase) {
      case "inhale":
        return "Breathe In... 🌬️";
      case "hold":
        return "Hold... ⏸️";
      case "exhale":
        return "Breathe Out... 💨";
      default:
        return "Ready to breathe?";
    }
  };

  return (
    <GameShell
      title="Breathe with Me"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-42"
      gameType="uvls"
      totalLevels={50}
      currentLevel={42}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">{getCurrentLevel().instruction}</p>
              
              {/* Interactive breath pacer */}
              <div className={`rounded-full w-48 h-48 mx-auto flex items-center justify-center transition-all duration-1000 ${getBreathAnimationClass()}`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {breathPhase === "inhale" && "🌬️"}
                    {breathPhase === "hold" && "⏸️"}
                    {breathPhase === "exhale" && "💨"}
                    {breathPhase === "ready" && "🧘"}
                  </div>
                  <div className="text-white font-bold text-lg">
                    {getBreathInstruction()}
                  </div>
                </div>
              </div>
              
              {/* Control button */}
              {!isBreathing ? (
                <button 
                  onClick={startBreathing} 
                  className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition mx-auto block"
                >
                  {breathPhase === "ready" ? "Start Breathing" : "Restart Cycle"}
                </button>
              ) : (
                <div className="mt-6 text-center text-white/80">
                  Follow the breathing cycle...
                </div>
              )}
              
              {/* Complete button */}
              <button 
                onClick={handleComplete} 
                className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition mx-auto block"
                disabled={isBreathing}
              >
                Completed Cycle
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Breath Master!" : "💪 Breathe More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed {finalScore} cycles!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 3 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BreatheWithMe;