import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JunkFoodStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friends buy chips every day at lunch. They offer to share with you. What do you do?",
      options: [
        {
          id: "a",
          text: "Take some chips",
          emoji: "🍟",
          description: "Chips are tasty but don't give your body the nutrients it needs. It's better to choose healthier snacks.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Politely decline and eat your healthy lunch",
          emoji: "🍱",
          description: "Great choice! Bringing your own healthy lunch gives your body the nutrients it needs to grow strong.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Your friends say healthy food is boring. How do you respond?",
      options: [
        {
          id: "a",
          text: "Agree and try to get junk food",
          emoji: "😞",
          description: "Healthy food can be delicious! There are many tasty healthy options to try.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that healthy food gives you energy",
          emoji: "💪",
          description: "Perfect! Healthy food gives you energy to play, study, and grow. Plus, there are lots of tasty options!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "You're at a party with lots of snacks. What do you choose?",
      options: [
        {
          id: "a",
          text: "Only eat sweets and chips",
          emoji: "🍰",
          description: "It's okay to have treats sometimes, but it's better to have a balance with healthy options too.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Choose a mix of healthy and treat foods",
          emoji: "🥗",
          description: "Excellent! Having a balance of healthy foods with occasional treats is the best approach.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friends tease you for bringing healthy snacks. How do you handle it?",
      options: [
        {
          id: "a",
          text: "Stop bringing healthy snacks",
          emoji: "😢",
          description: "It's important to stand by your healthy choices even when others don't understand.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain why you choose healthy snacks",
          emoji: "😊",
          description: "Great job! Explaining your choices might even help your friends make healthier decisions too.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You see a new junk food your friends are trying. What do you do?",
      options: [
        {
          id: "a",
          text: "Try it just because your friends are",
          emoji: "-peer-pressure",
          description: "It's better to make your own healthy choices rather than just following others.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask if there's a healthy version or choose something else",
          emoji: "🤔",
          description: "Smart choice! Looking for healthier alternatives or making your own healthy choice is the best approach.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Junk Food Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-18"
      gameType="health-female"
      totalLevels={20}
      currentLevel={18}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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

export default JunkFoodStory;