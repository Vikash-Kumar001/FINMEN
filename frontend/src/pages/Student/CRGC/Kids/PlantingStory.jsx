import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlantingStory = () => {
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
      text: "The kids at school want to create a green schoolyard with more trees and plants. Some students say it's too much work. What should you do?",
      options: [
        {
          id: "a",
          text: "Start a petition to get the principal's support",
          emoji: "📝",
          description: "That's right! Organizing and getting support from authorities is a responsible way to initiate change.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell everyone it's impossible and give up",
          emoji: "😒",
          description: "That's not helpful. Giving up without trying doesn't solve problems.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Do all the work yourself without telling anyone",
          emoji: "😤",
          description: "That's not sustainable. Big projects need teamwork and support.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your group is planning to plant flowers in the school garden. Some students want to plant only their favorite flowers. How should you decide?",
      options: [
        {
          id: "a",
          text: "Let everyone vote on which flowers to plant",
          emoji: "🗳️",
          description: "Perfect! Democratic decision-making ensures everyone's voice is heard.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Let the loudest person decide",
          emoji: "📢",
          description: "That's not fair. Leadership isn't about being the loudest.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Plant only what the teacher suggests",
          emoji: "📚",
          description: "While teacher guidance is valuable, involving students in decisions is important for ownership.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During the planting activity, you notice some plants aren't getting enough water. What should you do?",
      options: [
        {
          id: "a",
          text: "Create a watering schedule and assign responsibilities",
          emoji: "⏰",
          description: "Great! Planning and assigning responsibilities ensures the project's success.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complain that someone else should take care of it",
          emoji: "😠",
          description: "That's not taking responsibility. Everyone should contribute to the project's success.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it and hope someone else notices",
          emoji: "🙈",
          description: "That's not responsible. Addressing problems early prevents bigger issues.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Some students are not participating in the planting activity, saying it's boring. How should you respond?",
      options: [
        {
          id: "a",
          text: "Explain how the garden will benefit the school and involve them in planning",
          emoji: "🤝",
          description: "That's right! Explaining the benefits and involving others increases engagement.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell them they have to participate or face consequences",
          emoji: "😡",
          description: "That's not effective. Forcing participation often creates resentment.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let them skip the activity without consequences",
          emoji: "😒",
          description: "That's not fair to the students who are participating. Everyone should contribute equally.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After a month, the school garden is thriving and attracting positive attention. What should you do next?",
      options: [
        {
          id: "a",
          text: "Organize a celebration and share the success with the school",
          emoji: "🎉",
          description: "Perfect! Celebrating successes and sharing achievements inspires others to take action.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep it a secret so only your group knows about it",
          emoji: "🤫",
          description: "That's not sharing the benefits. Success stories can inspire others to create positive change.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Start criticizing what could have been done better",
          emoji: "😒",
          description: "While reflection is important, focusing on positives and celebrating achievements is more motivating.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Planting Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-95"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={95}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
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
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PlantingStory;