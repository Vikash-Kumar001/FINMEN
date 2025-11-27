import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationFraudAlert = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-88");
  const gameId = gameData?.id || "finance-teens-88";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationFraudAlert, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Fraud Alert: Win Message",
      description: "Message: 'Win ₹1 lakh, click link.' What should you do?",
      options: [
        { 
          id: "click", 
          text: "Click the link", 
          emoji: "🔗", 
          description: "See what happens",
          isCorrect: false
        },
        { 
          id: "delete", 
          text: "Delete the message", 
          emoji: "🗑️", 
          description: "Ignore and delete",
          isCorrect: true
        },
        { 
          id: "forward", 
          text: "Forward to friends", 
          emoji: "📤", 
          description: "Share with others",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Fraud Alert: Bank Call",
      description: "Caller says your account is locked. Asks for OTP. What do you do?",
      options: [
        { 
          id: "give-otp", 
          text: "Give OTP", 
          emoji: "🔢", 
          description: "Share the code",
          isCorrect: false
        },
        { 
          id: "hang-up", 
          text: "Hang up and call bank", 
          emoji: "📞", 
          description: "Verify with bank",
          isCorrect: true
        },
        { 
          id: "trust", 
          text: "Trust the caller", 
          emoji: "😊", 
          description: "Believe them",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Fraud Alert: Free Offer",
      description: "Website offers free phone for ₹50. What's your action?",
      options: [
        { 
          id: "refuse", 
          text: "Refuse, it's a scam", 
          emoji: "🚫", 
          description: "Too good to be true",
          isCorrect: true
        },
        { 
          id: "pay", 
          text: "Pay ₹50", 
          emoji: "💳", 
          description: "It's cheap",
          isCorrect: false
        },
        { 
          id: "check", 
          text: "Check website first", 
          emoji: "🔍", 
          description: "Verify authenticity",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Fraud Alert: Urgent Email",
      description: "Email says 'Act now or lose account.' Asks for password. What do you do?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore and delete", 
          emoji: "🗑️", 
          description: "Don't respond",
          isCorrect: true
        },
        { 
          id: "reply", 
          text: "Reply with password", 
          emoji: "📧", 
          description: "Share details",
          isCorrect: false
        },
        { 
          id: "forward-email", 
          text: "Forward email", 
          emoji: "📤", 
          description: "Share with others",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Fraud Alert: Investment Offer",
      description: "Someone offers 100% return in one day. What's your response?",
      options: [
        { 
          id: "invest", 
          text: "Invest immediately", 
          emoji: "💰", 
          description: "Great opportunity",
          isCorrect: false
        },
        { 
          id: "refuse2", 
          text: "Refuse, report scam", 
          emoji: "🚫", 
          description: "Unrealistic offer",
          isCorrect: true
        },
        { 
          id: "think", 
          text: "Think about it", 
          emoji: "🤔", 
          description: "Consider options",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const scenario = scenarios[currentScenario];
    const selectedOption = scenario.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastScenario = currentScenario === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Fraud Alert"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
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
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-white text-lg mb-6">
                {current.description}
              </p>
              
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
                      <p className="text-sm opacity-90">{option.description}</p>
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

export default SimulationFraudAlert;
