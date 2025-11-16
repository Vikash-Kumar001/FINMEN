import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanlinessQuiz = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "How often should you brush your teeth?",
      options: [
        {
          id: "a",
          text: "Once a week",
          emoji: "📅",
          description: "Teeth need more frequent cleaning to stay healthy",
          isCorrect: false
        },
        {
          id: "b",
          text: "Twice a day",
          emoji: "🦷",
          description: "Great job! Brushing twice daily keeps teeth clean and healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when they hurt",
          emoji: "😣",
          description: "Don't wait for pain - brush regularly to prevent problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to keep your nails clean?",
      options: [
        {
          id: "a",
          text: "Bite them short",
          emoji: "😬",
          description: "Biting nails can spread germs and damage them",
          isCorrect: false
        },
        {
          id: "b",
          text: "Never cut them",
          emoji: "✋",
          description: "Long nails can trap dirt and germs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Trim and clean them regularly",
          emoji: "✂️",
          description: "Perfect! Clean, trimmed nails look nice and stay healthy",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "When should you take a bath or shower?",
      options: [
        {
          id: "a",
          text: "Every day",
          emoji: "🚿",
          description: "Great! Daily cleaning keeps your skin healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once a month",
          emoji: "📅",
          description: "That's not often enough to stay clean",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when someone tells me to",
          emoji: "🤔",
          description: "Be responsible for your own hygiene",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do after playing outside?",
      options: [
        {
          id: "a",
          text: "Wipe hands on clothes",
          emoji: "👕",
          description: "That just spreads dirt to your clothes",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands with soap",
          emoji: "🧼",
          description: "Perfect! Washing removes dirt and germs",
          isCorrect: true
        },
        {
          id: "c",
          text: "Rub hands in hair",
          emoji: "💁",
          description: "That just makes your hair dirty too",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How often should you change your clothes?",
      options: [
        {
          id: "a",
          text: "Every day",
          emoji: "👕",
          description: "Clean clothes help keep you fresh and healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once a week",
          emoji: "📅",
          description: "Clothes should be changed more often than that",
          isCorrect: false
        },
        {
          id: "c",
          text: "When they stand up by themselves",
          emoji: "😷",
          description: "That's way too long to wear the same clothes!",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Cleanliness Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      backPath="/games/health-female/kids"
    >
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-blue-500/20 px-4 py-2 rounded-full">
                <span className="text-white font-medium">Question {currentQuestion + 1}/{questions.length}</span>
              </div>
              <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
            </div>
            
            <div className="text-center my-8">
              <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                {questions[currentQuestion].text}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={choices.some(c => c.question === currentQuestion && c.optionId === option.id)}
                  className={`w-full p-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] text-left ${
                    choices.some(c => c.optionId === option.id && c.isCorrect)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : choices.some(c => c.optionId === option.id && !c.isCorrect)
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 opacity-80'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{option.emoji}</span>
                    <div>
                      <div className="font-medium text-lg text-white">{option.text}</div>
                      {choices.some(c => c.optionId === option.id) && (
                        <p className={`text-sm mt-2 font-medium ${
                          option.isCorrect ? 'text-green-100' : 'text-red-100'
                        }`}>
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between items-center text-sm text-white/60">
              <span>Tip: Read each option carefully before choosing!</span>
              <span>{currentQuestion + 1} of {questions.length}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-3xl font-bold text-white mb-6">Quiz Complete! 🎉</h3>
            <p className="text-xl text-white/90 mb-8">You earned {coins} coins! ✨</p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CleanlinessQuiz;
