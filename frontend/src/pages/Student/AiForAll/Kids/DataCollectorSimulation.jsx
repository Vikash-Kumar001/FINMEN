import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const DataCollectorSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-74";
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
      title: "Image Collector",
      description: "You are collecting photos for an AI to identify fruits. Which image should you choose?",
      choices: [
        { 
          id: "clear_apple", 
          text: "A clear photo of an apple", 
          emoji: "🍎", 
          description: "Clear, real images help AI learn correctly",
          isCorrect: true
        },
        { 
          id: "blurry", 
          text: "A blurry image", 
          emoji: "🌫️", 
          description: "Blurry images don't help AI learn",
          isCorrect: false
        },
        { 
          id: "cartoon", 
          text: "A cartoon of a banana", 
          emoji: "🍌", 
          description: "Cartoons are not real data for training",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Sound Recorder",
      description: "AI is learning animal sounds. Which data is correct?",
      choices: [
        { 
          id: "background", 
          text: "A random background noise", 
          emoji: "📢", 
          description: "Background noise is not useful data",
          isCorrect: false
        },
        { 
          id: "cat_meow", 
          text: "A recording of a cat's meow", 
          emoji: "🐱", 
          description: "Authentic sound data helps AI recognize patterns",
          isCorrect: true
        },
        { 
          id: "person_meow", 
          text: "A person saying 'meow'", 
          emoji: "🗣️", 
          description: "Human imitation is not real animal sound",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Text Collector",
      description: "You are training an AI chatbot. Which text should you collect?",
      choices: [
        { 
          id: "spam", 
          text: "Spam messages", 
          emoji: "🚫", 
          description: "Spam is not good training data",
          isCorrect: false
        },
        { 
          id: "broken", 
          text: "Broken text with symbols", 
          emoji: "❌", 
          description: "Broken text doesn't help AI learn",
          isCorrect: false
        },
        { 
          id: "polite", 
          text: "Polite and correct sentences", 
          emoji: "💬", 
          description: "Clean, polite text improves chatbot behavior",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Diversity Matters",
      description: "To make AI fair, what kind of images should be collected?",
      choices: [
        { 
          id: "diverse", 
          text: "Images from many people and places", 
          emoji: "🌍", 
          description: "Diverse datasets help AI be unbiased and fair",
          isCorrect: true
        },
        { 
          id: "one_country", 
          text: "Only from one country", 
          emoji: "🇮🇳", 
          description: "Limited diversity creates bias",
          isCorrect: false
        },
        { 
          id: "famous", 
          text: "Only of famous people", 
          emoji: "⭐", 
          description: "Limited diversity doesn't help fairness",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Data Safety",
      description: "Before uploading data, what must you do?",
      choices: [
        { 
          id: "share_contact", 
          text: "Share full contact info", 
          emoji: "📱", 
          description: "Sharing personal info is unsafe",
          isCorrect: false
        },
        { 
          id: "remove_personal", 
          text: "Remove personal details", 
          emoji: "🔒", 
          description: "Data privacy is vital when collecting information",
          isCorrect: true
        },
        { 
          id: "social_media", 
          text: "Post on social media", 
          emoji: "📢", 
          description: "Posting data publicly is unsafe",
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
      console.log(`🎮 Data Collector Simulation game completed! Score: ${finalScore}/${scenarios.length}, gameId: ${gameId}`);
    }
  }, [showResult, finalScore, gameId, scenarios.length]);

  return (
    <GameShell
      title="Simulation: Data Collector"
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Data Collection!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart data collection decisions out of {scenarios.length} scenarios!
                  You're learning how to collect quality data for AI training!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand that data should be accurate, diverse, clean, and safe before training AI!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart data collection decisions out of {scenarios.length} scenarios.
                  Remember, quality data helps AI learn correctly!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that collects accurate, diverse, clean, and safe data.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DataCollectorSimulation;
