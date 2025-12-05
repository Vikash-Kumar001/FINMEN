import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SicknessStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-75";
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
      text: "You wake up feeling hot and tired. What should you do?",
      options: [
        {
          id: "b",
          text: "Go to school anyway",
          emoji: "🏫",
          description: "You might make others sick",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Eat lots of candy",
          emoji: "🍬",
          description: "Candy won't help you feel better",
          isCorrect: false
        },
         {
          id: "a",
          text: "Tell a parent you feel sick",
          emoji: "🤒",
          description: "Parents can help you get better",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "You have a runny nose. What do you need?",
      options: [
        {
          id: "c",
          text: "Your sleeve",
          emoji: "👕",
          description: "Using your sleeve spreads germs",
          isCorrect: false
        },
        {
          id: "a",
          text: "A tissue",
          emoji: "🤧",
          description: "Tissues catch germs so you can throw them away",
          isCorrect: true
        },
        {
          id: "b",
          text: "A towel",
          emoji: "🧖",
          description: "Towels are for drying off after a bath",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The doctor gives you medicine. What do you do?",
      options: [
        {
          id: "a",
          text: "Take it exactly as told",
          emoji: "💊",
          description: "Medicine helps your body fight sickness",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide it",
          emoji: "🙈",
          description: "Medicine only works if you take it",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Give it to your pet",
          emoji: "🐕",
          description: "Medicine is only for the person who is sick",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps you get better when you are sick?",
      options: [
        {
          id: "c",
          text: "Playing video games all night",
          emoji: "🎮",
          description: "You need sleep to heal",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "Running around",
          emoji: "🏃",
          description: "Running uses up energy you need for healing",
          isCorrect: false
        },
         {
          id: "a",
          text: "Rest and sleep",
          emoji: "😴",
          description: "Sleep gives your body energy to heal",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "How do you stop germs from spreading?",
      options: [
        {
          id: "b",
          text: "Touch everything",
          emoji: "👆",
          description: "Touching things spreads germs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cough on friends",
          emoji: "🗣️",
          description: "Never cough on others!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash your hands often",
          emoji: "🧼",
          description: "Washing hands kills germs",
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
    navigate("/student/health-male/kids/prevention-first-poster");
  };

  return (
    <GameShell
      title="Sickness Story"
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

export default SicknessStory;
