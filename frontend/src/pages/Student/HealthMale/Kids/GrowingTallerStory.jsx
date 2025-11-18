import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowingTallerStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice you're taller than last year. Is this normal growth?",
      options: [
        {
          id: "b",
          text: "No, something's wrong",
          emoji: "😟",
          description: "Growing taller is completely normal during childhood",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, it's normal",
          emoji: "✅",
          description: "Children grow taller every year as they develop",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only sometimes",
          emoji: "🤷",
          description: "Growth is a natural part of growing up",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your clothes don't fit anymore. What should you do?",
      options: [
        {
          id: "a",
          text: "Get new bigger clothes",
          emoji: "👕",
          description: "Getting new clothes is the right response to growth",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop growing",
          emoji: "🛑",
          description: "You can't control natural growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wear tight clothes",
          emoji: "😣",
          description: "Tight clothes are uncomfortable and restrict movement",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You grow faster than your friends. Should you worry?",
      options: [
        {
          id: "c",
          text: "Tell them to grow faster",
          emoji: "📏",
          description: "Everyone grows at their own pace",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, it's a problem",
          emoji: "😰",
          description: "Different growth rates are completely normal",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, everyone grows differently",
          emoji: "🌱",
          description: "Each child has their own unique growth pattern",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your shoes are too small. What does this mean?",
      options: [
        {
          id: "b",
          text: "Your feet are shrinking",
          emoji: "🦶",
          description: "Feet only grow bigger, never smaller",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing important",
          emoji: "😴",
          description: "This shows you're growing and need new shoes",
          isCorrect: false
        },
        {
          id: "a",
          text: "You're growing taller",
          emoji: "📈",
          description: "Growing feet are a sign of normal development",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You need to measure your height for school. How do you feel?",
      options: [
        {
          id: "b",
          text: "Scared of the results",
          emoji: "😨",
          description: "Height measurement is just to track normal growth",
          isCorrect: false
        },
        {
          id: "a",
          text: "Excited to see growth",
          emoji: "😊",
          description: "It's exciting to see how much you've grown",
          isCorrect: true
        },
        {
          id: "c",
          text: "Don't care at all",
          emoji: "😐",
          description: "Growth tracking helps understand development",
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
    navigate("/student/health-male/kids/quiz-growth");
  };

  return (
    <GameShell
      title="Growing Taller Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-kids-21"
      gameType="health-male"
      totalLevels={30}
      currentLevel={21}
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
            <div className="text-5xl mb-4">📏</div>
            <h3 className="text-2xl font-bold text-white mb-2">Growth Stories</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default GrowingTallerStory;
