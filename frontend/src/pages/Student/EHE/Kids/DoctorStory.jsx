import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DoctorStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You're not feeling well and your mom takes you to see a doctor. What does a doctor do?",
      options: [
        {
          id: "b",
          text: "Teaches students in school",
          emoji: "📚",
          description: "That's what teachers do, not doctors!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Treats sick people and helps them feel better",
          emoji: "🏥",
          description: "Excellent! Doctors help sick people get healthy again!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Builds houses and buildings",
          emoji: "🏗️",
          description: "That's what construction workers do!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The doctor listens to your heartbeat with a stethoscope. Why does she do this?",
      options: [
        {
          id: "c",
          text: "To make you nervous",
          emoji: "😰",
          description: "No, doctors want to help you, not make you nervous!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To check if your heart is working properly",
          emoji: "❤️",
          description: "Perfect! Doctors check your heartbeat to make sure your heart is healthy!",
          isCorrect: true
        },
        {
          id: "b",
          text: "To listen to your favorite music",
          emoji: "🎵",
          description: "Doctors use stethoscopes for medical checks, not for music!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The doctor gives you medicine. What should you do with it?",
      options: [
        {
          id: "b",
          text: "Take more than prescribed to get better faster",
          emoji: "💊",
          description: "No! Taking too much medicine can be dangerous!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take it exactly as the doctor said",
          emoji: "✅",
          description: "Great! Always follow the doctor's instructions for medicine!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide it and don't take it at all",
          emoji: "❌",
          description: "That won't help you get better!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "After your visit, the doctor tells you to rest and drink lots of water. Why?",
      options: [
        {
          id: "b",
          text: "Because the doctor wants you to miss school",
          emoji: "🏫",
          description: "Doctors want you to get better so you can go back to school!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To help your body fight the illness",
          emoji: "💧",
          description: "Exactly! Rest and water help your body heal!",
          isCorrect: true
        },
        {
          id: "c",
          text: "To make you bored",
          emoji: "😴",
          description: "Rest is important for healing, not just for boredom!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You want to become a doctor when you grow up. What should you do now to prepare?",
      options: [
        {
          id: "b",
          text: "Play video games all day",
          emoji: "🎮",
          description: "Fun, but you'll need to study to become a doctor!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Study hard, especially science, and be kind to others",
          emoji: "📖",
          description: "Perfect! Doctors need to study a lot and be caring people!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Never go to school",
          emoji: "🚫",
          description: "You definitely need to go to school to become a doctor!",
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
      title="Doctor Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-1"
      gameType="ehe"
      totalLevels={10}
      currentLevel={1}
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

export default DoctorStory;