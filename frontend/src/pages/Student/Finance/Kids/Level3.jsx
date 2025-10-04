import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";

const Level3 = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const [reactionTime, setReactionTime] = useState(0);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const words = [
    { word: "SAVE", isCorrect: true },
    { word: "WASTE", isCorrect: false },
    { word: "SAVE", isCorrect: true },
    { word: "SPEND", isCorrect: false },
    { word: "SAVE", isCorrect: true },
    { word: "LOSE", isCorrect: false },
    { word: "SAVE", isCorrect: true },
    { word: "THROW", isCorrect: false }
  ];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState("finished");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(30);
    setScore(0);
    showNextWord();
  };

  const showNextWord = () => {
    if (gameState !== "playing") return;
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    startTimeRef.current = Date.now();
  };

  const handleTap = (isSave) => {
    if (gameState !== "playing") return;
    
    const endTime = Date.now();
    const reaction = endTime - startTimeRef.current;
    setReactionTime(reaction);
    
    if (isSave === currentWord.isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
    }
    
    // Show next word after a short delay
    setTimeout(showNextWord, 500);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/level4");
  };

  return (
    <GameShell
      title="Reflex Savings"
      subtitle="Tap quickly for 'Save' words, avoid 'Waste' words!"
      coins={coins}
      currentLevel={3}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={coins}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Tap the "SAVE" button when you see "SAVE" words.<br />
              Don't tap when you see "WASTE" words.
            </p>
            <p className="text-white/80 mb-6">
              You have 30 seconds to get as many correct as possible!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
              <div className="text-6xl font-bold text-white mb-8">
                {currentWord.word}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleTap(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="font-bold text-xl mb-2">SAVE</h3>
                </button>
                
                <button
                  onClick={() => handleTap(false)}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">🗑️</div>
                  <h3 className="font-bold text-xl mb-2">WASTE</h3>
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
            <p className="text-white/90 text-lg mb-2">
              You got {score} correct answers!
            </p>
            <p className="text-white/80 mb-6">
              Great job testing your reflexes!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              <span>+{Math.min(score, 3)} Coins</span>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default Level3;