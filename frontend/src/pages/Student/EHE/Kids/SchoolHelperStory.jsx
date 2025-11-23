import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolHelperStory = () => {
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
      text: "You notice someone at school who keeps the building safe and helps during emergencies. Who is this?",
      options: [
        {
          id: "b",
          text: "Librarian",
          emoji: "📚",
          description: "Librarians manage books and help with research!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Security Guard",
          emoji: "👮",
          description: "Correct! Security guards keep schools safe!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Janitor",
          emoji: "🧹",
          description: "Janitors clean the school but don't provide security!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Who helps students borrow books and find information for projects?",
      options: [
        {
          id: "c",
          text: "Principal",
          emoji: "👔",
          description: "Principals manage the whole school!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Librarian",
          emoji: "📚",
          description: "Perfect! Librarians help with books and research!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cafeteria Worker",
          emoji: "🍽️",
          description: "Cafeteria workers prepare food for students!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Who prepares the delicious meals you eat at school?",
      options: [
        {
          id: "b",
          text: "Teacher",
          emoji: "📖",
          description: "Teachers educate students!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Cafeteria Worker",
          emoji: "🍽️",
          description: "Correct! Cafeteria workers cook school meals!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nurse",
          emoji: "💉",
          description: "Nurses take care of sick students!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Who cleans the classrooms and hallways to keep the school tidy?",
      options: [
        {
          id: "b",
          text: "Secretary",
          emoji: "📱",
          description: "Secretaries handle office work and communications!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Janitor",
          emoji: "🧹",
          description: "Exactly! Janitors keep the school clean!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Bus Driver",
          emoji: "🚌",
          description: "Bus drivers transport students to and from school!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who drives the school bus that takes students to and from school?",
      options: [
        {
          id: "c",
          text: "Mechanic",
          emoji: "🔧",
          description: "Mechanics fix vehicles but don't drive them!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Bus Driver",
          emoji: "🚌",
          description: "Correct! Bus drivers safely transport students!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Crossing Guard",
          emoji: "✋",
          description: "Crossing guards help students cross streets safely!",
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
      title="School Helper Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-8"
      gameType="ehe"
      totalLevels={10}
      currentLevel={8}
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

export default SchoolHelperStory;