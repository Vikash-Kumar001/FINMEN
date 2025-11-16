import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NightSweatStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You wake up with night sweats during puberty. What should you do?",
      options: [
        {
          id: "a",
          text: "Shower before bed",
          emoji: "🚿",
          description: "Showering helps manage night sweats and improves sleep",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore and go back to sleep",
          emoji: "😴",
          description: "Night sweats should be addressed for hygiene",
          isCorrect: false
        },
        {
          id: "c",
          text: "Change sheets only",
          emoji: "🛏️",
          description: "Personal hygiene is also important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Night sweats make your clothes wet. Best response?",
      options: [
        {
          id: "a",
          text: "Shower and change clothes",
          emoji: "🧼",
          description: "Clean body and clothes prevent odor and bacteria",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go back to sleep",
          emoji: "😴",
          description: "Hygiene should be maintained",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just change clothes",
          emoji: "👕",
          description: "Showering is necessary after sweating",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "After night sweats, how to prevent future issues?",
      options: [
        {
          id: "a",
          text: "Use heavy blankets",
          emoji: "🛏️",
          description: "Light bedding helps regulate temperature",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore it as normal",
          emoji: "🤷",
          description: "Proper care is important",
          isCorrect: false
        },
        {
          id: "c",
          text: "Maintain good hygiene routine",
          emoji: "🧴",
          description: "Regular hygiene reduces sweat-related problems",
          isCorrect: true
        }
      ]    }
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
    navigate("/student/health-male/teens/hygiene-confidence-debate-46");
  };

  return (
    <GameShell
      title="Night Sweat Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-45"
      gameType="health-male"
      totalLevels={50}
      currentLevel={45}
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

export default NightSweatStory;
