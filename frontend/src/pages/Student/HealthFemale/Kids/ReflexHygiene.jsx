import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Timer, Zap, Play } from "lucide-react";

const ReflexHygiene = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-3";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: '' });
  const { showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Bath Daily",
      correctEmoji: '🚿',
      options: ['🚿', '❌', '🧼', '🪥', '👕', '💧'],
      feedback: {
        correct: "Great! Daily baths remove germs!",
        incorrect: "Oops! Baths are important for hygiene!"
      }
    },
    {
      id: 2,
      text: "Wash Hands",
      correctEmoji: '🧼',
      options: ['🚿', '❌', '🧼', '🪥', '👕', '💧'],
      feedback: {
        correct: "Super! Clean hands prevent sickness!",
        incorrect: "Washing hands is key to health!"
      }
    },
    {
      id: 3,
      text: "Brush Teeth",
      correctEmoji: '🪥',
      options: ['🚿', '❌', '🧼', '🪥', '👕', '💧'],
      feedback: {
        correct: "Shiny! Brushing keeps teeth strong!",
        incorrect: "Don't skip brushing your teeth!"
      }
    },
    {
      id: 4,
      text: "clean Clothes",
      correctEmoji: '👕',
      options: ['🚿', '❌', '🧼', '🪥', '👕', '💧'],
      feedback: {
        correct: "Fresh! Clean clothes feel good!",
        incorrect: "Wearing fresh clothes is important!"
      }
    },
    {
      id: 5,
      text: "Drink Water",
      correctEmoji: '💧',
      options: ['🚿', '❌', '🧼', '🪥', '👕', '💧'],
      feedback: {
        correct: "Hydrated! Water is best for you!",
        incorrect: "Your body needs plenty of water!"
      }
    }
  ];

  useEffect(() => {
    if (gameStarted && !gameFinished && !showFeedback) {
      if (timeLeft > 0) {
        const timerId = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timerId);
      } else {
        // Time ran out
        handleAnswer('TIMEOUT');
      }
    }
  }, [timeLeft, gameStarted, gameFinished, showFeedback]);

  // Reset timer on question change
  useEffect(() => {
    if (gameStarted && !gameFinished) {
      setTimeLeft(5);
    }
  }, [currentQuestion, gameStarted, gameFinished]);

  const handleStartGame = () => {
    setGameStarted(true);
    // Timer resets via useEffect
  };

  const handleAnswer = (selectedEmoji) => {
    if (showFeedback) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedEmoji === currentQ.correctEmoji;

    if (isCorrect) {
      setCoins(prev => prev + coinsPerLevel);
      showCorrectAnswerFeedback(coinsPerLevel, true);
      setFeedback({ correct: true, message: currentQ.feedback.correct });
    } else {
      setFeedback({
        correct: false,
        message: selectedEmoji === 'TIMEOUT' ? "Time's up!" : currentQ.feedback.incorrect
      });
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Reflex Hygiene"
      subtitle={gameStarted ? `Question ${currentQuestion + 1} of ${questions.length}` : "Get Ready!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-h-[400px] flex flex-col items-center justify-center">

          {!gameStarted ? (
            <div className="text-center space-y-6">
              <div className="p-6 bg-blue-500/20 rounded-full inline-block animate-pulse">
                <Zap size={64} className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Reflex Challenge!</h2>
              <p className="text-white/80 text-lg max-w-md">
                Can you spot the correct hygiene habit before time runs out?
                You have 5 seconds per question!
              </p>
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-xl text-xl font-bold text-white hover:scale-105 transition-transform flex items-center mx-auto gap-2"
              >
                <Play size={24} fill="currentColor" />
                Start Game
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto space-y-8">
              {/* HUD */}
              <div className="flex justify-between items-center w-full">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft <= 2 ? 'bg-red-500/20 border-red-400 text-red-100' : 'bg-blue-500/20 border-blue-400 text-blue-100'}`}>
                  <Timer size={20} />
                  <span className="font-mono text-xl font-bold">{timeLeft}s</span>
                </div>
                <div className="bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-400/50">
                  <span className="text-yellow-400 font-bold">Score: {coins}/{totalCoins}</span>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">{currentQ.text}</h3>
                <p className="text-white/60">Find the matching icon!</p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-4">
                {currentQ.options.map((emoji, idx) => {
                  let btnClass = "bg-white/10 hover:bg-white/20 border-white/10";
                  if (showFeedback && emoji === currentQ.correctEmoji) {
                    btnClass = "bg-green-500 border-green-400 ring-4 ring-green-500/30";
                  } else if (showFeedback) {
                    btnClass = "opacity-30 grayscale";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(emoji)}
                      disabled={showFeedback}
                      className={`h-24 rounded-2xl text-4xl flex items-center justify-center border-2 transition-all duration-300 ${btnClass}`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Overlay */}
              {showFeedback && (
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  <div className={`px-6 py-3 rounded-full font-bold shadow-lg backdrop-blur-md ${feedback.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {feedback.message}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexHygiene;
