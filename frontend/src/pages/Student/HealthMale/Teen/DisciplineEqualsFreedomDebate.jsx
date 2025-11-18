import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DisciplineEqualsFreedomDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Does discipline give freedom or restrict life?",
      options: [
        {
          id: "a",
          text: "Restricts life",
          emoji: "🔒",
          description: "Discipline creates structure that enables freedom",
          isCorrect: false
        },
        {
          id: "b",
          text: "Limits choices",
          emoji: "🚫",
          description: "Discipline expands possibilities through good habits",
          isCorrect: false
        },
        {
          id: "c",
          text: "Gives freedom",
          emoji: "🕊️",
          description: "Self-discipline leads to greater personal freedom",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "How does discipline help teens succeed?",
      options: [
        {
          id: "b",
          text: "Creates more work",
          emoji: "📚",
          description: "Discipline makes achieving goals easier",
          isCorrect: false
        },
        {
          id: "a",
          text: "Builds self-control",
          emoji: "💪",
          description: "Self-control is key to personal freedom",
          isCorrect: true
        },
        {
          id: "c",
          text: "Removes fun",
          emoji: "😔",
          description: "Discipline enables more enjoyable experiences",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is the relationship between rules and freedom?",
      options: [
        {
          id: "a",
          text: "Rules prevent freedom",
          emoji: "🚫",
          description: "Rules provide the structure for true freedom",
          isCorrect: false
        },
        {
          id: "c",
          text: "Rules enable responsible freedom",
          emoji: "⚖️",
          description: "Following rules responsibly leads to more freedom",
          isCorrect: true
        },
        {
          id: "b",
          text: "No relationship",
          emoji: "🤷",
          description: "Rules and freedom are connected",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does self-discipline affect future opportunities?",
      options: [
        {
          id: "b",
          text: "Limits opportunities",
          emoji: "🚪",
          description: "Discipline opens doors to more opportunities",
          isCorrect: false
        },
        {
          id: "a",
          text: "Creates more opportunities",
          emoji: "🚀",
          description: "Self-discipline leads to success and choices",
          isCorrect: true
        },
        {
          id: "c",
          text: "No effect",
          emoji: "😐",
          description: "Discipline directly affects future success",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the ultimate result of consistent discipline?",
      options: [
        {
          id: "a",
          text: "Boredom and restriction",
          emoji: "😴",
          description: "Discipline leads to achievement and fulfillment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Personal mastery and freedom",
          emoji: "👑",
          description: "Mastering discipline gives true personal freedom",
          isCorrect: true
        },
        {
          id: "b",
          text: "Constant struggle",
          emoji: "😩",
          description: "Discipline becomes easier with practice",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/health-male/teens/journal-of-teen-habits");
  };

  return (
    <GameShell
      title="Debate: Discipline = Freedom?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="health-male-teen-96"
      gameType="health-male"
      totalLevels={100}
      currentLevel={96}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Discipline & Freedom Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default DisciplineEqualsFreedomDebate;
