import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendsDareStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-61";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friends dare you to climb a high wall. It looks dangerous.",
      options: [
        {
          id: "b",
          text: "Say 'No' and stay safe",
          emoji: "🚫",
          description: "Correct! Never do dangerous dares.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Do it to be cool",
          emoji: "🧗‍♀️",
          description: "Safety is more important than being cool.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Cry loudly",
          emoji: "😭",
          description: "You don't need to cry, just say no.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A friend tells you to steal a candy bar.",
      options: [
        {
          id: "a",
          text: "Steal it quickly",
          emoji: "🍬",
          description: "Stealing is wrong.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Ask them to steal it for you",
          emoji: "🕵️‍♀️",
          description: "That is still participating in stealing.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Refuse and walk away",
          emoji: "🚶‍♀️",
          description: "Yes! Do the right thing.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Your friends are teasing a new student. They want you to join.",
      options: [
        {
          id: "a",
          text: "Join in holding back laughter",
          emoji: "🤭",
          description: "Teasing hurts feelings.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Be kind and say 'Stop'",
          emoji: "🛑",
          description: "Correct! Be a hero, not a bully.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Run away",
          emoji: "🏃‍♀️",
          description: "Better to stand up if you can, or get a teacher.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Everyone is skipping class. They call you a 'baby' for staying.",
      options: [
        {
          id: "a",
          text: "Skip class too",
          emoji: "🏫",
          description: "School is for learning.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore them and go to class",
          emoji: "📚",
          description: "Exactly! Be proud of doing right.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Fight them",
          emoji: "🥊",
          description: "Fighting gets you in trouble.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A true friend will...",
      options: [
        {
          id: "b",
          text: "Respect your 'No'",
          emoji: "🤝",
          description: "Yes! Real friends respect you.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Dare you to do bad things",
          emoji: "😈",
          description: "That's not a true friend.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Make fun of you",
          emoji: "🤡",
          description: "Friends don't make fun of you.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (selectedOptionId) return;

    setSelectedOptionId(optionId);
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setSelectedOptionId(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Friends Dare Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={61}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {questions[currentQuestion].text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => {
              const isSelected = selectedOptionId === option.id;
              const showFeedback = selectedOptionId !== null;

              let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";

              if (showFeedback && isSelected) {
                buttonClass = option.isCorrect
                  ? "bg-green-500 ring-4 ring-green-300"
                  : "bg-red-500 ring-4 ring-red-300";
              } else if (showFeedback && !isSelected) {
                buttonClass = "bg-white/10 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${buttonClass}`}
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-6">{option.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 text-white">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white font-medium mt-2 animate-fadeIn">{option.description}</p>
                      )}
                    </div>
                    {showFeedback && isSelected && (
                      <div className="text-3xl ml-4">
                        {option.isCorrect ? "✅" : "❌"}
                      </div>
                    )}
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

export default FriendsDareStory;