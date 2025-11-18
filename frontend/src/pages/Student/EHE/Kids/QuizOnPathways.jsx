import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPathways = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is a career path?",
      options: [
        {
          id: "a",
          text: "Vocational training",
          emoji: "🔧",
          description: "Correct! Vocational training is one career path!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Higher education",
          emoji: "🎓",
          description: "Correct! Higher education is another career path!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both",
          emoji: "🤝",
          description: "Exactly! Both vocational training and higher education are valid career paths!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What is vocational training focused on?",
      options: [
        {
          id: "b",
          text: "Only theoretical knowledge",
          emoji: "📚",
          description: "Vocational training is more hands-on!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only playing games",
          emoji: "🎮",
          description: "That's not what vocational training is about!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Practical skills for specific jobs",
          emoji: "🛠️",
          description: "Perfect! Vocational training focuses on practical, job-specific skills!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What's a benefit of higher education?",
      options: [
        {
          id: "b",
          text: "No need to study hard",
          emoji: "😴",
          description: "Higher education requires dedication and hard work!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Automatic job guarantee",
          emoji: "💼",
          description: "Education helps but doesn't guarantee jobs!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deeper theoretical knowledge",
          emoji: "🧠",
          description: "Exactly! Higher education provides deep theoretical understanding!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Can someone succeed without college?",
      options: [
        {
          id: "c",
          text: "No, college is absolutely necessary",
          emoji: "❌",
          description: "There are many paths to success!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only with family wealth",
          emoji: "💰",
          description: "Success comes from effort, not just wealth!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, through skills and dedication",
          emoji: "✅",
          description: "Exactly! Success comes from skills, dedication, and hard work!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What should you consider when choosing a path?",
      options: [
        {
          id: "b",
          text: "Only what friends are doing",
          emoji: "👥",
          description: "Your path should be based on your interests and goals!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only the shortest duration",
          emoji: "⏱️",
          description: "Duration is just one factor to consider!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your interests, skills, and goals",
          emoji: "🎯",
          description: "Perfect! Personal interests, skills, and goals are key factors!",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
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

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Pathways"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-52"
      gameType="ehe"
      totalLevels={10}
      currentLevel={52}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnPathways;