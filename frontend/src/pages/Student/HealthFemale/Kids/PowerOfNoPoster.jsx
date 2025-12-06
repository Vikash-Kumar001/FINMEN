import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PowerOfNoPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-66";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What slogan fits a 'Power of No' poster?",
      options: [
        {
          id: "a",
          text: "Say Yes to Everything",
          emoji: "👍",
          description: "That's unsafe.",
          isCorrect: false
        },
        {
          id: "b",
          text: "My Body, My Choice",
          emoji: "💪",
          description: "Yes! You are in charge.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Be Quiet",
          emoji: "🤫",
          description: "No, speak up!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which image shows confidence?",
      options: [
        {
          id: "a",
          text: "Looking at the floor",
          emoji: "⬇️",
          description: "Look people in the eye.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Standing tall with hand out",
          emoji: "✋",
          description: "Correct! That says 'Stop'.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hiding behind a tree",
          emoji: "🌳",
          description: "Hiding isn't confident.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When is it important to say No?",
      options: [
        {
          id: "a",
          text: "When eating vegetables",
          emoji: "🥦",
          description: "Veggies are good for you.",
          isCorrect: false
        },
        {
          id: "b",
          text: "When you feel unsafe",
          emoji: "⚠️",
          description: "Yes! Always trust your gut.",
          isCorrect: true
        },
        {
          id: "c",
          text: "When doing homework",
          emoji: "📚",
          description: "Homework is important.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What does 'Reviewing Choices' mean?",
      options: [
        {
          id: "a",
          text: "Thinking before you act",
          emoji: "🧠",
          description: "Correct! Make smart choices.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Guessing wildly",
          emoji: "🎲",
          description: "Don't just guess with safety.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sleeping",
          emoji: "😴",
          description: "Stay awake to choose well.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who has the power to keep you safe?",
      options: [
        {
          id: "a",
          text: "Only Superman",
          emoji: "🦸‍♂️",
          description: "He's just in movies.",
          isCorrect: false
        },
        {
          id: "b",
          text: "You do!",
          emoji: "🫵",
          description: "Exactly! You have the power.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Your pet cat",
          emoji: "🐱",
          description: "Cats are cute but can't protect you.",
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
      title="Poster: Power of No"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={66}
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

export default PowerOfNoPoster;