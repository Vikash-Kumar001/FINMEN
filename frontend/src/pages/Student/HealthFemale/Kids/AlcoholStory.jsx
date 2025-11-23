import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AlcoholStory = () => {
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
      text: "An older girl offers alcohol. Should you drink?",
      options: [
        {
          id: "a",
          text: "No, alcohol is harmful to my health and illegal for my age",
          emoji: "🙅‍♀️",
          description: "Exactly! Alcohol can harm your developing brain and body. It's also illegal for minors in most places.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, just a little won't hurt",
          emoji: "🍺",
          description: "Even small amounts of alcohol can be harmful to a developing body and can impair judgment and coordination.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says alcohol makes you cool. What do you think?",
      options: [
        {
          id: "a",
          text: "Real coolness comes from making smart, healthy choices",
          emoji: "😎",
          description: "Great choice! True confidence comes from self-respect and making decisions that protect your health and future.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Believe them and want to try alcohol",
          emoji: "🤔",
          description: "Making healthy choices is actually cooler than risking your health. True friends support your positive decisions.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're at a party where adults are drinking. What's your approach?",
      options: [
        {
          id: "a",
          text: "Stay with trusted adults and avoid alcohol",
          emoji: "👨‍👩‍👧",
          description: "Perfect! Staying with trusted adults keeps you safe and helps you make responsible choices.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try alcohol when adults aren't looking",
          emoji: "🙈",
          description: "This could be dangerous and put you at risk. It's better to follow rules and stay safe.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Alcohol makes you feel dizzy and sick. What should you do?",
      options: [
        {
          id: "a",
          text: "Tell a trusted adult immediately",
          emoji: "👩‍⚕️",
          description: "Wonderful! Getting help right away is the smartest and safest response to feeling unwell from alcohol.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide and hope it goes away",
          emoji: "🤐",
          description: "Hiding symptoms can be dangerous. It's important to get help when you're not feeling well.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You learn that alcohol can harm brain development. How does this make you feel?",
      options: [
        {
          id: "a",
          text: "Glad I chose not to drink and protect my brain",
          emoji: "🧠",
          description: "Excellent! Understanding how alcohol affects brain development reinforces your commitment to staying alcohol-free.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Think it won't affect you",
          emoji: "🤷",
          description: "Alcohol affects everyone's brain development during the teenage years. Protecting your brain is important for your future.",
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
      title="Alcohol Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-85"
      gameType="health-female"
      totalLevels={90}
      currentLevel={85}
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

export default AlcoholStory;