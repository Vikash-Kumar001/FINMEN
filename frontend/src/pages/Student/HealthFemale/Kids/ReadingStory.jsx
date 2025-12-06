import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReadingStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-98";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Why is reading every day good for you?",
      options: [
        {
          id: "a",
          text: "It makes you sleepy",
          emoji: "😴",
          description: "Reading wakes up your brain!",
          isCorrect: false
        },
        {
          id: "b",
          text: "It makes you smarter and more creative",
          emoji: "🧠",
          description: "Yes! Books are food for the brain.",
          isCorrect: true
        },
        {
          id: "c",
          text: "It hurts your eyes",
          emoji: "🫣",
          description: "Good lighting makes reading safe.",
          isCorrect: false
        },
      ]
    },
    {
      id: 2,
      text: "What if you find a word you don't know?",
      options: [
        {
          id: "a",
          text: "Throw the book away",
          emoji: "🗑️",
          description: "Never throw books!",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Skip the whole page",
          emoji: "⏭️",
          description: "You might miss important parts.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask an adult or look it up",
          emoji: "📖",
          description: "Correct! That's how we learn new words.",
          isCorrect: true
        },
        
      ]
    },
    {
      id: 3,
      text: "Reading before bed helps you...",
      options: [
        {
          id: "a",
          text: "Stay awake all night",
          emoji: "👀",
          description: "Reading helps you relax.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Relax and sleep better",
          emoji: "🌙",
          description: "Yes! It calms your mind.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Get a headache",
          emoji: "🤕",
          description: "Not if you have a light on.",
          isCorrect: false
        },
       
      ]
    },
    {
      id: 4,
      text: "Stories can take you...",
      options: [
        {
          id: "b",
          text: "Anywhere in the universe!",
          emoji: "🚀",
          description: "Correct! Imagination has no limits.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Nowhere",
          emoji: "🛑",
          description: "Stories travel everywhere.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Only to the store",
          emoji: "🏪",
          description: "Much further than that.",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 5,
      text: "Who can be your best friend when you are alone?",
      options: [
        {
          id: "a",
          text: "A good book",
          emoji: "📘",
          description: "Yes! Books are great company.",
          isCorrect: true
        },
        {
          id: "b",
          text: "A loud noise",
          emoji: "🔊",
          description: "Noise isn't a friend.",
          isCorrect: false
        },
        {
          id: "c",
          text: "A broken toy",
          emoji: "🧸",
          description: "Books are better.",
          isCorrect: false
        },
       
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
      title="Reading Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={98}
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

export default ReadingStory;