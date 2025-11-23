import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClimateStory = () => {
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
      text: "Floods affect kids in another country. Should you care?",
      options: [
        {
          id: "a",
          text: "Yes, we're all connected",
          emoji: "🌍",
          description: "That's right! Climate change affects everyone globally, and showing compassion for others is an important part of global citizenship.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's not my problem",
          emoji: "🚫",
          description: "That's not right. As global citizens, we should care about the wellbeing of people everywhere, especially children affected by climate disasters.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if they can help me",
          emoji: "💼",
          description: "That's not the spirit of global citizenship. Helping others should be based on compassion, not personal gain.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How can you help children affected by climate change?",
      options: [
        {
          id: "a",
          text: "Support organizations working on climate relief",
          emoji: "🤝",
          description: "That's right! Supporting organizations that provide aid to climate victims is a meaningful way to help from afar.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the problem completely",
          emoji: "🤐",
          description: "That's not helpful. Ignoring global issues doesn't make them disappear and leaves vulnerable people without support.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame the affected children",
          emoji: "😠",
          description: "That's not right. Blaming victims is never appropriate and doesn't solve the underlying issues.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What causes climate-related disasters like floods?",
      options: [
        {
          id: "a",
          text: "Climate change from human activities",
          emoji: "🏭",
          description: "That's right! Human activities like burning fossil fuels contribute to climate change, which increases the frequency and severity of extreme weather events.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Natural cycles only",
          emoji: "🌀",
          description: "That's partially true but incomplete. While natural cycles play a role, human activities have significantly intensified climate-related disasters.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's just bad luck",
          emoji: "🍀",
          description: "That's not accurate. Climate disasters are the result of complex environmental factors, not random chance.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What can you do to reduce climate change?",
      options: [
        {
          id: "a",
          text: "Reduce energy use and support clean energy",
          emoji: "💡",
          description: "That's right! Individual actions like conserving energy and supporting renewable energy can collectively make a significant impact.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing, it's too late",
          emoji: "⏰",
          description: "That's not true. While climate change is a serious challenge, individual and collective actions can still make a meaningful difference.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only focus on personal comfort",
          emoji: "🛋️",
          description: "That's not responsible. Prioritizing personal comfort over environmental impact contributes to the problem rather than solving it.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is global cooperation important for climate action?",
      options: [
        {
          id: "a",
          text: "Climate change affects everyone, everywhere",
          emoji: "🌐",
          description: "That's right! Climate change is a global issue that requires coordinated international efforts to address effectively.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only some countries are affected",
          emoji: "🗺️",
          description: "That's not accurate. While some regions are more vulnerable, climate change affects all countries through various impacts.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's only a local problem",
          emoji: "🏡",
          description: "That's not right. Climate change is a global phenomenon that transcends national borders and requires global solutions.",
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Climate Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-81"
      gameType="civic-responsibility"
      totalLevels={90}
      currentLevel={81}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
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
          
          <h2 className="text-xl font-semibold text-white mb-4">
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

export default ClimateStory;