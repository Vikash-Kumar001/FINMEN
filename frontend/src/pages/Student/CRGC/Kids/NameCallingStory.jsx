import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NameCallingStory = () => {
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
      text: "You see a boy being teased for wearing glasses. What should you do?",
      options: [
        {
          id: "a",
          text: "Join in and tease him too",
          emoji: "😂",
          description: "Joining in makes the situation worse for the boy and can encourage more teasing.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Defend him and tell others to stop",
          emoji: "🛡️",
          description: "That's right! Defending someone being teased shows courage and kindness.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Some kids say wearing glasses is 'nerdy.' How should you respond?",
      options: [
        {
          id: "a",
          text: "Agree with them to fit in",
          emoji: "👍",
          description: "Agreeing with name-calling just encourages more of it and hurts others.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that glasses help people see",
          emoji: "👓",
          description: "Great choice! Explaining helps others understand and reduces negative stereotypes.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "The boy seems embarrassed about his glasses. How can you help?",
      options: [
        {
          id: "a",
          text: "Make fun of his embarrassment",
          emoji: "🤪",
          description: "Making fun of someone's feelings makes them feel worse and more isolated.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Compliment his glasses or personality",
          emoji: "😊",
          description: "Perfect! Compliments help boost confidence and show acceptance.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Other kids start calling him 'Four Eyes.' What do you do?",
      options: [
        {
          id: "a",
          text: "Stay quiet and watch",
          emoji: "🤫",
          description: "Staying quiet allows the name-calling to continue and doesn't help the boy.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell them that name-calling hurts",
          emoji: "📢",
          description: "That's right! Speaking up helps others understand that name-calling is hurtful.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The boy thanks you for defending him. How do you respond?",
      options: [
        {
          id: "a",
          text: "Say 'You're welcome' and act normally",
          emoji: "🤝",
          description: "Great response! Treating him normally helps him feel accepted and valued.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make a big deal about helping him",
          emoji: "🦸",
          description: "Making a big deal can make him feel indebted and uncomfortable.",
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
      title="Name-Calling Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-38"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={38}
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

export default NameCallingStory;