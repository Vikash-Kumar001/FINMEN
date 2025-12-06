import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizHygiene = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-42";

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
      text: "How often should you change your underwear?",
      options: [
         {
          id: "a",
          text: "Every day",
          emoji: "🩲",
          description: "Keeps you fresh and clean.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Every week",
          emoji: "🗓️",
          description: "That's unhygienic.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "When it smells",
          emoji: "🤢",
          description: "Change before it smells.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What causes foot odor?",
      options: [
        {
          id: "c",
          text: "Walking too fast",
          emoji: "🚶",
          description: "Speed doesn't cause smell.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Bacteria and sweat",
          emoji: "🦠",
          description: "Bacteria love damp, dark shoes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Large feet",
          emoji: "🦶",
          description: "Size doesn't matter.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How long should you brush your teeth?",
      options: [
        {
          id: "b",
          text: "10 seconds",
          emoji: "⏱️",
          description: "Too short.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Until they hurt",
          emoji: "😖",
          description: "Don't hurt yourself.",
          isCorrect: false
        },
         {
          id: "a",
          text: "2 minutes",
          emoji: "🦷",
          description: "Recommended by dentists.",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Why should you trim your nails?",
      options: [
        {
          id: "c",
          text: "To stop them growing",
          emoji: "🛑",
          description: "They will keep growing.",
          isCorrect: false
        },
        {
          id: "b",
          text: "To look scary",
          emoji: "🧛",
          description: "Not the goal.",
          isCorrect: false
        },
        {
          id: "a",
          text: "To prevent dirt buildup",
          emoji: "💅",
          description: "Dirt hides under long nails.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What is the best way to wash your hands?",
      options: [
         {
          id: "a",
          text: "Soap and water for 20s",
          emoji: "🧼",
          description: "Kills germs effectively.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Water only",
          emoji: "💧",
          description: "Doesn't kill germs.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wipe on pants",
          emoji: "👖",
          description: "Adds more dirt.",
          isCorrect: false
        },
       
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
    navigate("/student/health-male/teens/reflex-smart-hygiene-43");
  };

  return (
    <GameShell
      title="Quiz on Hygiene"
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

export default QuizHygiene;
