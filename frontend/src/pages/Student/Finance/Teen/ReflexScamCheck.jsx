import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexScamCheck = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-89");
  const gameId = gameData?.id || "finance-teens-89";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexScamCheck, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  const rounds = [
    {
      id: 1,
      question: "Tap for 'Report Scam' or 'Ignore Fraud.'",
      options: [
        { 
          id: "report", 
          text: "Report Scam", 
          emoji: "🚨", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore Fraud", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Wait and see", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      question: "Tap for 'Verify First' or 'Trust Immediately.'",
      options: [
        { 
          id: "trust", 
          text: "Trust Immediately", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          id: "verify", 
          text: "Verify First", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          id: "ignore2", 
          text: "Ignore completely", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      question: "Tap for 'Delete Suspicious' or 'Click Link.'",
      options: [
        { 
          id: "delete", 
          text: "Delete Suspicious", 
          emoji: "🗑️", 
          isCorrect: true
        },
        { 
          id: "click", 
          text: "Click Link", 
          emoji: "🔗", 
          isCorrect: false
        },
        { 
          id: "forward", 
          text: "Forward to others", 
          emoji: "📤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      question: "Tap for 'Never Share OTP' or 'Share OTP.'",
      options: [
        { 
          id: "never-share", 
          text: "Never Share OTP", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          id: "share-otp", 
          text: "Share OTP", 
          emoji: "🔢", 
          isCorrect: false
        },
        { 
          id: "maybe-otp", 
          text: "Share if asked nicely", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      question: "Tap for 'Hang Up Safely' or 'Continue Call.'",
      options: [
        { 
          id: "continue", 
          text: "Continue Call", 
          emoji: "📞", 
          isCorrect: false
        },
        { 
          id: "hang-up", 
          text: "Hang Up Safely", 
          emoji: "📴", 
          isCorrect: true
        },
        { 
          id: "give-info", 
          text: "Give some information", 
          emoji: "📝", 
          isCorrect: false
        }
      ]
    }
  ];

  useEffect(() => {
    if (!showResult && !answered) {
      setTimeLeft(10);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentRound, showResult, answered]);

  const handleTimeUp = () => {
    if (answered) return;
    setAnswered(true);
    resetFeedback();
    showCorrectAnswerFeedback(0, false);
    
    const isLastRound = currentRound === rounds.length - 1;
    setTimeout(() => {
      if (isLastRound) {
        setShowResult(true);
      } else {
        setCurrentRound(prev => prev + 1);
        setAnswered(false);
      }
    }, 1500);
  };

  const handleAnswer = (optionId) => {
    if (answered) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setAnswered(true);
    resetFeedback();
    
    const round = rounds[currentRound];
    const selectedOption = round.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastRound = currentRound === rounds.length - 1;
    
    setTimeout(() => {
      if (isLastRound) {
        setShowResult(true);
      } else {
        setCurrentRound(prev => prev + 1);
        setAnswered(false);
      }
    }, 1500);
  };

  const current = rounds[currentRound];

  return (
    <GameShell
      title="Reflex Scam Check"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${rounds.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={rounds.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={rounds.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Round {currentRound + 1}/{rounds.length}</span>
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold">Score: {score}/{rounds.length}</span>
                  <div className="bg-red-500/20 px-4 py-2 rounded-full">
                    <span className="text-white font-bold">{timeLeft}s</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {current.question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {current.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ReflexScamCheck;
