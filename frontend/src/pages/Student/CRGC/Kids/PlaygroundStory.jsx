import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundStory = () => {
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
      text: "You see a bigger kid pushing a smaller one on the playground. What should you do?",
      options: [
        {
          id: "a",
          text: "Laugh at them",
          emoji: "😂",
          description: "That's not kind. Laughing at someone being hurt only makes things worse.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Help the smaller kid",
          emoji: "🛡️",
          description: "That's right! Helping someone who is being hurt shows courage and kindness.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "The bigger kid tells you to stay out of it. What do you do?",
      options: [
        {
          id: "a",
          text: "Get scared and walk away",
          emoji: "😨",
          description: "While it's natural to feel scared, walking away means the smaller kid doesn't get help.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stand up for what's right",
          emoji: "🦸",
          description: "Great choice! Standing up for what's right takes courage but helps protect others.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "The smaller kid is crying. How can you help?",
      options: [
        {
          id: "a",
          text: "Ignore their feelings",
          emoji: "🤫",
          description: "Ignoring someone's feelings when they're hurt doesn't help them feel better.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Comfort them and ask if they're okay",
          emoji: "🤗",
          description: "Perfect! Checking if someone is okay and offering comfort shows empathy.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "An adult approaches. What should you do?",
      options: [
        {
          id: "a",
          text: "Stay quiet and don't tell",
          emoji: "🤐",
          description: "Not telling an adult means the bullying might continue and hurt others.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell the adult what happened",
          emoji: "📢",
          description: "That's right! Telling a trusted adult helps keep everyone safe.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The bigger kid apologizes. How should you respond?",
      options: [
        {
          id: "a",
          text: "Tell them it's okay and they can do it again",
          emoji: "👍",
          description: "Bullying is never okay, even if the person says sorry. It's important to set boundaries.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Accept the apology but make it clear bullying is wrong",
          emoji: "🤝",
          description: "Good choice! Accepting an apology but making it clear that bullying is wrong helps prevent it in the future.",
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
      title="Playground Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-31"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={31}
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

export default PlaygroundStory;