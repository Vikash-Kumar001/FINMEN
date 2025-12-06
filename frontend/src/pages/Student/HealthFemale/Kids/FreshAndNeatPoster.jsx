import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const FreshAndNeatPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-6"; // Match key in index.js

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which poster encourages washing hands?",
      options: [
        {
          id: 'a',
          title: "Clean Hands Save Lives",
          emoji: "🧼",
          description: "Wash often to kill germs!",
          isCorrect: true
        },
        {
          id: 'b',
          title: "Dirty Hands Are Fine",
          emoji: "🦠",
          description: "Germs are our friends, right?",
          isCorrect: false
        },
        {
          id: 'c',
          title: "Only Water Works",
          emoji: "💧",
          description: "No need for soap, just water.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which message is best for daily hygiene?",
      options: [
        {
          id: 'a',
          title: "Bath Once a Year",
          emoji: "📅",
          description: "Save water, stay dirty!",
          isCorrect: false
        },
        {
          id: 'b',
          title: "Shower Power",
          emoji: "🚿",
          description: "Take a bath every day to stay fresh!",
          isCorrect: true
        },
        {
          id: 'c',
          title: "Perfume Over Bath",
          emoji: "🌸",
          description: "Just spray and pray!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which poster promotes dental health?",
      options: [
        {
          id: 'a',
          title: "Sugar Rush",
          emoji: "🍭",
          description: "Eat candy all day long!",
          isCorrect: false
        },
        {
          id: 'b',
          title: "No Brushing Needed",
          emoji: "😷",
          description: "Teeth clean themselves, right?",
          isCorrect: false
        },
        {
          id: 'c',
          title: "Brush Twice Daily",
          emoji: "🪥",
          description: "Keep that smile bright and clean!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Which poster shows good nail care?",
      options: [
        {
          id: 'a',
          title: "Trim & Clean",
          emoji: "✂️",
          description: "Keep nails short and neat.",
          isCorrect: true
        },
        {
          id: 'b',
          title: "Bite Your Nails",
          emoji: "😬",
          description: "A tasty snack for later?",
          isCorrect: false
        },
        {
          id: 'c',
          title: "Long & Dirty",
          emoji: "🧟‍♀️",
          description: "Let them grow wild!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which poster is about clean clothes?",
      options: [
        {
          id: 'a',
          title: "Wear It Twice",
          emoji: "👃",
          description: "Smells fine to me!",
          isCorrect: false
        },
        {
          id: 'b',
          title: "Fresh Clothes Daily",
          emoji: "👕",
          description: "Change into clean clothes every day.",
          isCorrect: true
        },
        {
          id: 'c',
          title: "Sleep in Uniform",
          emoji: "💤",
          description: "Save time in the morning!",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (option) => {
    if (showFeedback) return;

    setSelectedOptionId(option.id);
    setShowFeedback(true);

    if (option.isCorrect) {
      setScore(prev => prev + coinsPerLevel);
      showCorrectAnswerFeedback(coinsPerLevel, true);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOptionId(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameCompleted(true);
        showAnswerConfetti();
      }
    }, 2000);
  };

  const currentQ = questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Fresh & Neat Posters"
      subtitle={`Poster ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameCompleted}
      showGameOver={gameCompleted}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={gameCompleted}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{currentQ.text}</h2>
            <div className="text-yellow-400 font-bold">Coins: {score}/{totalCoins}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.isCorrect;

              let cardStyle = "bg-white/5 border-white/10 hover:bg-white/10";
              if (showFeedback) {
                if (isCorrect) cardStyle = "bg-green-500/20 border-green-500 ring-2 ring-green-400";
                else if (isSelected) cardStyle = "bg-red-500/20 border-red-500 ring-2 ring-red-400";
                else cardStyle = "opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={showFeedback}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${cardStyle}`}
                >
                  <div className="text-6xl mb-4">{option.emoji}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{option.title}</h3>
                  <p className="text-sm text-white/80 text-center">{option.description}</p>

                  {showFeedback && (isSelected || isCorrect) && (
                    <div className={`mt-4 px-3 py-1 rounded-full text-sm font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isCorrect ? 'Correct Poster!' : 'Not quite right...'}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default FreshAndNeatPoster;
