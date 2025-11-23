import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CigaretteStory = () => {
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
      text: "A friend offers you a cigarette. Should you try?",
      options: [
        {
          id: "a",
          text: "No, cigarettes are harmful to my health",
          emoji: "🙅‍♀️",
          description: "Exactly! Cigarettes contain harmful chemicals that can damage your lungs and cause serious health problems.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, just one won't hurt",
          emoji: "🚬",
          description: "Even one cigarette can be harmful. Nicotine is addictive, and smoking can lead to serious health problems.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your older sibling smokes and offers you one. What do you do?",
      options: [
        {
          id: "a",
          text: "Politely refuse and explain why it's harmful",
          emoji: "💬",
          description: "Great choice! Standing up for your health and educating others about risks shows maturity and courage.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try it to fit in with family",
          emoji: "👥",
          description: "Fitting in isn't worth risking your health. True family members support your healthy choices.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see someone smoking and it smells bad. How do you feel?",
      options: [
        {
          id: "a",
          text: "Glad I don't smoke and avoid the area",
          emoji: "😊",
          description: "Perfect! Recognizing the unpleasant effects of smoking reinforces your healthy choice to stay smoke-free.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Curious to try it despite the smell",
          emoji: "🤔",
          description: "The smell is your body's natural warning. Trust your instincts and avoid harmful substances.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A friend says smoking helps with stress. What's your response?",
      options: [
        {
          id: "a",
          text: "There are healthier ways to manage stress like exercise or talking",
          emoji: "🧘",
          description: "Wonderful! Exercise, talking to friends, or deep breathing are much healthier ways to manage stress.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Believe them and consider trying smoking",
          emoji: "😌",
          description: "Smoking actually increases stress over time and creates addiction. There are better stress management techniques.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You learn that smoking can cause cancer. How does this make you feel?",
      options: [
        {
          id: "a",
          text: "Glad I chose not to smoke and committed to staying smoke-free",
          emoji: "💪",
          description: "Excellent! Understanding serious health risks reinforces your commitment to making healthy choices.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Think it won't happen to you",
          emoji: "🤷",
          description: "Health risks are real for everyone who smokes. It's better to avoid the risk entirely.",
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
      title="Cigarette Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-81"
      gameType="health-female"
      totalLevels={90}
      currentLevel={81}
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

export default CigaretteStory;