import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ScholarshipStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A student has no money for fees. What can help?",
      options: [
        {
          id: "a",
          text: "Scholarship",
          emoji: "🎓",
          description: "Exactly! Scholarships help students who can't afford fees!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Drop out of school",
          emoji: "❌",
          description: "Dropping out isn't the solution - scholarships can help!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Borrow from strangers",
          emoji: "陌生人",
          description: "That's not a safe or reliable option!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a scholarship?",
      options: [
        {
          id: "a",
          text: "Financial aid for students",
          emoji: "💰",
          description: "Correct! Scholarships provide financial support for education!",
          isCorrect: true
        },
        {
          id: "b",
          text: "A type of loan",
          emoji: "💳",
          description: "Scholarships don't need to be repaid like loans!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Free money for anyone",
          emoji: "💸",
          description: "Scholarships have specific criteria and aren't for everyone!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What do you usually need to get a scholarship?",
      options: [
        {
          id: "a",
          text: "Good grades and achievements",
          emoji: "📚",
          description: "Exactly! Academic performance is often important for scholarships!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just asking for it",
          emoji: "🙏",
          description: "Scholarships require meeting specific criteria!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Rich parents",
          emoji: "👨‍👩‍👧‍👦",
          description: "Many scholarships are specifically for students who need financial help!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Where can you find scholarships?",
      options: [
        {
          id: "a",
          text: "Schools, government, organizations",
          emoji: "🏫",
          description: "Perfect! These are common sources of scholarships!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only from friends",
          emoji: "👥",
          description: "Scholarships come from official institutions and organizations!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Random websites only",
          emoji: "🌐",
          description: "Be careful with sources - look for legitimate scholarship providers!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do to increase scholarship chances?",
      options: [
        {
          id: "a",
          text: "Study hard and participate in activities",
          emoji: "💪",
          description: "Exactly! Academic excellence and involvement help!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just wait for them to come",
          emoji: "⏳",
          description: "You need to actively apply for scholarships!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Lie on applications",
          emoji: "🤥",
          description: "Honesty is important in scholarship applications!",
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
      title="Scholarship Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-68"
      gameType="ehe"
      totalLevels={10}
      currentLevel={68}
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

export default ScholarshipStory;