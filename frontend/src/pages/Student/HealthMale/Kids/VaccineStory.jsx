import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const VaccineStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-71";
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
      text: "What is a vaccine?",
      options: [
        {
          id: "b",
          text: "A type of candy",
          emoji: "🍬",
          description: "Vaccines are medicine, not treats",
          isCorrect: false
        },
        {
          id: "a",
          text: "A shield against germs",
          emoji: "🛡️",
          description: "Vaccines teach your body how to fight germs",
          isCorrect: true
        },
        {
          id: "c",
          text: "A magic spell",
          emoji: "✨",
          description: "It's science, not magic!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why do we get vaccines?",
      options: [
         {
          id: "a",
          text: "To stay healthy and strong",
          emoji: "💪",
          description: "They protect you from dangerous diseases",
          isCorrect: true
        },
        {
          id: "c",
          text: "To get sick",
          emoji: "🤒",
          description: "Vaccines prevent sickness",
          isCorrect: false
        },
        {
          id: "b",
          text: "Because it's fun",
          emoji: "🎉",
          description: "It's for health, not entertainment",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Does a vaccine hurt?",
      options: [
        {
          id: "b",
          text: "It hurts a lot forever",
          emoji: "😫",
          description: "The pinch only lasts a second",
          isCorrect: false
        },
      
        {
          id: "c",
          text: "It tickles",
          emoji: "😂",
          description: "It feels like a small pinch or scratch",
          isCorrect: false
        },
          {
          id: "a",
          text: "Just a tiny pinch",
          emoji: "🤏",
          description: "It's a quick pinch for long-term protection",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What happens after a vaccine?",
      options: [
         {
          id: "a",
          text: "Your body learns to fight germs",
          emoji: "🧠",
          description: "Your immune system gets smarter",
          isCorrect: true
        },
        {
          id: "c",
          text: "You turn green",
          emoji: "👽",
          description: "You stay your normal color!",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "You can fly",
          emoji: "✈️",
          description: "Vaccines give health, not superpowers",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who helps you get vaccines?",
      options: [
        {
          id: "b",
          text: "The mailman",
          emoji: "✉️",
          description: "Doctors and nurses give vaccines",
          isCorrect: false
        },
        {
          id: "c",
          text: "Your teacher",
          emoji: "👩‍🏫",
          description: "Teachers teach, doctors give medicine",
          isCorrect: false
        },
        {
          id: "a",
          text: "Doctors and nurses",
          emoji: "👨‍⚕️",
          description: "Healthcare professionals keep you safe",
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
    navigate("/student/health-male/kids/quiz-safety");
  };

  return (
    <GameShell
      title="Vaccine Story"
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

export default VaccineStory;
