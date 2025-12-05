import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AcneStoryTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-25";

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
      text: "You wake up with a big pimple on your nose. What do you do?",
      options: [
        {
          id: "b",
          text: "Squeeze it hard",
          emoji: "🤏",
          description: "This causes scarring and infection.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash face gently",
          emoji: "🧼",
          description: "Keep it clean and let it heal.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Cover it with marker",
          emoji: "🖊️",
          description: "That's not a good idea.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says chocolate causes acne. Is it true?",
      options: [
        {
          id: "c",
          text: "Yes, 100%",
          emoji: "🍫",
          description: "Diet plays a part, but it's not the only cause.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Not entirely",
          emoji: "🤷",
          description: "Hormones and oil are the main causes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, chocolate cures acne",
          emoji: "🍬",
          description: "Definitely not true.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is the best way to prevent acne?",
      options: [
        {
          id: "b",
          text: "Never wash your face",
          emoji: "🚫",
          description: "Dirt and oil build up.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Scrub with sandpaper",
          emoji: "🧱",
          description: "Ouch! That damages skin.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Daily gentle cleansing",
          emoji: "💧",
          description: "Removes excess oil and dirt.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You feel embarrassed about your acne.",
      options: [
        {
          id: "c",
          text: "Hide in your room forever",
          emoji: "🏠",
          description: "Don't let it stop your life.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Remember it's normal",
          emoji: "😌",
          description: "Most teens get acne. It passes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wear a mask always",
          emoji: "😷",
          description: "Masks can trap sweat and make it worse.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "When should you see a doctor for acne?",
      options: [
        {
          id: "b",
          text: "For one small pimple",
          emoji: "🔍",
          description: "Over-the-counter wash is usually enough.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never",
          emoji: "❌",
          description: "Doctors can help severe cases.",
          isCorrect: false
        },
        {
          id: "a",
          text: "If it's severe or painful",
          emoji: "👨‍⚕️",
          description: "Dermatologists have treatments.",
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
    navigate("/student/health-male/teens/puberty-awkward-debate-teen");
  };

  return (
    <GameShell
      title="Acne Story"
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

export default AcneStoryTeen;
