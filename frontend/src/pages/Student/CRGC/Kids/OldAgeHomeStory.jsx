import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OldAgeHomeStory = () => {
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
      text: "Your class visits an old age home. What should you do?",
      options: [
        {
          id: "a",
          text: "Sing songs and cheer the elders",
          emoji: "🎵",
          description: "That's right! Bringing joy and entertainment to elders shows respect and kindness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay silent and avoid interaction",
          emoji: "🤐",
          description: "That's not very considerate. Elders appreciate interaction and companionship.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "An elder shares stories from their past. How should you respond?",
      options: [
        {
          id: "a",
          text: "Listen attentively and ask questions",
          emoji: "👂",
          description: "Perfect! Listening to elders' stories shows respect and helps you learn from their experiences.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Check your phone and ignore them",
          emoji: "📱",
          description: "That's disrespectful. Elders value attention and conversation.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "An elder seems lonely and sad. What can you do?",
      options: [
        {
          id: "a",
          text: "Spend time talking with them",
          emoji: "🤗",
          description: "Great idea! Spending time with lonely elders can brighten their day and make them feel valued.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid them because they seem difficult",
          emoji: "😒",
          description: "That's not kind. Everyone deserves compassion, especially those who may be feeling lonely.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you show respect to the elders during your visit?",
      options: [
        {
          id: "a",
          text: "Speak politely and help with small tasks",
          emoji: "🙏",
          description: "Wonderful! Polite speech and helpful actions demonstrate respect and consideration.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Run around and make loud noises",
          emoji: "🏃",
          description: "That's not appropriate. Loud behavior can disturb elders and shows disrespect.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After your visit, how can you continue helping elders in your community?",
      options: [
        {
          id: "a",
          text: "Visit them regularly and stay in touch",
          emoji: "📅",
          description: "Excellent! Regular visits and communication help build meaningful relationships with elders.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Forget about them after the school visit",
          emoji: "😴",
          description: "That's not very caring. Continuing to show interest in elders' wellbeing is important.",
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
      title="Old Age Home Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-58"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={58}
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

export default OldAgeHomeStory;