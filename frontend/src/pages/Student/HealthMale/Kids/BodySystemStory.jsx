import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BodySystemStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teacher says: 'Boys and girls have different body systems.' What do you say?",
      options: [
        {
          id: "b",
          text: "No, they're the same",
          emoji: "🤷",
          description: "Boys and girls have some different body systems",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, that's right",
          emoji: "✅",
          description: "Different body systems help boys and girls grow differently",
          isCorrect: true
        },
        {
          id: "c",
          text: "I don't know",
          emoji: "🤔",
          description: "Learning about body differences is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You learn that hearts pump blood. How do you feel?",
      options: [
        {
          id: "a",
          text: "Fascinated",
          emoji: "🤩",
          description: "Learning how body works is amazing",
          isCorrect: true
        },
        {
          id: "b",
          text: "Scared",
          emoji: "😨",
          description: "Body systems are normal and healthy",
          isCorrect: false
        },
        {
          id: "c",
          text: "Bored",
          emoji: "😴",
          description: "Understanding body helps you stay healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see a diagram of lungs. What do they do?",
      options: [
        {
          id: "c",
          text: "Pump blood",
          emoji: "❤️",
          description: "Lungs help us breathe oxygen",
          isCorrect: false
        },
        {
          id: "b",
          text: "Think thoughts",
          emoji: "🧠",
          description: "Brain thinks, lungs breathe",
          isCorrect: false
        },
        {
          id: "a",
          text: "Help us breathe",
          emoji: "🫁",
          description: "Lungs bring oxygen into our body",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Teacher explains organs work together. What does this mean?",
      options: [
        {
          id: "b",
          text: "They fight each other",
          emoji: "⚔️",
          description: "Organs cooperate to keep body healthy",
          isCorrect: false
        },
        {
          id: "c",
          text: "They work separately",
          emoji: "🔄",
          description: "Body systems work together as a team",
          isCorrect: false
        },
        {
          id: "a",
          text: "They help each other",
          emoji: "🤝",
          description: "All organs work together for body health",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You learn about the digestive system. How does it help?",
      options: [
        {
          id: "b",
          text: "Makes us taller",
          emoji: "📏",
          description: "Digestion helps turn food into energy",
          isCorrect: false
        },
        {
          id: "a",
          text: "Turns food into energy",
          emoji: "⚡",
          description: "Digestive system breaks down food for body use",
          isCorrect: true
        },
        {
          id: "c",
          text: "Helps us sleep",
          emoji: "😴",
          description: "Digestion provides nutrients for all body functions",
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
    navigate("/student/health-male/kids/quiz-body-functions");
  };

  return (
    <GameShell
      title="Body System Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-kids-31"
      gameType="health-male"
      totalLevels={40}
      currentLevel={31}
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
            <div className="text-5xl mb-4">🫀</div>
            <h3 className="text-2xl font-bold text-white mb-2">Body Systems</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default BodySystemStory;
