import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const AIDoctorSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-35";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
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
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      scenarioId: scenarios[currentScenario].id, 
      choice: selectedChoice,
      isCorrect: scenarios[currentScenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = scenarios[currentScenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next scenario or show results
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 500);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  // Log when game completes
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 AI Doctor Simulation game completed! Score: ${finalScore}/${scenarios.length}, gameId: ${gameId}`);
    }
  }, [showResult, finalScore, gameId, scenarios.length]);

  return (
    <GameShell
      title="Simulation: AI Doctor"
      score={coins}
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="ai"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{getCurrentScenario().title}</h3>
              <p className="text-white text-lg mb-6">
                {getCurrentScenario().description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentScenario().choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-3">{choice.emoji}</div>
                      <h4 className="font-bold text-lg mb-2">{choice.text}</h4>
                      <p className="text-white/90 text-sm">{choice.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Diagnosis!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly diagnosed {finalScore} out of {scenarios.length} cases!
                  You're learning how AI doctors analyze symptoms!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  AI doctors can analyze symptoms and suggest possible diseases quickly, helping real doctors make better decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly diagnosed {finalScore} out of {scenarios.length} cases.
                  Remember, AI doctors analyze symptoms to help identify diseases!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to match symptoms with the correct disease diagnosis.
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
