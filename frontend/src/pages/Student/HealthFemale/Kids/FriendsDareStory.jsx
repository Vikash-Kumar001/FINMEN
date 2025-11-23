import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendsDareStory = () => {
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
      text: "A friend dares you to skip homework. Do you follow?",
      options: [
        {
          id: "a",
          text: "No, I finish my homework because education is important",
          emoji: "📚",
          description: "Exactly! Your education is important for your future. Good friends respect your responsibilities.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, friends come first",
          emoji: "👥",
          description: "While friends are important, your education and responsibilities matter too. True friends support your goals.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends dare you to cheat on a test. What do you do?",
      options: [
        {
          id: "a",
          text: "Refuse and explain why cheating is wrong",
          emoji: "🙅‍♀️",
          description: "Great choice! Standing up for what's right shows integrity. Cheating also doesn't help you learn.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go along with it to fit in",
          emoji: "🎭",
          description: "Fitting in is important, but not at the cost of your values. True friends respect your honesty.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friends pressure you to stay out late on a school night. What's best?",
      options: [
        {
          id: "a",
          text: "Politely decline and explain you need rest for school",
          emoji: "😴",
          description: "Perfect! Taking care of your health and responsibilities is important. Good friends understand this.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay out late to avoid disappointing friends",
          emoji: "🌙",
          description: "While you want to be a good friend, your health and school performance matter too. Set boundaries kindly.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Friends want you to exclude another classmate. Do you join them?",
      options: [
        {
          id: "a",
          text: "No, I treat everyone with kindness and respect",
          emoji: "🤝",
          description: "Wonderful! Treating everyone with kindness is the right choice. Bullying hurts others and isn't friendship.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, I don't want to be left out",
          emoji: "😔",
          description: "Being kind to everyone is more important than fitting in with a group that excludes others.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Friends pressure you to try something dangerous. What should you do?",
      options: [
        {
          id: "a",
          text: "Say no and suggest a safer alternative activity",
          emoji: "🛡️",
          description: "Excellent! Your safety comes first. Suggesting safer alternatives shows you care about everyone's wellbeing.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Do it to prove you're brave",
          emoji: "🤯",
          description: "True bravery is knowing when to say no to dangerous situations. Your safety is more important than proving anything.",
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
      title="Friend's Dare Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-61"
      gameType="health-female"
      totalLevels={70}
      currentLevel={61}
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

export default FriendsDareStory;