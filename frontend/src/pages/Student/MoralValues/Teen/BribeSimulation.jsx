import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BribeSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-5");
  const gameId = gameData?.id || "moral-teen-5";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BribeSimulation, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "You're competing for a scholarship prize. Someone offers you money to help them cheat and win instead. What do you do?",
      options: [
        { 
          id: "a", 
          text: "Refuse and report the bribery attempt", 
          emoji: "🛡️", 
          description: "Shows integrity and protects fairness",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Accept the bribe - easy money", 
          emoji: "💰", 
          description: "Accepting bribes is dishonest and wrong",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Take the money but don't help", 
          emoji: "🤔", 
          description: "Taking bribes is still wrong even if you don't help",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A coach offers you a spot on the team in exchange for a gift. You really want to play. What do you do?",
      options: [
        { 
          id: "a", 
          text: "Give the gift secretly", 
          emoji: "🎁", 
          description: "Bribing is wrong even if done secretly",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Say no and earn your spot through effort", 
          emoji: "💪", 
          description: "Earning through merit shows integrity",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Tell no one but accept the offer", 
          emoji: "😬", 
          description: "Accepting bribes is wrong even in secret",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A friend says they'll vote for you as class rep if you promise to give them answers in exams. What's your response?",
      options: [
        { 
          id: "a", 
          text: "Agree—it's just one favor", 
          emoji: "😏", 
          description: "Trading favors for votes is corruption",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Ignore it and hope they forget", 
          emoji: "😐", 
          description: "Ignoring corruption doesn't solve it",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Refuse and focus on fair election", 
          emoji: "🗳️", 
          description: "Fair elections require integrity",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Your supervisor offers extra marks if you get them a personal favor done illegally. What do you do?",
      options: [
        { 
          id: "a", 
          text: "Report it to HR or authorities", 
          emoji: "📢", 
          description: "Reporting corruption protects others",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Comply—it could help your career", 
          emoji: "💸", 
          description: "Complying with illegal requests is wrong",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Stay silent and walk away", 
          emoji: "😶", 
          description: "Staying silent allows corruption to continue",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Someone secretly offers the leaked paper a day before your exam for a small amount. What will you do?",
      options: [
        { 
          id: "a", 
          text: "Buy it—everyone else might too", 
          emoji: "😈", 
          description: "Buying leaked papers is cheating",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Tell your friends but don't buy", 
          emoji: "🙄", 
          description: "Spreading information about leaks is wrong",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Refuse and inform the authorities", 
          emoji: "🚨", 
          description: "Reporting leaks protects exam integrity",
          isCorrect: true 
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Bribe Simulation"
      subtitle={levelCompleted ? "Simulation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="moral"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  ⚠️ Content Warning: This simulation touches on sensitive topics
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default BribeSimulation;
