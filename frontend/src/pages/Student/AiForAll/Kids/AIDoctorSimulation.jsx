import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const AIDoctorSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-35";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Fever and Cough",
      description: "A patient has a high fever and persistent cough. What disease should the AI doctor identify?",
      choices: [
        { 
          text: "Flu", 
          emoji: "🤒",
          isCorrect: true
        },
        { 
          text: "Cold", 
          emoji: "🤧",
          isCorrect: false
        },
        { 
          text: "Migraine", 
          emoji: "🤕",
          isCorrect: false
        },
        { 
          text: "Allergy", 
          emoji: "🤧",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Stomach Ache",
      description: "A patient complains of severe stomach pain after eating. What should the AI diagnose?",
      choices: [
        { 
          text: "Cold", 
          emoji: "🤧",
          isCorrect: false
        },
        { 
          text: "Food Poisoning", 
          emoji: "🤢",
          isCorrect: true
        },
        { 
          text: "Flu", 
          emoji: "🤒",
          isCorrect: false
        },
        { 
          text: "Stomach Ulcer", 
          emoji: "😖",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Sneezing and Runny Nose",
      description: "A patient has frequent sneezing and a runny nose. What is the most likely diagnosis?",
      choices: [
        { 
          text: "Migraine", 
          emoji: "🤕",
          isCorrect: false
        },
        { 
          text: "Food Poisoning", 
          emoji: "🤢",
          isCorrect: false
        },
        { 
          text: "Cold", 
          emoji: "🤧",
          isCorrect: true
        },
        { 
          text: "Sinusitis", 
          emoji: "😷",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Headache and Dizziness",
      description: "A patient experiences severe headache with dizziness. What should the AI doctor identify?",
      choices: [
       
        { 
          text: "Flu", 
          emoji: "🤒",
          isCorrect: false
        },
        { 
          text: "Cold", 
          emoji: "🤧",
          isCorrect: false
        },
        { 
          text: "Dehydration", 
          emoji: "💧",
          isCorrect: false
        },
         { 
          text: "Migraine", 
          emoji: "🤕",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      title: "Skin Rash and Itching",
      description: "A patient has developed red, itchy skin patches. What condition should the AI identify?",
      choices: [
        { 
          text: "Eczema", 
          emoji: "🔴",
          isCorrect: true
        },
        { 
          text: "Migraine", 
          emoji: "🤕",
          isCorrect: false
        },
        { 
          text: "Flu", 
          emoji: "🤒",
          isCorrect: false
        },
        { 
          text: "Hives", 
          emoji: "🔥",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    // Navigate to the next game in the sequence
    navigate("/student/ai-for-all/kids/robot-vacuum-game");
  };

  return (
    <GameShell
      title="Simulation: AI Doctor"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${scenarios.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="ai"
      totalLevels={scenarios.length}
      currentLevel={currentQuestion + 1}
      maxScore={scenarios.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && scenarios[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {scenarios[currentQuestion].description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios[currentQuestion].choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(choice.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? choice.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{choice.emoji}</span>
                      <span className="text-white font-semibold">{choice.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} questions correct!
                  You understand medical diagnosis!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: AI doctors can help diagnose diseases based on symptoms!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} questions correct.
                  Keep learning about medical diagnosis!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: AI can help doctors diagnose diseases by analyzing symptoms!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIDoctorSimulation;