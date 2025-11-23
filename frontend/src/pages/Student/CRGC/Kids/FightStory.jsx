import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FightStory = () => {
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
      text: "Two friends had a fight over a game. What's the first step to make up?",
      options: [
        {
          id: "a",
          text: "Ignore each other",
          emoji: "🤫",
          description: "That's not helpful. Ignoring each other can make the conflict last longer and hurt feelings more.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cool down first",
          emoji: "❄️",
          description: "That's right! Taking time to cool down helps both friends think more clearly about the situation.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "After cooling down, what should they do next?",
      options: [
        {
          id: "a",
          text: "Blame each other",
          emoji: "😠",
          description: "That's not productive. Blaming each other can make the conflict worse and damage the friendship.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Talk about what happened",
          emoji: "💬",
          description: "Perfect! Talking helps both friends understand each other's perspectives and feelings.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "During the conversation, what's important to remember?",
      options: [
        {
          id: "a",
          text: "Interrupt each other",
          emoji: "✋",
          description: "That's not respectful. Interrupting prevents understanding and can make the situation worse.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Listen without interrupting",
          emoji: "👂",
          description: "Great idea! Listening shows respect and helps both friends feel heard and understood.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "They both apologize. What should they do next?",
      options: [
        {
          id: "a",
          text: "Hold a grudge",
          emoji: "😤",
          description: "That's not healthy. Holding grudges can damage the friendship and cause future conflicts.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Forgive and move forward",
          emoji: "🤗",
          description: "Wonderful! Forgiving helps heal the friendship and allows both friends to move forward positively.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How can they prevent similar fights in the future?",
      options: [
        {
          id: "a",
          text: "Avoid each other",
          emoji: "🚶",
          description: "That's not a solution. Avoiding each other prevents friendship growth and doesn't address underlying issues.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Set clear expectations",
          emoji: "📋",
          description: "Excellent! Setting clear expectations helps both friends understand boundaries and reduces misunderstandings.",
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
      title="Fight Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-48"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={48}
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

export default FightStory;