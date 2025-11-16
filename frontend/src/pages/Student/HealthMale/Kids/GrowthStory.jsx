import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowthStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Boys' and girls' bodies change differently during puberty.",
      options: [
        {
          id: "b",
          text: "False",
          emoji: "❌",
          description: "Boys and girls do experience different changes",
          isCorrect: false
        },
        {
          id: "a",
          text: "True",
          emoji: "✅",
          description: "Each gender has unique growth patterns and changes",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only sometimes",
          emoji: "🤷",
          description: "Body changes are different for boys and girls",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You notice a girl in your class is growing taller than boys. Is this normal?",
      options: [
        {
          id: "a",
          text: "Yes, growth rates vary",
          emoji: "📏",
          description: "Everyone grows at their own pace and time",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, something's wrong",
          emoji: "😟",
          description: "Different growth patterns are completely normal",
          isCorrect: false
        },
        {
          id: "c",
          text: "She should stop growing",
          emoji: "🛑",
          description: "Growth is natural and should not be stopped",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend starts showing different body changes than you. How do you respond?",
      options: [
        {
          id: "c",
          text: "Make fun of them",
          emoji: "😈",
          description: "All body changes should be respected",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell them to stop",
          emoji: "🛑",
          description: "Body changes are natural and can't be controlled",
          isCorrect: false
        },
        {
          id: "a",
          text: "Support and understand",
          emoji: "🤝",
          description: "Being supportive helps everyone feel normal",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You learn that some changes happen faster for some kids. What does this mean?",
      options: [
        {
          id: "b",
          text: "Someone is doing something wrong",
          emoji: "😠",
          description: "Different timing is completely normal",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only popular kids change first",
          emoji: "👑",
          description: "Body changes happen when the body is ready",
          isCorrect: false
        },
        {
          id: "a",
          text: "Everyone develops uniquely",
          emoji: "🌱",
          description: "Each person has their own development timeline",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You see different body shapes in your class. How do you feel?",
      options: [
        {
          id: "b",
          text: "Worried about differences",
          emoji: "😰",
          description: "Body diversity is beautiful and normal",
          isCorrect: false
        },
        {
          id: "a",
          text: "Everyone is unique and normal",
          emoji: "🌟",
          description: "All body types and changes are natural",
          isCorrect: true
        },
        {
          id: "c",
          text: "Want everyone to look the same",
          emoji: "🤖",
          description: "Individual differences make us special",
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
    navigate("/student/health-male/kids/reflex-safe-body");
  };

  return (
    <GameShell
      title="Growth Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-kids-38"
      gameType="health-male"
      totalLevels={40}
      currentLevel={38}
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
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Body Differences</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default GrowthStory;
