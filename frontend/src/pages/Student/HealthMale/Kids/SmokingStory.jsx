import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SmokingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-81";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What does smoking do to your lungs?",
      options: [
        {
          id: "a",
          text: "Makes them black and sick",
          emoji: "🫁",
          description: "Smoking fills lungs with tar and bad stuff",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes them stronger",
          emoji: "💪",
          description: "Smoking hurts your lungs and makes it hard to breathe",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Makes them smell like flowers",
          emoji: "🌸",
          description: "Smoking makes everything smell bad",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "If someone offers you a cigarette, what do you say?",
      options: [
        {
          id: "c",
          text: "Maybe later",
          emoji: "🤔",
          description: "You should always say no clearly",
          isCorrect: false
        },
        {
          id: "a",
          text: "No thanks, I want to be healthy",
          emoji: "✋",
          description: "Saying no keeps your body safe",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, I'll try it",
          emoji: "🚬",
          description: "Never try smoking, it's very dangerous",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is smoking bad for sports?",
      options: [
        {
          id: "b",
          text: "It makes you run too fast",
          emoji: "🏃",
          description: "Smoking makes you slower, not faster",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "It makes the ball slippery",
          emoji: "⚽",
          description: "Smoking hurts your body, not the ball",
          isCorrect: false
        },
        {
          id: "a",
          text: "You run out of breath easily",
          emoji: "😮‍💨",
          description: "Your lungs need clean air to run and play",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What is in a cigarette?",
      options: [
        {
          id: "c",
          text: "Vitamins",
          emoji: "💊",
          description: "Cigarettes have poisons, not vitamins",
          isCorrect: false
        },
        {
          id: "a",
          text: "Dangerous poisons",
          emoji: "☠️",
          description: "There are many harmful chemicals in cigarettes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Candy",
          emoji: "🍬",
          description: "Cigarettes are not a treat",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How do you stay smoke-free?",
      options: [
        {
          id: "b",
          text: "Hang out with smokers",
          emoji: "👥",
          description: "Stay away from smoke to be healthy",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try it once",
          emoji: "1️⃣",
          description: "Don't even try it once!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Choose healthy friends and habits",
          emoji: "🌟",
          description: "Good friends help you make good choices",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/quiz-substances");
  };

  return (
    <GameShell
      title="Smoking Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default SmokingStory;
