import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanlinessQuiz = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-2";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "How often should you brush your teeth?",
      options: [
        {
          id: "a",
          text: "Once a week",
          emoji: "📅",
          description: "Teeth need more frequent cleaning to stay healthy",
          isCorrect: false
        },
        {
          id: "b",
          text: "Twice a day",
          emoji: "🦷",
          description: "Great job! Brushing twice daily keeps teeth clean and healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when they hurt",
          emoji: "😣",
          description: "Don't wait for pain - brush regularly to prevent problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to keep your nails clean?",
      options: [
        {
          id: "a",
          text: "Bite them short",
          emoji: "😬",
          description: "Biting nails can spread germs and damage them",
          isCorrect: false
        },
        {
          id: "b",
          text: "Never cut them",
          emoji: "✋",
          description: "Long nails can trap dirt and germs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Trim and clean them regularly",
          emoji: "✂️",
          description: "Perfect! Clean, trimmed nails look nice and stay healthy",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "When should you take a bath or shower?",
      options: [
        {
          id: "a",
          text: "Every day",
          emoji: "🚿",
          description: "Great! Daily cleaning keeps your skin healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once a month",
          emoji: "📅",
          description: "That's not often enough to stay clean",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when someone tells me to",
          emoji: "🤔",
          description: "Be responsible for your own hygiene",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do after playing outside?",
      options: [
        {
          id: "a",
          text: "Wipe hands on clothes",
          emoji: "👕",
          description: "That just spreads dirt to your clothes",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands with soap",
          emoji: "🧼",
          description: "Perfect! Washing removes dirt and germs",
          isCorrect: true
        },
        {
          id: "c",
          text: "Rub hands in hair",
          emoji: "💁",
          description: "That just makes your hair dirty too",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How often should you change your clothes?",
      options: [
        {
          id: "a",
          text: "When they stand up by themselves",
          emoji: "😷",
          description: "That's way too long to wear the same clothes!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Once a week",
          emoji: "📅",
          description: "Clothes should be changed more often than that",
          isCorrect: false
        },
        {
          id: "c",
          text: "Every day",
          emoji: "👕",
          description: "Clean clothes help keep you fresh and healthy",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (choices.some(c => c.question === currentQuestion)) return;

    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + coinsPerLevel);
      showCorrectAnswerFeedback(coinsPerLevel, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
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

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Cleanliness Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-female/kids"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-blue-500/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">Question {currentQuestion + 1}/{questions.length}</span>
            </div>
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
            </div>
          </div>

          <div className="text-center my-8">
            <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
              {currentQ.text}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {currentQ.options.map((option) => {
              const feedback = choices.find(c => c.question === currentQuestion);
              const isSelected = feedback?.optionId === option.id;
              const isCorrect = option.isCorrect;
              const showFeedback = !!feedback;

              let buttonStyle = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";
              if (showFeedback) {
                if (isCorrect) buttonStyle = "bg-green-500 ring-4 ring-green-300";
                else if (isSelected) buttonStyle = "bg-red-500 ring-4 ring-red-300";
                else buttonStyle = "bg-gray-500 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] text-left text-white ${buttonStyle}`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{option.emoji}</span>
                    <div>
                      <div className="font-medium text-lg">{option.text}</div>
                      {showFeedback && (isSelected || isCorrect) && (
                        <p className="text-sm mt-2 font-medium text-white/90 bg-black/20 p-2 rounded">
                          {option.description}
                        </p>
                      )}
                    </div>
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

export default CleanlinessQuiz;
