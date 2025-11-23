import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerStory = () => {
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
      text: "A classmate says \"Cool girls drink.\" Should you follow?",
      options: [
        {
          id: "a",
          text: "No, real coolness comes from making healthy choices",
          emoji: "🙅‍♀️",
          description: "Exactly! True confidence comes from self-respect and making decisions that protect your health and future.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, I want to fit in with the cool crowd",
          emoji: "🍺",
          description: "Fitting in isn't worth risking your health. True friends support your healthy choices and respect your boundaries.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends pressure you to try alcohol at a party. What do you do?",
      options: [
        {
          id: "a",
          text: "Politely refuse and suggest a different activity",
          emoji: "💬",
          description: "Great choice! Suggesting an alternative activity shows leadership and helps create a fun environment without substances.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go along with it to avoid being left out",
          emoji: "👥",
          description: "Going along with something you know is wrong can lead to dangerous situations. True friends respect your values.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "An older student says you're not mature if you don't drink. How do you respond?",
      options: [
        {
          id: "a",
          text: "Maturity means making responsible choices that protect my health",
          emoji: "🧠",
          description: "Perfect! Real maturity is about making responsible decisions that protect your wellbeing and future.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Feel insecure and consider trying alcohol",
          emoji: "😰",
          description: "Maturity isn't about drinking - it's about making smart choices. Your health and safety are more important than others' opinions.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You see friends getting into trouble after drinking. What do you learn?",
      options: [
        {
          id: "a",
          text: "I'm glad I made the choice to stay away from alcohol",
          emoji: "😊",
          description: "Wonderful! Learning from others' experiences helps reinforce your commitment to making healthy choices.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Think it won't happen to you",
          emoji: "🤷",
          description: "Alcohol affects everyone differently, but the risks are real for all who consume it. It's better to avoid the risk entirely.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A friend stops talking to you for saying no to alcohol. What do you do?",
      options: [
        {
          id: "a",
          text: "Find friends who respect my healthy choices",
          emoji: "🤝",
          description: "Excellent! Surrounding yourself with people who support your positive decisions leads to healthier, more meaningful friendships.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try to convince them to drink to regain friendship",
          emoji: "😔",
          description: "True friends respect your boundaries. It's better to find people who support your healthy choices than to compromise your values.",
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
      title="Peer Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-88"
      gameType="health-female"
      totalLevels={90}
      currentLevel={88}
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

export default PeerStory;