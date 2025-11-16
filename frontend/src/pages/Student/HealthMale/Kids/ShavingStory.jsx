import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShavingStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You see facial hair growing. Should you learn safe shaving?",
      options: [
        {
          id: "b",
          text: "No, ignore it",
          emoji: "🙈",
          description: "Learning safe grooming is important for hygiene",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, learn properly",
          emoji: "✂️",
          description: "Safe shaving prevents cuts and keeps skin healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Use any sharp object",
          emoji: "🔪",
          description: "Safe tools and techniques are important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your dad shows you how to shave. What do you do?",
      options: [
        {
          id: "a",
          text: "Watch and learn carefully",
          emoji: "👀",
          description: "Learning from parents helps you stay safe",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try it alone first",
          emoji: "🧑‍🦰",
          description: "Start with adult supervision for safety",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say you don't need it",
          emoji: "🙅",
          description: "Everyone needs to learn proper grooming",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You cut yourself while shaving. What's the right response?",
      options: [
        {
          id: "c",
          text: "Keep shaving",
          emoji: "🩸",
          description: "Stop and clean the cut properly",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hide the cut",
          emoji: "🤐",
          description: "Clean cuts properly and ask for help if needed",
          isCorrect: false
        },
        {
          id: "a",
          text: "Clean it and use antiseptic",
          emoji: "🩹",
          description: "Proper wound care prevents infection",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How often should you change your razor blade?",
      options: [
        {
          id: "b",
          text: "Never, use forever",
          emoji: "♻️",
          description: "Dull blades can cause cuts and irritation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when it breaks",
          emoji: "💔",
          description: "Regular blade changes prevent skin problems",
          isCorrect: false
        },
        {
          id: "a",
          text: "Every few uses",
          emoji: "🔄",
          description: "Fresh blades give smoother, safer shaves",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You feel embarrassed about facial hair. What helps?",
      options: [
        {
          id: "b",
          text: "Avoid mirrors",
          emoji: "🙈",
          description: "Learning proper grooming builds confidence",
          isCorrect: false
        },
        {
          id: "a",
          text: "Learn proper grooming",
          emoji: "💇",
          description: "Good hygiene habits make you feel confident",
          isCorrect: true
        },
        {
          id: "c",
          text: "Compare with friends",
          emoji: "👥",
          description: "Everyone develops at their own pace",
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
    navigate("/student/health-male/kids/stay-fresh-poster");
  };

  return (
    <GameShell
      title="Shaving Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-kids-45"
      gameType="health-male"
      totalLevels={50}
      currentLevel={45}
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
            <div className="text-5xl mb-4">💇</div>
            <h3 className="text-2xl font-bold text-white mb-2">Safe Grooming</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default ShavingStory;
