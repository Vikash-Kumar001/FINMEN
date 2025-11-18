import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BullyStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A bully teases a classmate. Should you join or stop him?",
      options: [
        {
          id: "a",
          text: "Stop him",
          emoji: "✋",
          description: "That's right! Standing up to bullies protects others and shows courage.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join him",
          emoji: "😈",
          description: "That's not kind. Bullying hurts others and is never acceptable.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend is being bullied. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore it",
          emoji: "🙈",
          description: "That's not helpful. Ignoring bullying allows it to continue.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell a teacher or adult",
          emoji: "👨‍🏫",
          description: "Perfect! Getting help from adults is the right way to stop bullying.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see someone being left out. What can you do?",
      options: [
        {
          id: "a",
          text: "Leave them alone",
          emoji: "🚶",
          description: "That's not kind. Excluding others can make them feel isolated.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Invite them to join",
          emoji: "🤝",
          description: "Great idea! Including others prevents social bullying and shows kindness.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Someone spreads rumors about you. How should you respond?",
      options: [
        {
          id: "a",
          text: "Spread rumors about them",
          emoji: "🤬",
          description: "That's not the right approach. Responding with more negativity only makes things worse.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Talk to a trusted adult",
          emoji: "👩‍💼",
          description: "Wonderful! Getting support from adults helps address the situation properly.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you help create a bully-free environment?",
      options: [
        {
          id: "a",
          text: "Stay silent when others are bullied",
          emoji: "🤐",
          description: "That's not helpful. Silence allows bullying to continue unchecked.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Be kind to everyone",
          emoji: "❤️",
          description: "Excellent! Kindness creates a positive environment where bullying is less likely.",
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
      title="Bully Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-8"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
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

export default BullyStory;