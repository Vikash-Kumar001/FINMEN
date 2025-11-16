import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SportsHygieneStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "After football practice, what should you do?",
      options: [
        {
          id: "b",
          text: "Stay sweaty until later",
          emoji: "😅",
          description: "Staying sweaty can cause skin problems and odor",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take a shower immediately",
          emoji: "🚿",
          description: "Shower removes sweat and prevents skin infections",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just change clothes",
          emoji: "👕",
          description: "Need to clean body, not just change clothes",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You played basketball and got very sweaty. What next?",
      options: [
        {
          id: "b",
          text: "Use same sweaty towel",
          emoji: "💧",
          description: "Dirty towels spread germs and cause skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip shower today",
          emoji: "⏭️",
          description: "Sports require proper hygiene after activity",
          isCorrect: false
        },
        {
          id: "a",
          text: "Shower and use clean towel",
          emoji: "🧺",
          description: "Clean body and fresh towel prevent infections",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "After running track, your feet are sweaty. What do you do?",
      options: [
        {
          id: "c",
          text: "Use foot spray only",
          emoji: "🌸",
          description: "Need to clean feet, not just cover odor",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash feet and change socks",
          emoji: "🧼",
          description: "Clean feet prevent foot odor and infections",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just put on shoes",
          emoji: "👟",
          description: "Sweaty feet in shoes cause bad odor",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "After swimming practice, what hygiene step is important?",
      options: [
        {
          id: "b",
          text: "Just towel dry quickly",
          emoji: "🧺",
          description: "Need to remove chlorine and clean properly",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip shower to save time",
          emoji: "⏰",
          description: "Pool water requires thorough cleaning after swimming",
          isCorrect: false
        },
        {
          id: "a",
          text: "Rinse off chlorine and shower",
          emoji: "🚿",
          description: "Chlorine can dry skin, so rinse and moisturize",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You finished a soccer game in the rain. What's the best approach?",
      options: [
        {
          id: "c",
          text: "Stay in wet clothes",
          emoji: "🌧️",
          description: "Wet clothes cause discomfort and potential illness",
          isCorrect: false
        },
        {
          id: "a",
          text: "Dry off, shower, and change all clothes",
          emoji: "🧴",
          description: "Wet clothes and mud need complete hygiene routine",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just change wet shirt",
          emoji: "👕",
          description: "Need full body cleaning and dry clothes",
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
    navigate("/student/health-male/teens/hygiene-confidence-debate");
  };

  return (
    <GameShell
      title="Sports Hygiene Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-5"
      gameType="health-male"
      totalLevels={10}
      currentLevel={5}
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

export default SportsHygieneStory;
