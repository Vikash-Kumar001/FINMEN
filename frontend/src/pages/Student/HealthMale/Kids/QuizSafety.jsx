import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizSafety = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-72";
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
      text: "What should you wear when riding a bike?",
      options: [
        {
          id: "a",
          text: "A helmet",
          emoji: "⛑️",
          description: "Helmets protect your brain if you fall",
          isCorrect: true
        },
        {
          id: "b",
          text: "A cool hat",
          emoji: "🧢",
          description: "Hats don't protect your head from falls",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Sunglasses",
          emoji: "🕶️",
          description: "Sunglasses protect eyes, but not your head",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do you do before crossing the street?",
      options: [
        {
          id: "c",
          text: "Run fast",
          emoji: "🏃",
          description: "Running into the street is dangerous",
          isCorrect: false
        },
        {
          id: "a",
          text: "Look left, right, then left again",
          emoji: "👀",
          description: "Always check for cars before crossing",
          isCorrect: true
        },
        {
          id: "b",
          text: "Close your eyes",
          emoji: "🙈",
          description: "You need to see where you are going",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do if you find matches?",
      options: [
        {
          id: "b",
          text: "Play with them",
          emoji: "🔥",
          description: "Matches are dangerous and can start fires",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Hide them",
          emoji: "📦",
          description: "Don't hide them, tell a grown-up",
          isCorrect: false
        },
         {
          id: "a",
          text: "Tell an adult immediately",
          emoji: "👨‍👩‍👧",
          description: "Adults know how to handle dangerous items",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Is it safe to talk to strangers?",
      options: [
        {
          id: "c",
          text: "Yes, if they have candy",
          emoji: "🍬",
          description: "Never take candy from strangers",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, stay with your parents",
          emoji: "🚫",
          description: "Strangers can be dangerous - stay close to family",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, if they look nice",
          emoji: "😊",
          description: "You can't tell if someone is safe just by looking",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What do you do in a car?",
      options: [
        {
          id: "b",
          text: "Jump around",
          emoji: "🤾",
          description: "Moving around in a car is unsafe",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stick head out window",
          emoji: "🌬️",
          description: "Keep all body parts inside the car",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wear your seatbelt",
          emoji: "🚗",
          description: "Seatbelts keep you safe in case of a stop",
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
    navigate("/student/health-male/kids/reflex-safety");
  };

  return (
    <GameShell
      title="Safety Quiz"
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

export default QuizSafety;
