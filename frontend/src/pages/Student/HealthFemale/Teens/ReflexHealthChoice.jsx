import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexHealthChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameState, setGameState] = useState("ready"); // ready, playing, completed
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userResponse, setUserResponse] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const gameRounds = [
    {
      id: 1,
      prompt: "Visit Doctor if Needed",
      correctAction: "hospital",
      emoji: "🏥",
      explanation: "Correct! Seeking medical help when needed is important for health."
    },
    {
      id: 2,
      prompt: "Ignore Pain",
      correctAction: "x",
      emoji: "❌",
      explanation: "This is incorrect. Ignoring severe pain can lead to serious health issues."
    },
    {
      id: 3,
      prompt: "Use Pain Relief Medication Appropriately",
      correctAction: "hospital",
      emoji: "💊",
      explanation: "Correct! Using appropriate medication as directed helps manage pain safely."
    },
    {
      id: 4,
      prompt: "Suffer in Silence",
      correctAction: "x",
      emoji: "❌",
      explanation: "This is not correct. Communicating about health concerns is important."
    },
    {
      id: 5,
      prompt: "Apply Heat for Cramps",
      correctAction: "hospital",
      emoji: "🔥",
      explanation: "Correct! Heat therapy is a safe and effective way to manage cramps."
    }
  ];

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (gameState === "playing" && timeLeft === 0) {
      // Time's up, show next prompt
      setShowPrompt(true);
      setTimeout(() => {
        if (currentRound < gameRounds.length - 1) {
          nextRound();
        } else {
          finishGame();
        }
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, currentRound]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(3);
    setShowPrompt(true);
  };

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
    setTimeLeft(3);
    setShowPrompt(false);
    setUserResponse(null);
    setFeedback(null);
  };

  const handleResponse = (action) => {
    if (userResponse) return; // Prevent multiple responses
    
    const isCorrect = action === gameRounds[currentRound].correctAction;
    setUserResponse(action);
    setFeedback({
      isCorrect,
      explanation: gameRounds[currentRound].explanation
    });
    
    if (isCorrect) {
      setScore(score + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next round after delay
    setTimeout(() => {
      if (currentRound < gameRounds.length - 1) {
        nextRound();
      } else {
        finishGame();
      }
    }, 2000);
  };

  const finishGame = () => {
    setGameState("completed");
    setGameFinished(true);
  };

  const handleNext = () => {
    navigate("/student/health-female/teens/repro-health-smart-teen-badge");
  };

  return (
    <GameShell
      title="Reflex Health Choice"
      subtitle={gameState === "playing" ? `Round ${currentRound + 1}/${gameRounds.length}` : "Test your health decision reflexes"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-39"
      gameType="health-female"
      totalLevels={40}
      currentLevel={39}
      showConfetti={gameFinished && score >= 3}
      maxScore={40} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">
              {gameState === "ready" ? "Get Ready!" : 
               gameState === "playing" ? `Round ${currentRound + 1}/${gameRounds.length}` : 
               "Game Completed"}
            </span>
            <span className="text-yellow-400 font-bold">Coins: {score}</span>
          </div>

          {gameState === "ready" && (
            <div className="text-center py-8">
              <div className="bg-white/20 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-2">Health Choice Reflex</h3>
                <p className="text-white/80 mb-6">
                  Tap 🏥 for healthy choices, ❌ for unhealthy ones. Respond quickly!
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {gameState === "playing" && (
            <div className="text-center py-6">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="font-bold text-white">Round: {currentRound + 1}/{gameRounds.length}</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <span className="text-2xl">⏱️</span>
                  <span className="font-bold text-white">{timeLeft}s</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="font-bold text-white">Score: {score}</span>
                </div>
              </div>

              {showPrompt && (
                <div className="bg-white/20 rounded-2xl p-8 max-w-2xl mx-auto mb-8 transition-all duration-300 animate-pulse">
                  <h3 className="text-2xl font-bold text-white mb-4">{gameRounds[currentRound].prompt}</h3>
                  <div className="text-6xl mb-4">{gameRounds[currentRound].emoji}</div>
                </div>
              )}

              <div className="flex justify-center space-x-8">
                <button
                  onClick={() => handleResponse("hospital")}
                  disabled={userResponse !== null}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 ${
                    userResponse === "hospital"
                      ? "bg-green-500 scale-110"
                      : userResponse === "x"
                      ? "bg-gray-500"
                      : "bg-green-500 hover:bg-green-600 hover:scale-105"
                  }`}
                >
                  <span className="text-4xl">🏥</span>
                </button>
                <button
                  onClick={() => handleResponse("x")}
                  disabled={userResponse !== null}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 ${
                    userResponse === "x"
                      ? "bg-red-500 scale-110"
                      : userResponse === "hospital"
                      ? "bg-gray-500"
                      : "bg-red-500 hover:bg-red-600 hover:scale-105"
                  }`}
                >
                  <span className="text-4xl">❌</span>
                </button>
              </div>

              {feedback && (
                <div className={`mt-6 p-4 rounded-xl max-w-2xl mx-auto ${feedback.isCorrect ? "bg-green-500/20 border border-green-400" : "bg-red-500/20 border border-red-400"}`}>
                  <div className="flex items-center space-x-3">
                    {feedback.isCorrect ? (
                      <span className="text-green-400 text-2xl">✓</span>
                    ) : (
                      <span className="text-red-400 text-2xl">✗</span>
                    )}
                    <div>
                      <h4 className={`font-bold ${feedback.isCorrect ? "text-green-400" : "text-red-400"}`}>
                        {feedback.isCorrect ? "Correct!" : "Good Try!"}
                      </h4>
                      <p className="text-white/80 mt-1">{feedback.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState === "completed" && (
            <div className="text-center py-8">
              <div className="bg-white/20 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-2">Game Completed!</h3>
                <p className="text-white/80 mb-4">
                  You made {score} healthy choices out of {gameRounds.length} scenarios.
                </p>
                <div className="bg-purple-500/20 p-4 rounded-lg mb-6">
                  <p className="font-bold text-purple-300">+{Math.min(score * 1, 3)} Coins Earned</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexHealthChoice;