import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MoodChangeStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-87";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel happy one minute, then sad the next.",
      options: [
        {
          id: "a",
          text: "Think you are broken",
          emoji: "🤯",
          description: "You are not broken.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Know it's normal growing up feelings",
          emoji: "😌",
          description: "Correct! Moods change as you grow.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Yell at everyone",
          emoji: "🤬",
          description: "Try to stay calm.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You feel like crying for no big reason.",
      options: [
        {
          id: "a",
          text: "Hold it in tight",
          emoji: "🤐",
          description: "Letting it out helps.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Find a quiet place and let it out",
          emoji: "😢",
          description: "Yes! Crying is okay.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Cry in class loudly",
          emoji: "🏫",
          description: "Try to find a private spot.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel angry about a small thing.",
      options: [
        {
          id: "a",
          text: "Take a deep breath and count to 10",
          emoji: "🧘‍♀️",
          description: "Correct! Calm down first.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Throw toys",
          emoji: "🧸",
          description: "Don't break things.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hit someone",
          emoji: "👊",
          description: "Never hit.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You feel confused about changing feelings.",
      options: [
        {
          id: "a",
          text: "Talk to a parent or teacher",
          emoji: "🗣️",
          description: "Yes! Sharing helps.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep it a secret",
          emoji: "🤫",
          description: "Do not keep feelings secret.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask a stranger",
          emoji: "❓",
          description: "Ask someone you trust.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Are feelings good or bad?",
      options: [
        {
          id: "a",
          text: "Only happy is good",
          emoji: "🙂",
          description: "All feelings are okay.",
          isCorrect: false
        },
        {
          id: "b",
          text: "All feelings are okay to feel",
          emoji: "🌈",
          description: "Correct! Feelings are natural.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Feelings are scary",
          emoji: "👻",
          description: "Don't be scared of feelings.",
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
      title="Mood Change Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={87}
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

export default MoodChangeStory;