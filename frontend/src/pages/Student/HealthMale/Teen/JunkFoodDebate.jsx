import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JunkFoodDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-16";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is it okay to eat junk food sometimes?",
      options: [
        {
          id: "a",
          text: "Yes, in moderation",
          emoji: "⚖️"
        },
        {
          id: "b",
          text: "No, never ever",
          emoji: "🚫"
        },
        {
          id: "c",
          text: "Yes, every day",
          emoji: "🍔"
        }
      ],
      correctAnswer: "a",
      explanation: "Eating junk food in moderation is okay. That's too strict, and too restrictive can lead to binges."
    },
    {
      id: 2,
      text: "Friends are eating pizza. What do you do?",
      options: [
        {
          id: "b",
          text: "Eat 10 slices",
          emoji: "🍕"
        },
        {
          id: "a",
          text: "Have 1-2 slices & salad",
          emoji: "🥗"
        },
        {
          id: "c",
          text: "Sit and starve",
          emoji: "🤐"
        }
      ],
      correctAnswer: "a",
      explanation: "Balance is key. Overeating makes you sluggish, and you can enjoy food socially."
    },
    {
      id: 3,
      text: "Does junk food give you good energy?",
      options: [
        {
          id: "c",
          text: "Yes, forever",
          emoji: "🔋"
        },
        {
          id: "b",
          text: "It makes you super strong",
          emoji: "💪"
        },
        {
          id: "a",
          text: "No, it causes a crash",
          emoji: "📉"
        }
      ],
      correctAnswer: "a",
      explanation: "Sugar highs are followed by lows. No, it's short-lived, and it usually makes you tired."
    },
    {
      id: 4,
      text: "Is junk food cheaper than home cooking?",
      options: [
        {
          id: "b",
          text: "Always cheaper",
          emoji: "💸"
        },
        {
          id: "a",
          text: "Home cooking saves money",
          emoji: "🏠"
        },
        {
          id: "c",
          text: "They cost the same",
          emoji: "🤷"
        }
      ],
      correctAnswer: "a",
      explanation: "Buying ingredients is usually cheaper. Not always, and health costs add up. Eating out is usually pricier."
    },
    {
      id: 5,
      text: "What happens if you only eat junk?",
      options: [
        {
          id: "c",
          text: "You become a superhero",
          emoji: "🦸"
        },
        {
          id: "b",
          text: "Nothing changes",
          emoji: "😐"
        },
        {
          id: "a",
          text: "Health problems later",
          emoji: "🏥"
        }
      ],
      correctAnswer: "a",
      explanation: "Heart issues, diabetes, etc. Unlikely, and your body will suffer."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/diet-change-journal");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Junk Food Debate"
subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🍔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Junk Food Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
              
              // Add emojis for each option like in the reference game
              const optionEmojis = {
                a: "✅",
                b: "❌",
                c: "⚠️"
              };
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${
                    showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{optionEmojis[option.id] || '❓'}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! 🎉'
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
        
        {gameFinished && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Debate Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {coins} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Balanced nutrition is key to long-term health and energy.
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JunkFoodDebate;
