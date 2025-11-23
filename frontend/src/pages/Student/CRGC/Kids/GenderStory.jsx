import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GenderStory = () => {
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
      text: "A boy says, \"Girls can't play football.\" What do you say?",
      options: [
        {
          id: "a",
          text: "Ignore him and walk away",
          emoji: "🚶",
          description: "That's not helpful. Ignoring unfair comments doesn't address the issue or promote equality.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that everyone can play any sport they enjoy",
          emoji: "🗣️",
          description: "Great response! Everyone should have the opportunity to participate in activities they enjoy, regardless of gender.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Some kids are excluding girls from the science club. What should you do?",
      options: [
        {
          id: "a",
          text: "Join the group that's excluding them",
          emoji: "🙅",
          description: "That's not fair. Excluding people based on gender is discriminatory and harmful.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stand up for the girls and support their inclusion",
          emoji: "✊",
          description: "Perfect! Standing up for others and promoting inclusion creates a fair environment for everyone.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A girl wants to be a firefighter when she grows up. Some boys are laughing at her. What do you do?",
      options: [
        {
          id: "a",
          text: "Laugh with them",
          emoji: "😂",
          description: "That's not respectful. Everyone should be able to dream about any career without judgment.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Support her dream and tell the boys to stop",
          emoji: "👍",
          description: "Wonderful! Supporting others' dreams and standing up against teasing promotes respect and equality.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friend says only boys should be leaders. How do you respond?",
      options: [
        {
          id: "a",
          text: "Agree with your friend",
          emoji: "🤝",
          description: "That's not inclusive. Leadership qualities aren't determined by gender.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Explain that anyone can be a leader regardless of gender",
          emoji: "💡",
          description: "Excellent! Leadership skills can be found in anyone, regardless of gender. Everyone should have equal opportunities.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "During class, the teacher asks for volunteers. Only boys raise their hands. What do you do?",
      options: [
        {
          id: "a",
          text: "Wait for the teacher to call on boys only",
          emoji: "⏱️",
          description: "That's not promoting equality. Everyone should have equal opportunities to participate.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Encourage girls to raise their hands too",
          emoji: "🙋",
          description: "Great! Encouraging everyone to participate ensures equal opportunities for all students.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Gender Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-15"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={15}
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

export default GenderStory;