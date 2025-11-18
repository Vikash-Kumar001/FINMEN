import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SweatControlStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "After playing football, you are sweating a lot. What should you do?",
      options: [
        {
          id: "a",
          text: "Wait until tomorrow",
          emoji: "⏰",
          description: "Sweat can lead to bacteria and skin issues if not addressed",
          isCorrect: false
        },
        {
          id: "b",
          text: "Shower immediately",
          emoji: "🚿",
          description: "Showering after sports removes sweat and prevents odor",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just change shirt",
          emoji: "👕",
          description: "Showering is essential after sweating",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During a basketball game, you notice sweat dripping. Best action?",
      options: [
        {
          id: "a",
          text: "Shower after the game",
          emoji: "🛁",
          description: "Post-game shower is crucial for skin health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Continue playing without care",
          emoji: "🏀",
          description: "Ignoring sweat can affect performance and hygiene",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use only deodorant",
          emoji: "🧴",
          description: "Deodorant helps, but showering is necessary",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You finish gym class sweating heavily. What should you do before next class?",
      options: [
        {
          id: "a",
          text: "Use deodorant only",
          emoji: "🧴",
          description: "Deodorant helps but full hygiene is better",
          isCorrect: false
        },
        {
          id: "b",
          text: "Just change shirt quickly",
          emoji: "👕",
          description: "Need full body cleaning after intense activity",
          isCorrect: false
        },
        {
          id: "c",
          text: "Shower and change completely",
          emoji: "🧼",
          description: "Complete hygiene routine prevents sweat issues",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "After outdoor sports in hot weather, you feel very sweaty. Best approach?",
      options: [
        {
          id: "a",
          text: "Wipe face with towel and continue",
          emoji: "🧖",
          description: "Need to clean entire body after sweating",
          isCorrect: false
        },
        {
          id: "b",
          text: "Just change clothes",
          emoji: "👕",
          description: "Skin needs proper cleaning after sweating",
          isCorrect: false
        },
        {
          id: "c",
          text: "Take a thorough shower",
          emoji: "🚿",
          description: "Complete cleaning is important after sweating",
          isCorrect: true
        }
      ]
    },
    {
      id: 6,
      text: "You have PE first period and then a test. You're sweaty. What do you do?",
      options: [
        {
          id: "a",
          text: "Use wet wipes only",
          emoji: "🧻",
          description: "Showering is more effective than wipes",
          isCorrect: false
        },
        {
          id: "b",
          text: "Quick shower before test",
          emoji: "⏱️",
          description: "Quick cleanup helps you feel fresh and focused",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just sit for the test as is",
          emoji: "💺",
          description: "Being fresh helps with concentration",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
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
    navigate("/student/health-male/teens/quiz-hygiene");
  };

  return (
    <GameShell
      title="Sweat Control Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-41"
      gameType="health-male"
      totalLevels={70}
      currentLevel={41}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default SweatControlStory;
