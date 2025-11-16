import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCollegeBasics = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What is a university?",
      options: [
        {
          id: "a",
          text: "Place for higher studies",
          emoji: "🎓",
          description: "Correct! Universities are institutions for higher education!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Playground",
          emoji: "游乐场",
          description: "That's not what a university is for!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do students do in college?",
      options: [
        {
          id: "a",
          text: "Study specialized subjects",
          emoji: "📚",
          description: "Exactly! Students study specialized subjects in college!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only play games",
          emoji: "🎮",
          description: "College is for serious learning!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why do people go to college?",
      options: [
        {
          id: "a",
          text: "To gain knowledge and skills",
          emoji: "🧠",
          description: "Perfect! College helps gain knowledge and skills!",
          isCorrect: true
        },
        {
          id: "b",
          text: "To avoid working",
          emoji: "😴",
          description: "College requires hard work!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What can you study in college?",
      options: [
        {
          id: "a",
          text: "Science, Arts, Commerce",
          emoji: "📖",
          description: "Correct! College offers diverse fields of study!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only sports",
          emoji: "⚽",
          description: "Colleges offer much more than just sports!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the benefit of college education?",
      options: [
        {
          id: "a",
          text: "Better career opportunities",
          emoji: "💼",
          description: "Exactly! College opens doors to better careers!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Free money",
          emoji: "💰",
          description: "College doesn't provide free money!",
          isCorrect: false
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
      title="Quiz on College Basics"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-62"
      gameType="ehe"
      totalLevels={10}
      currentLevel={62}
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

export default QuizOnCollegeBasics;