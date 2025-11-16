import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AnimalStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You see a hungry 🐕 dog. Should you feed or kick it?",
      options: [
        {
          id: "a",
          text: "Feed it",
          emoji: "🍖",
          description: "That's right! Feeding a hungry animal shows kindness and compassion.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Kick it",
          emoji: "🦵",
          description: "That's not kind. Animals deserve compassion, not harm.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The dog looks sick. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore it",
          emoji: "🙈",
          description: "That's not responsible. Sick animals need help and care.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Call animal rescue",
          emoji: "📞",
          description: "Perfect! Getting professional help for a sick animal is the right thing to do.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The dog has no home. What can you do?",
      options: [
        {
          id: "a",
          text: "Leave it on the street",
          emoji: "🛣️",
          description: "That's not kind. Homeless animals need our help to find safety.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Help find it a home",
          emoji: "🏠",
          description: "Great idea! Helping animals find loving homes shows compassion.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "A friend wants to tease the dog. What should you do?",
      options: [
        {
          id: "a",
          text: "Join in",
          emoji: "😈",
          description: "That's not kind. Animals can feel pain and fear just like us.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop them",
          emoji: "✋",
          description: "Wonderful! Protecting animals from harm shows true empathy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You're taking care of the dog. What else should you do?",
      options: [
        {
          id: "a",
          text: "Neglect it",
          emoji: "😴",
          description: "That's not responsible. Animals depend on us for their care.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Give it love and attention",
          emoji: "❤️",
          description: "Excellent! Love and attention are essential for animal wellbeing.",
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
      title="Animal Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-5"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={5}
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

export default AnimalStory;