import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ESportsStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A kid loves gaming. Can this be a career?",
      options: [
        {
          id: "a",
          text: "Yes, e-sports or game design",
          emoji: "✅",
          description: "Exactly! Gaming can lead to careers in e-sports or game development!",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, gaming is just a waste of time",
          emoji: "❌",
          description: "Gaming can be a career path when pursued professionally!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if you win every game",
          emoji: "🏆",
          description: "Professional gaming has many career paths beyond just winning!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is e-sports?",
      options: [
        {
          id: "a",
          text: "Competitive video gaming",
          emoji: "🎮",
          description: "Correct! E-sports involves professional competitive gaming!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Playing alone at home",
          emoji: "🏠",
          description: "That's casual gaming, not professional e-sports!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only mobile games",
          emoji: "📱",
          description: "E-sports includes various platforms, not just mobile!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What careers are related to gaming?",
      options: [
        {
          id: "a",
          text: "Game designer, streamer, coach",
          emoji: "💼",
          description: "Perfect! These are all real gaming-related careers!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only professional players",
          emoji: "🏃",
          description: "There are many more careers in the gaming industry!",
          isCorrect: false
        },
        {
          id: "c",
          text: "No careers exist",
          emoji: "❌",
          description: "The gaming industry offers many career opportunities!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What skills are important for gaming careers?",
      options: [
        {
          id: "a",
          text: "Strategy, teamwork, communication",
          emoji: "🧠",
          description: "Exactly! These skills are essential for gaming careers!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only fast reflexes",
          emoji: "⚡",
          description: "While reflexes help, many other skills are important too!",
          isCorrect: false
        },
        {
          id: "c",
          text: "No skills needed",
          emoji: "😴",
          description: "Professional gaming requires serious skill development!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can someone prepare for a gaming career?",
      options: [
        {
          id: "a",
          text: "Practice, learn, build a portfolio",
          emoji: "📚",
          description: "Perfect! Practice and learning are key to gaming careers!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just play all day",
          emoji: "⏰",
          description: "Balance is important - gaming careers require focused effort!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all other activities",
          emoji: "🚫",
          description: "A well-rounded approach is better for long-term success!",
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
      title="E-Sports Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-75"
      gameType="ehe"
      totalLevels={10}
      currentLevel={75}
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

export default ESportsStory;