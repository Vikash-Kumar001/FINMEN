import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexCareerCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentStatement, setCurrentStatement] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const careerStatements = [
    { id: 1, statement: "Engineer builds bridges", emoji: "🏗️", correct: true },
    { id: 2, statement: "Engineer cooks food", emoji: "🍳", correct: false },
    { id: 3, statement: "Teacher helps students learn", emoji: "📚", correct: true },
    { id: 4, statement: "Teacher flies airplanes", emoji: "✈️", correct: false },
    { id: 5, statement: "Doctor treats patients", emoji: "🏥", correct: true },
    { id: 6, statement: "Doctor builds cars", emoji: "🚗", correct: false },
    { id: 7, statement: "Chef prepares meals", emoji: "🍽️", correct: true },
    { id: 8, statement: "Chef drives buses", emoji: "🚌", correct: false },
    { id: 9, statement: "Pilot flies planes", emoji: "✈️", correct: true },
    { id: 10, statement: "Pilot teaches math", emoji: "📐", correct: false }
  ];

  const [statements, setStatements] = useState([]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameFinished(true);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(30);
    setScore(0);
    setCoins(0);
    setStatements([...careerStatements].sort(() => Math.random() - 0.5));
    setCurrentStatement(careerStatements[0]);
  };

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next statement
    const currentIndex = statements.findIndex(item => item.id === currentStatement.id);
    if (currentIndex < statements.length - 1) {
      setCurrentStatement(statements[currentIndex + 1]);
    } else {
      // If we've gone through all statements, reshuffle and continue
      const shuffled = [...careerStatements].sort(() => Math.random() - 0.5);
      setStatements(shuffled);
      setCurrentStatement(shuffled[0]);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  return (
    <GameShell
      title="Reflex Career Check"
      subtitle={gameActive ? `Time: ${timeLeft}s | Score: ${score}` : "Quick career decisions!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-9"
      gameType="ehe"
      totalLevels={10}
      currentLevel={9}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {!gameActive && !gameFinished && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-4">
                Quick career decisions! Tap ✅ for correct job roles and ❌ for wrong ones.
              </h2>
              <p className="text-white/80 mb-6">
                You have 30 seconds to get as many correct answers as possible!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:opacity-90 transition-all"
              >
                Start Game
              </button>
            </div>
          )}

          {gameActive && currentStatement && (
            <div className="text-center">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white/80">Time: {timeLeft}s</div>
                <div className="text-yellow-400 font-bold">Score: {score}</div>
              </div>
              
              <div className="mb-8">
                <span className="text-6xl block mb-4">{currentStatement.emoji}</span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentStatement.statement}
                </h3>
                <p className="text-white/80">Is this correct?</p>
              </div>
              
              <div className="flex justify-center gap-8">
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white w-20 h-20 rounded-full text-4xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                  ✅
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white w-20 h-20 rounded-full text-4xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                  ❌
                </button>
              </div>
            </div>
          )}

          {gameFinished && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-xl text-white/80 mb-2">Your final score: <span className="text-yellow-400 font-bold">{score}</span></p>
              <p className="text-white/80 mb-6">You earned {coins} coins!</p>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">How did you do?</h3>
                <p className="text-white/80">
                  {score >= 8 ? "Excellent job! You know your careers well!" : 
                   score >= 5 ? "Good work! Keep learning about different jobs!" : 
                   "Keep exploring different careers and you'll improve!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexCareerCheck;