import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MobilePressureStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-68";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friend texts you late at night to play a game.",
      options: [
        {
          id: "a",
          text: "Play all night",
          emoji: "🎮",
          description: "You need sleep!",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Wake up your parents",
          emoji: "📢",
          description: "Just ignore the text.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore it and sleep",
          emoji: "😴",
          description: "Correct! Sleep is important.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "A stranger messages you online.",
      options: [
        {
          id: "a",
          text: "Tell them your name",
          emoji: "📛",
          description: "Never share personal info.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Block them and tell a parent",
          emoji: "🚫",
          description: "Yes! Stay safe online.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Be friends with them",
          emoji: "🤝",
          description: "Strangers can be dangerous.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Everyone is posting a mean picture of a classmate.",
      options: [
        {
          id: "b",
          text: "Don't share it and tell a teacher",
          emoji: "🛑",
          description: "Correct! Help stop the bullying.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Share it too",
          emoji: "📤",
          description: "Sharing spreads the hurt.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Comment a mean emoji",
          emoji: "😡",
          description: "Be kind, not mean.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You see a scary video online.",
      options: [
        {
          id: "a",
          text: "Watch it again",
          emoji: "👀",
          description: "It might scare you more.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Close it and tell an adult",
          emoji: "👩‍🦳",
          description: "Yes! Adults can help you feel safe.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Send it to a friend",
          emoji: "📲",
          description: "Don't scare your friends.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How much screen time is healthy?",
      options: [
        {
          id: "a",
          text: "24 hours a day",
          emoji: "🧟",
          description: "That's way too much!",
          isCorrect: false
        },
        {
          id: "b",
          text: "A balanced amount",
          emoji: "⚖️",
          description: "Correct! Balance play and screens.",
          isCorrect: true
        },
        {
          id: "c",
          text: "None ever",
          emoji: "📵",
          description: "A little is okay.",
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
      title="Mobile Pressure Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={58}
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

export default MobilePressureStory;