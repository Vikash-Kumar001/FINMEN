import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 5;

const ReflexHealthyTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-29";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      question: "You are hungry. Pick the growth food!",
      correctAnswer: "Chicken/Beans",
      options: [
        { text: "Chicken/Beans", isCorrect: true, emoji: "🍗" },
        { text: "Candy", isCorrect: false, emoji: "🍬" },
        { text: "Soda", isCorrect: false, emoji: "🥤" },
        { text: "Chips", isCorrect: false, emoji: "🍟" }
      ]
    },
    {
      id: 2,
      question: "You are tired. What helps you grow?",
      correctAnswer: "Sleep",
      options: [
        { text: "Video Games", isCorrect: false, emoji: "🎮" },
        { text: "Sleep", isCorrect: true, emoji: "😴" },
        { text: "Energy Drink", isCorrect: false, emoji: "⚡" },
        { text: "TV", isCorrect: false, emoji: "📺" }
      ]
    },
    {
      id: 3,
      question: "You are stressed. What helps?",
      correctAnswer: "Talk/Exercise",
      options: [
        { text: "Yell", isCorrect: false, emoji: "🤬" },
        { text: "Hide", isCorrect: false, emoji: "🙈" },
        { text: "Talk/Exercise", isCorrect: true, emoji: "🏃" },
        { text: "Eat Junk", isCorrect: false, emoji: "🍔" }
      ]
    },
    {
      id: 4,
      question: "You smell bad. Quick fix?",
      correctAnswer: "Shower",
      options: [
        { text: "Perfume", isCorrect: false, emoji: "🌸" },
        { text: "Ignore", isCorrect: false, emoji: "🤷" },
        { text: "Shower", isCorrect: true, emoji: "🚿" },
        { text: "Change Shirt Only", isCorrect: false, emoji: "👕" }
      ]
    },
    {
      id: 5,
      question: "You have acne. Don't do this!",
      correctAnswer: "Pop It",
      options: [
        { text: "Wash Face", isCorrect: false, emoji: "🧼" },
        { text: "Pop It", isCorrect: true, emoji: "🤏" }, // Question asks what NOT to do, but reflex usually asks for correct action. Let's rephrase question to "What is bad for acne?" and correct answer is "Pop It" (identifying the bad thing) OR "What is good?" -> "Wash". Let's stick to "Pick the HEALTHY choice" pattern.
        // Rephrasing question to be consistent with "Pick the right choice"
        // Question: "You have acne. Best action?"
        // Correct: "Wash Face"
      ]
    }
  ];

  // Correcting Q5 for consistency
  const refinedQuestions = [
    ...questions.slice(0, 4),
    {
      id: 5,
      question: "You have acne. Best action?",
      correctAnswer: "Wash Face",
      options: [
        { text: "Pop It", isCorrect: false, emoji: "🤏" },
        { text: "Wash Face", isCorrect: true, emoji: "🧼" },
        { text: "Cover with Dirt", isCorrect: false, emoji: "💩" },
        { text: "Scratch", isCorrect: false, emoji: "💅" }
      ]
    }
  ];

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  // Handle time up - move to next question or show results
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();

    const isLastQuestion = currentRoundRef.current >= TOTAL_ROUNDS;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  }, []);

  // Timer effect - countdown from 5 seconds for each question
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check if game should be finished
    if (currentRoundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this round
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, handleTimeUp, currentRound]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (gameState !== "playing" || answered || currentRound > TOTAL_ROUNDS) return;

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next round or show results after a short delay
    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/puberty-smart-teen-badge");
  };

  const currentQuestion = refinedQuestions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Healthy Teen"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Choose health!` : "Choose health!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🏃</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Make healthy choices for your growing body!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            {/* Status Bar with Timer */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexHealthyTeen;
