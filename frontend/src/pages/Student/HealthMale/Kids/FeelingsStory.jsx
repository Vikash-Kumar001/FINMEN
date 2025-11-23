import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FeelingsStory = () => {
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
      text: "Your favorite toy breaks and you feel sad. What should you think?",
      options: [
        {
          id: "b",
          text: "I'm a bad kid for feeling sad",
          emoji: "😢",
          description: "Sadness is a normal feeling everyone has",
          isCorrect: false
        },
        {
          id: "a",
          text: "It's okay to feel sad sometimes",
          emoji: "💙",
          description: "All feelings are normal and okay to have",
          isCorrect: true
        },
        {
          id: "c",
          text: "I should never feel sad",
          emoji: "😠",
          description: "Everyone feels sad sometimes, it's part of being human",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "When you feel sad, what can you do?",
      options: [
        {
          id: "c",
          text: "Hide it and pretend to be happy",
          emoji: "😶",
          description: "It's better to express feelings than hide them",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell someone you trust",
          emoji: "💬",
          description: "Sharing feelings helps you feel better",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep it inside forever",
          emoji: "🔒",
          description: "Talking about feelings is healthy and helpful",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend gets a new toy and you feel jealous. Is jealousy normal?",
      options: [
        {
          id: "b",
          text: "No, you should never feel jealous",
          emoji: "❌",
          description: "Jealousy is a normal feeling that everyone experiences",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, all feelings are okay",
          emoji: "✅",
          description: "It's normal to feel jealous sometimes",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only bad kids feel jealous",
          emoji: "👿",
          description: "Good kids feel jealous too, it's completely normal",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "When you feel angry, what happens to your body?",
      options: [
        {
          id: "c",
          text: "Nothing, you feel exactly the same",
          emoji: "😑",
          description: "Anger makes your heart beat faster and face feel hot",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your heart beats faster",
          emoji: "💓",
          description: "Anger is a strong feeling that affects your body",
          isCorrect: true
        },
        {
          id: "b",
          text: "You feel sleepy",
          emoji: "😴",
          description: "Anger gives you energy, not sleepiness",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to handle big feelings?",
      options: [
        {
          id: "b",
          text: "Bottle them up inside",
          emoji: "🍾",
          description: "Expressing feelings in healthy ways is better",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore them completely",
          emoji: "🙈",
          description: "Feelings need to be acknowledged and expressed",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk about them or find healthy ways to express",
          emoji: "🗣️",
          description: "Healthy expression helps you feel better",
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
    navigate("/student/health-male/kids/quiz-emotions");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Feelings Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-51"
      gameType="health-male"
      totalLevels={60}
      currentLevel={51}
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

export default FeelingsStory;
