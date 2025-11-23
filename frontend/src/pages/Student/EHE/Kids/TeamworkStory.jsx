import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeamworkStory = () => {
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
      text: "You want to start a school project. Should you work alone or with friends?",
      options: [
        {
          id: "a",
          text: "Work with friends and share responsibilities",
          emoji: "🤝",
          description: "Perfect! Teamwork means collaborating and sharing tasks!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Work alone to do everything yourself",
          emoji: "👤",
          description: "Working alone can be limiting. You miss out on different ideas!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask friends to help but boss them around",
          emoji: "😤",
          description: "That's not real teamwork. Everyone should contribute equally!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During your group project, a friend has a different idea. What should you do?",
      options: [
        {
          id: "c",
          text: "Argue and insist yours is better",
          emoji: "😠",
          description: "Conflict isn't helpful. Good teamwork involves listening!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Listen to their idea and discuss together",
          emoji: "👂",
          description: "Excellent! Good teamwork involves open communication!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore their idea completely",
          emoji: "🔇",
          description: "That's not respectful teamwork. Everyone's ideas matter!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "One team member isn't doing their part of the project. How should you handle this?",
      options: [
        {
          id: "c",
          text: "Get angry and yell at them",
          emoji: "😡",
          description: "Anger doesn't help. Communication is the key!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Do all their work yourself",
          emoji: "😤",
          description: "That's not fair to you and doesn't solve the problem!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk to them kindly and offer help",
          emoji: "💬",
          description: "Great! Addressing issues with kindness helps the team!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your team completes the project successfully. How should you celebrate?",
      options: [
        {
          id: "c",
          text: "Blame others if anything goes wrong",
          emoji: "😠",
          description: "That destroys team spirit. Own your part in outcomes!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Thank everyone for their contributions",
          emoji: "🙏",
          description: "Perfect! Recognizing everyone's efforts builds strong teams!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take all the credit for yourself",
          emoji: "👑",
          description: "That's not fair. Success belongs to the whole team!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the most important benefit of working in a team?",
      options: [
        {
          id: "c",
          text: "Less work for yourself",
          emoji: "🛋️",
          description: "Teams work together, not to reduce individual effort!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Having someone else to blame",
          emoji: "🫣",
          description: "That's not the right mindset for teamwork!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Combining different skills and ideas",
          emoji: "🌟",
          description: "Exactly! Teams are stronger when they combine diverse talents!",
          isCorrect: true
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
      title="Teamwork Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-15"
      gameType="ehe"
      totalLevels={10}
      currentLevel={15}
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

export default TeamworkStory;