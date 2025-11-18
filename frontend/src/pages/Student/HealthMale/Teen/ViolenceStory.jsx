import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ViolenceStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: 'Peer says: "Be a man, fight him." Should you?',
      options: [
        {
          id: "a",
          text: "Yes, prove you're tough",
          emoji: "💪",
          description: "Violence doesn't prove masculinity or solve problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fight back harder",
          emoji: "👊",
          description: "Physical fights often lead to more problems",
          isCorrect: false
        },
        {
          id: "c",
          text: "No, walk away",
          emoji: "🚶",
          description: "Walking away shows strength and maturity",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What should you do if someone challenges you to fight?",
      options: [
        {
          id: "b",
          text: "Accept to save face",
          emoji: "😤",
          description: "True strength is choosing peace over conflict",
          isCorrect: false
        },
        {
          id: "a",
          text: "Report to an adult",
          emoji: "📞",
          description: "Getting help is brave, not weak",
          isCorrect: true
        },
        {
          id: "c",
          text: "Fight to win respect",
          emoji: "🏆",
          description: "Respect comes from character, not fighting",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you respond to peer pressure to fight?",
      options: [
        {
          id: "a",
          text: "Give in to pressure",
          emoji: "😞",
          description: "Standing up for yourself means making your own choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say no and suggest talking instead",
          emoji: "💬",
          description: "Communication solves problems better than violence",
          isCorrect: true
        },
        {
          id: "b",
          text: "Challenge them back",
          emoji: "👊",
          description: "Escalating conflict rarely helps",
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
    navigate("/student/health-male/teens/emotions-equals-weakness-debate");
  };

  return (
    <GameShell
      title="Violence Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-65"
      gameType="health-male"
      totalLevels={70}
      currentLevel={65}
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

export default ViolenceStory;
