import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AlcoholStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-85";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You see adults drinking funny-smelling drinks.",
      options: [
        {
          id: "a",
          text: "Ask for a sip",
          emoji: "🍷",
          description: "Alcohol is not for kids.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stick to your juice or water",
          emoji: "🧃",
          description: "Correct! That is safe for you.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Smell it closely",
          emoji: "👃",
          description: "Best to stay away.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why can't kids drink alcohol?",
      options: [
        {
          id: "a",
          text: "It stops your brain from growing",
          emoji: "🧠",
          description: "Yes! Your brain is still growing.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It is too expensive",
          emoji: "💰",
          description: "It hurts your body.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It is only for Tuesday",
          emoji: "📅",
          description: "It is never for kids.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A friend says 'Try this beer'.",
      options: [
        {
          id: "a",
          text: "Drink it all",
          emoji: "🍺",
          description: "Do not drink it.",
          isCorrect: false
        },

        {
          id: "c",
          text: "Take a little bit",
          emoji: "🤏",
          description: "None is safe for kids.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Say 'No Thanks' and leave",
          emoji: "🚶‍♀️",
          description: "Correct! Be strong and leave.",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What happens if someone drinks too much?",
      options: [
        {
          id: "b",
          text: "They get sick and dizzy",
          emoji: "😵",
          description: "Yes! It makes people unwell.",
          isCorrect: true
        },
        {
          id: "a",
          text: "They get super powers",
          emoji: "🦸",
          description: "Alcohol doesn't give powers.",
          isCorrect: false
        },

        {
          id: "c",
          text: "They fly",
          emoji: "🦅",
          description: "People can't fly.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the best drink for a growing girl?",
      options: [
        {
          id: "a",
          text: "Soda",
          emoji: "🥤",
          description: "Soda has too much sugar.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Water and Milk",
          emoji: "🥛",
          description: "Correct! They make you strong.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Beer",
          emoji: "🍺",
          description: "Beer is bad for kids.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (selectedOptionId) return;

    setSelectedOptionId(optionId);
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setSelectedOptionId(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Alcohol Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={85}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {questions[currentQuestion].text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => {
              const isSelected = selectedOptionId === option.id;
              const showFeedback = selectedOptionId !== null;

              let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";

              if (showFeedback && isSelected) {
                buttonClass = option.isCorrect
                  ? "bg-green-500 ring-4 ring-green-300"
                  : "bg-red-500 ring-4 ring-red-300";
              } else if (showFeedback && !isSelected) {
                buttonClass = "bg-white/10 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${buttonClass}`}
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-6">{option.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 text-white">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white font-medium mt-2 animate-fadeIn">{option.description}</p>
                      )}
                    </div>
                    {showFeedback && isSelected && (
                      <div className="text-3xl ml-4">
                        {option.isCorrect ? "✅" : "❌"}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default AlcoholStory;