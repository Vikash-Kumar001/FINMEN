import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NightSweatStory = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-45";

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
      text: "You wake up sweaty in the middle of the night. What happened?",
      options: [
        {
          id: "b",
          text: "The bed is on fire",
          emoji: "🔥",
          description: "Hopefully not!",
          isCorrect: false
        },
      
        {
          id: "c",
          text: "You peed the bed",
          emoji: "🛏️",
          description: "Sweat feels different.",
          isCorrect: false
        },
          {
          id: "a",
          text: "Night sweats / Overheating",
          emoji: "🥵",
          description: "Common during puberty or if room is hot.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What should you wear to sleep?",
      options: [
        {
          id: "c",
          text: "Winter coat",
          emoji: "🧥",
          description: "Too hot!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Breathable cotton",
          emoji: "👕",
          description: "Lets skin breathe.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Plastic suit",
          emoji: "🛍️",
          description: "Traps heat.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your sheets are damp. What to do?",
      options: [
         {
          id: "a",
          text: "Change sheets",
          emoji: "🛏️",
          description: "Keep bed clean and dry.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sleep on floor",
          emoji: "🧱",
          description: "Uncomfortable.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Flip pillow only",
          emoji: "🔄",
          description: "Sheets are still dirty.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Should you shower in the morning if you sweat at night?",
      options: [
        {
          id: "c",
          text: "No, save water",
          emoji: "💧",
          description: "Hygiene is important.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only if going out",
          emoji: "🏠",
          description: "Feel fresh for yourself too.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, wash off sweat",
          emoji: "🚿",
          description: "Start the day fresh.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Is it normal to sweat at night?",
      options: [
        {
          id: "b",
          text: "Never",
          emoji: "❌",
          description: "It happens.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, especially in puberty",
          emoji: "📈",
          description: "Hormones can cause temperature changes.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when sick",
          emoji: "🤒",
          description: "Sickness causes it too, but not only.",
          isCorrect: false
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
    navigate("/student/health-male/teens/hygiene-confidence-debate-46");
  };

  return (
    <GameShell
      title="Night Sweat Story"
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

export default NightSweatStory;
