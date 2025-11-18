import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HairGrowthStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You've noticed hair on your arms and legs. Is this normal?",
      options: [
        {
          id: "a",
          text: "Yes, body hair is a normal part of development",
          emoji: "✅",
          description: "Exactly! Body hair growth is a natural part of puberty and development for both boys and girls.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, you should remove it immediately",
          emoji: "❌",
          description: "Body hair is completely normal. Whether or not to remove it is a personal choice, not a medical necessity.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend is worried about facial hair. What should you tell them?",
      options: [
        {
          id: "a",
          text: "Facial hair means something is wrong with them",
          emoji: "😨",
          description: "Facial hair is a normal part of development for many people. It doesn't indicate any health problems.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Some facial hair is normal during development",
          emoji: "😌",
          description: "Correct! Light facial hair can appear during puberty and is completely normal for many people.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What causes body hair growth during development?",
      options: [
        {
          id: "a",
          text: "Hormonal changes in the body",
          emoji: "🧬",
          description: "Perfect! Hormonal changes, especially increases in androgens, trigger body hair growth during puberty.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eating too much protein",
          emoji: "🍗",
          description: "While protein is important for hair health, it doesn't cause increased body hair growth during development.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should you care for body hair during development?",
      options: [
        {
          id: "a",
          text: "Keep the areas clean and decide personal grooming preferences",
          emoji: "🧼",
          description: "Great choice! Keeping the skin clean is important, and personal grooming choices are entirely up to individual preference.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Remove all body hair as soon as it appears",
          emoji: "✂️",
          description: "There's no medical need to remove body hair. It's a personal choice based on comfort and preference.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your sibling has more body hair than you. Is this normal?",
      options: [
        {
          id: "a",
          text: "No, everyone should have the same amount of body hair",
          emoji: "🤔",
          description: "People naturally have different amounts and patterns of body hair due to genetics, hormones, and other factors.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, body hair patterns vary greatly between individuals",
          emoji: "😊",
          description: "Good understanding! Body hair patterns vary widely between individuals due to genetics, hormones, and other factors.",
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
      title="Hair Growth Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-25"
      gameType="health-female"
      totalLevels={30}
      currentLevel={25}
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

export default HairGrowthStory;