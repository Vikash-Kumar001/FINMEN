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
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Fever and Cough",
      description: "A patient has a high fever and persistent cough. What disease should the AI doctor identify?",
      choices: [
        { 
          id: "flu", 
          text: "Flu", 
          emoji: "🤒", 
          description: "Influenza with fever and cough symptoms",
          isCorrect: true
        },
        { 
          id: "cold", 
          text: "Cold", 
          emoji: "🤧", 
          description: "Common cold with mild symptoms",
          isCorrect: false
        },
        { 
          id: "migraine", 
          text: "Migraine", 
          emoji: "🤕", 
          description: "Severe headache condition",
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
          id: "cold", 
          text: "Cold", 
          emoji: "🤧", 
          description: "Common cold symptoms",
          isCorrect: false
        },
        { 
          id: "food_poisoning", 
          text: "Food Poisoning", 
          emoji: "🤢", 
          description: "Stomach issues from contaminated food",
          isCorrect: true
        },
        { 
          id: "flu", 
          text: "Flu", 
          emoji: "🤒", 
          description: "Influenza symptoms",
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
          id: "migraine", 
          text: "Migraine", 
          emoji: "🤕", 
          description: "Severe headache condition",
          isCorrect: false
        },
        { 
          id: "food_poisoning", 
          text: "Food Poisoning", 
          emoji: "🤢", 
          description: "Stomach issues from food",
          isCorrect: false
        },
        { 
          id: "cold", 
          text: "Cold", 
          emoji: "🤧", 
          description: "Common cold with sneezing and runny nose",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Headache and Dizziness",
      description: "A patient experiences severe headache with dizziness. What should the AI doctor identify?",
      choices: [
        { 
          id: "migraine", 
          text: "Migraine", 
          emoji: "🤕", 
          description: "Severe headache with dizziness symptoms",
          isCorrect: true
        },
        { 
          id: "flu", 
          text: "Flu", 
          emoji: "🤒", 
          description: "Influenza symptoms",
          isCorrect: false
        },
        { 
          id: "cold", 
          text: "Cold", 
          emoji: "🤧", 
          description: "Common cold symptoms",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Skin Rash and Itching",
      description: "A patient has developed red, itchy skin patches. What condition should the AI identify?",
      choices: [
        { 
          id: "eczema", 
          text: "Eczema", 
          emoji: "🔴", 
          description: "Skin condition causing red, itchy patches",
          isCorrect: true
        },
        { 
          id: "migraine", 
          text: "Migraine", 
          emoji: "🤕", 
          description: "Severe headache condition",
          isCorrect: false
        },
        { 
          id: "flu", 
          text: "Flu", 
          emoji: "🤒", 
          description: "Influenza symptoms",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const isCorrect = scenarios[currentScenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    // Navigate to the next game in the sequence
    navigate("/student/ai-for-all/kids/robot-vacuum-game");
  };

  const accuracy = Math.round((score / scenarios.length) * 100);

  return (
    <GameShell
      title="Simulation: AI Doctor"
      score={score}
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={35}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Medical Diagnosis Challenge</h3>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-2 text-center">{scenarios[currentScenario].title}</h3>
              <p className="text-white text-lg mb-6 text-center">
                {scenarios[currentScenario].description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios[currentScenario].choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-white/20 hover:bg-white/30 border-3 border-white/40 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="flex flex-col items-center">
                    <div className="text-3xl mb-3">{choice.emoji}</div>
                    <h4 className="font-bold text-lg mb-2 text-white">{choice.text}</h4>
                    <p className="text-white/90 text-sm text-center">{choice.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Medical Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You correctly diagnosed {score} out of {scenarios.length} cases! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI doctors can analyze symptoms and suggest possible diseases quickly, helping real doctors make better decisions!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {score} Points! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIDoctorSimulation;