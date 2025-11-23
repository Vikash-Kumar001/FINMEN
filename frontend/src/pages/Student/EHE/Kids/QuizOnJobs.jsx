import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Who teaches students in school?",
      options: [
        {
          id: "c",
          text: "Farmer",
          emoji: "🚜",
          description: "Farmers grow crops and take care of animals!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Teacher",
          emoji: "📚",
          description: "Correct! Teachers help students learn new things!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Driver",
          emoji: "🚗",
          description: "Drivers operate vehicles to transport people!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Who grows crops and takes care of animals?",
      options: [
        {
          id: "a",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Chefs cook delicious food!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Farmer",
          emoji: "🚜",
          description: "Correct! Farmers grow the food we eat!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Doctor",
          emoji: "👨‍⚕️",
          description: "Doctors help sick people feel better!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Who flies airplanes to take people to different places?",
      options: [
        {
          id: "b",
          text: "Police Officer",
          emoji: "👮",
          description: "Police officers help keep people safe!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Pilot",
          emoji: "✈️",
          description: "Correct! Pilots fly airplanes safely!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Firefighter",
          emoji: "🚒",
          description: "Firefighters put out fires and save people!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Who cooks delicious food in restaurants?",
      options: [
        {
          id: "c",
          text: "Nurse",
          emoji: "👩‍⚕️",
          description: "Nurses take care of patients in hospitals!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Correct! Chefs create tasty meals!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Builder",
          emoji: "🏗️",
          description: "Builders construct houses and buildings!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who helps keep you safe in your neighborhood?",
      options: [
        {
          id: "c",
          text: "Scientist",
          emoji: "🔬",
          description: "Scientists do experiments and research!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Police Officer",
          emoji: "👮",
          description: "Correct! Police officers help protect people!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Artist",
          emoji: "🎨",
          description: "Artists create beautiful paintings and drawings!",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Jobs"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-2"
      gameType="ehe"
      totalLevels={10}
      currentLevel={2}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnJobs;