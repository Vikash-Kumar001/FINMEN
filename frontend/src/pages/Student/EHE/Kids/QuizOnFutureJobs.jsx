import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnFutureJobs = () => {
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
      text: "Which is a new career?",
      options: [
        {
          id: "a",
          text: "AI Engineer",
          emoji: "🤖",
          description: "Correct! AI Engineers work with artificial intelligence!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Dinosaur Hunter",
          emoji: "🦖",
          description: "Dinosaurs are extinct, so this isn't a real job!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What does a Data Scientist do?",
      options: [
        {
          id: "a",
          text: "Analyze complex data",
          emoji: "📊",
          description: "Exactly! They analyze data to find patterns and insights!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only play games",
          emoji: "🎮",
          description: "Data Scientists have serious analytical work!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which job involves creating digital art?",
      options: [
        {
          id: "a",
          text: "Digital Artist",
          emoji: "🎨",
          description: "Perfect! Digital Artists create art using technology!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Traditional Painter",
          emoji: "🖌️",
          description: "Traditional painters use physical materials, not digital tools!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a Drone Pilot?",
      options: [
        {
          id: "a",
          text: "Flies unmanned aircraft",
          emoji: "🚁",
          description: "Correct! They operate drones for various purposes!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Drives buses",
          emoji: "🚌",
          description: "Bus drivers operate ground vehicles, not drones!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which career works with renewable energy?",
      options: [
        {
          id: "a",
          text: "Solar Panel Technician",
          emoji: "☀️",
          description: "Exactly! They install and maintain solar panels!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Coal Miner",
          emoji: "⛏️",
          description: "Coal miners work with fossil fuels, not renewable energy!",
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
      title="Quiz on Future Jobs"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-72"
      gameType="ehe"
      totalLevels={10}
      currentLevel={72}
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

export default QuizOnFutureJobs;