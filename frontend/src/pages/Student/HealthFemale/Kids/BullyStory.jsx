import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BullyStory = () => {
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
      text: "Older girl pressures you to steal candy. Do you?",
      options: [
        {
          id: "a",
          text: "No, stealing is wrong no matter who asks",
          emoji: "🙅‍♀️",
          description: "Exactly! Stealing is wrong regardless of who pressures you. Stand up for what's right!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, I don't want to upset her",
          emoji: "😰",
          description: "While you might be afraid, stealing is never the right choice. There are better ways to handle this situation.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone threatens to spread rumors about you if you don't give them money. What do you do?",
      options: [
        {
          id: "a",
          text: "Tell a trusted adult immediately",
          emoji: "👩‍🏫",
          description: "Great choice! Telling a trusted adult is the best way to stop bullying and keep yourself safe.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give them the money to avoid trouble",
          emoji: "💰",
          description: "Giving in to threats only encourages more bullying. Getting help from adults is the right solution.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A classmate excludes you and tells others not to be your friend. How do you respond?",
      options: [
        {
          id: "a",
          text: "Talk to a counselor or teacher about it",
          emoji: "💬",
          description: "Perfect! Adults can help address bullying and support you in building healthy friendships.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try to win them back by doing what they want",
          emoji: "🥺",
          description: "Trying to please bullies rarely works and can make the situation worse. Seek support from adults instead.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Someone posts mean comments about you online. What should you do?",
      options: [
        {
          id: "a",
          text: "Save the evidence and tell a parent or teacher",
          emoji: "📸",
          description: "Wonderful! Documenting cyberbullying and telling trusted adults is the best way to address it.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it and hope it goes away",
          emoji: "🙈",
          description: "Ignoring cyberbullying often allows it to continue and get worse. Getting help is important for your wellbeing.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You witness someone else being bullied. What's the best action?",
      options: [
        {
          id: "a",
          text: "Tell an adult and support the person being bullied",
          emoji: "🦸‍♀️",
          description: "Excellent! Standing up to bullying by getting adult help and supporting the victim makes a positive difference.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay quiet to avoid becoming a target yourself",
          emoji: "🤫",
          description: "Staying silent allows bullying to continue. Being an upstander helps create a safer environment for everyone.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Bully Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-65"
      gameType="health-female"
      totalLevels={70}
      currentLevel={65}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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

export default BullyStory;