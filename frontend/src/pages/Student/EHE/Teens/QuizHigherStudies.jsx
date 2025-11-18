import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizHigherStudies = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is a higher education stream?",
      options: [
        {
          id: "a",
          text: "Arts",
          emoji: "🎨",
          description: "Correct! Arts is a major higher education stream focusing on humanities and creative fields",
          isCorrect: true
        },
        {
          id: "b",
          text: "Science",
          emoji: "🔬",
          description: "Correct! Science is a major higher education stream focusing on natural sciences and mathematics",
          isCorrect: true
        },
        {
          id: "c",
          text: "Commerce",
          emoji: "💼",
          description: "Correct! Commerce is a major higher education stream focusing on business and economics",
          isCorrect: true
        },
        {
          id: "d",
          text: "All of the above",
          emoji: "✅",
          description: "Exactly! All three are major higher education streams with distinct career paths",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What's the typical duration of an undergraduate degree in India?",
      options: [
        {
          id: "a",
          text: "2 years",
          emoji: "⏱️",
          description: "Some diploma courses are 2 years, but bachelor's degrees are typically longer",
          isCorrect: false
        },
        {
          id: "b",
          text: "3 years",
          emoji: "📅",
          description: "Correct! Most bachelor's degrees in India are 3 years (except engineering which is 4)",
          isCorrect: true
        },
        {
          id: "c",
          text: "5 years",
          emoji: "📆",
          description: "Some professional courses like medicine are 5+ years, but not typical bachelor's degrees",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which stream focuses on creative and liberal arts education?",
      options: [
        {
          id: "a",
          text: "Arts",
          emoji: "🎭",
          description: "Exactly! The Arts stream includes literature, history, philosophy, and creative arts",
          isCorrect: true
        },
        {
          id: "b",
          text: "Science",
          emoji: "🧬",
          description: "Science focuses on natural sciences, mathematics, and technical subjects",
          isCorrect: false
        },
        {
          id: "c",
          text: "Commerce",
          emoji: "📊",
          description: "Commerce focuses on business, economics, and financial studies",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which stream includes subjects like physics, chemistry, and biology?",
      options: [
        {
          id: "a",
          text: "Arts",
          emoji: "📚",
          description: "Arts focuses on humanities and creative subjects rather than natural sciences",
          isCorrect: false
        },
        {
          id: "b",
          text: "Science",
          emoji: "🔬",
          description: "Correct! Science stream includes physics, chemistry, biology, and mathematics",
          isCorrect: true
        },
        {
          id: "c",
          text: "Commerce",
          emoji: "💰",
          description: "Commerce focuses on business and economic subjects",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which stream prepares students for careers in business and finance?",
      options: [
        {
          id: "a",
          text: "Arts",
          emoji: "✍️",
          description: "Arts focuses on humanities and creative fields rather than business",
          isCorrect: false
        },
        {
          id: "b",
          text: "Science",
          emoji: "🧪",
          description: "Science focuses on natural sciences and technical fields",
          isCorrect: false
        },
        {
          id: "c",
          text: "Commerce",
          emoji: "📈",
          description: "Exactly! Commerce stream prepares students for business, finance, and economics careers",
          isCorrect: true
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
    navigate("/student/ehe/teens/reflex-teen-higher-ed");
  };

  return (
    <GameShell
      title="Quiz on Higher Studies"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-62"
      gameType="ehe"
      totalLevels={70}
      currentLevel={62}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-white mb-2">Higher Education Quiz</h3>
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

export default QuizHigherStudies;