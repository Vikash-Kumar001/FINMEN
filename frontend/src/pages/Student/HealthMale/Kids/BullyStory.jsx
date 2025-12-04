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
      text: "An older kid at school pressures you to steal candy from the store. What do you do?",
      options: [
        {
          id: "b",
          text: "Steal the candy to fit in",
          emoji: "🍬",
          description: "Stealing is wrong and can get you in big trouble",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and walk away",
          emoji: "🚶",
          description: "Saying no shows strength and protects you from trouble",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask if they have money to buy it",
          emoji: "💰",
          description: "It's better to just say no than make excuses",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone threatens to tell your secrets unless you do what they want. What's the right choice?",
      options: [
         {
          id: "a",
          text: "Tell them you won't be bullied",
          emoji: "🛡️",
          description: "Standing up to bullying shows courage and strength",
          isCorrect: true
        },
        {
          id: "c",
          text: "Do what they want to stay safe",
          emoji: "😨",
          description: "Blackmail is wrong - tell a trusted adult instead",
          isCorrect: false
        },
        {
          id: "b",
          text: "Give them what they want",
          emoji: "😞",
          description: "Bullies want power - don't let them have it",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A bigger kid pushes you and demands your lunch money. What should you do?",
      options: [
        {
          id: "b",
          text: "Fight back physically",
          emoji: "👊",
          description: "Fighting can make things worse - use words or get help",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell a teacher or parent",
          emoji: "🆘",
          description: "Adults can help stop bullying and keep you safe",
          isCorrect: true
        },
        {
          id: "c",
          text: "Give them the money",
          emoji: "💵",
          description: "Giving in only encourages more bullying",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Someone spreads rumors about you to make you look bad. How do you respond?",
      options: [
        {
          id: "c",
          text: "Spread rumors back about them",
          emoji: "👥",
          description: "Fighting rumors with rumors makes everything worse",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "Get very upset and cry",
          emoji: "😢",
          description: "It's okay to feel hurt, but respond with strength",
          isCorrect: false
        },
         {
          id: "a",
          text: "Ignore it and stay confident",
          emoji: "💪",
          description: "Bullies want reactions - confidence shows strength",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "A group excludes you and says you can't play with them. What's the healthy response?",
      options: [
        {
          id: "b",
          text: "Beg them to let you join",
          emoji: "🙏",
          description: "Real friends don't make you beg to be included",
          isCorrect: false
        },
        {
          id: "c",
          text: "Find other friends to play with",
          emoji: "🤝",
          description: "There are always other people who will include you",
          isCorrect: false
        },
        {
          id: "a",
          text: "Remember your worth and find activities you enjoy",
          emoji: "⭐",
          description: "Your value doesn't depend on others' approval",
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
    navigate("/student/health-male/kids/power-of-no-poster");
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
      gameId="health-male-kids-65"
      gameType="health-male"
      totalLevels={70}
      currentLevel={65}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
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

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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
