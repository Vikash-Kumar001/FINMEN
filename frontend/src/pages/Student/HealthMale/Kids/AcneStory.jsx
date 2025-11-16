import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AcneStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You get pimples on your face. Best step?",
      options: [
        {
          id: "b",
          text: "Squeeze them",
          emoji: "🤏",
          description: "Squeezing can make pimples worse and cause scars",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash face gently, don't squeeze",
          emoji: "🧴",
          description: "Gentle washing helps without damaging skin",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them",
          emoji: "😴",
          description: "Gentle care helps pimples heal properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have acne. What should you use?",
      options: [
        {
          id: "a",
          text: "Gentle face wash",
          emoji: "🧼",
          description: "Gentle cleansers help without drying skin",
          isCorrect: true
        },
        {
          id: "b",
          text: "Any soap",
          emoji: "🧽",
          description: "Face needs special gentle care",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing",
          emoji: "❌",
          description: "Clean face daily prevents more breakouts",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Pimples hurt when you touch them. What do you do?",
      options: [
        {
          id: "c",
          text: "Keep touching them",
          emoji: "👆",
          description: "Touching spreads bacteria and makes it worse",
          isCorrect: false
        },
        {
          id: "b",
          text: "Pop them open",
          emoji: "💥",
          description: "Popping can cause infection and scarring",
          isCorrect: false
        },
        {
          id: "a",
          text: "Leave them alone",
          emoji: "🙌",
          description: "Letting them heal naturally is best",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your acne gets worse. Should you worry?",
      options: [
        {
          id: "b",
          text: "Yes, it's permanent",
          emoji: "😰",
          description: "Most acne improves with proper care",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hide your face",
          emoji: "🙈",
          description: "Acne is common and treatable",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk to trusted adult",
          emoji: "👨‍👦",
          description: "Adults can help find the right skin care",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You want clear skin. What's most important?",
      options: [
        {
          id: "b",
          text: "Expensive products",
          emoji: "💰",
          description: "Gentle daily care is more important than cost",
          isCorrect: false
        },
        {
          id: "a",
          text: "Daily gentle washing",
          emoji: "🧴",
          description: "Consistent gentle care gives best results",
          isCorrect: true
        },
        {
          id: "c",
          text: "Magic cream",
          emoji: "✨",
          description: "Patience and proper care work best",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(5, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/kids/reflex-freshness");
  };

  return (
    <GameShell
      title="Acne Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-kids-48"
      gameType="health-male"
      totalLevels={50}
      currentLevel={48}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Story {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 5}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧴</div>
            <h3 className="text-2xl font-bold text-white mb-2">Skin Care Choices</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default AcneStory;
