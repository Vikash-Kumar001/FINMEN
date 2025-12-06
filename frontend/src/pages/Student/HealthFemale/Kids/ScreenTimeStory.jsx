import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ScreenTimeStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-95";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "It's bedtime, but your favorite show is on. What should you do?",
      options: [
        {
          id: "a",
          text: "Watch it all night",
          emoji: "📺",
          description: "You'll be too tired tomorrow.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Turn it off and sleep",
          emoji: "😴",
          description: "Correct! Sleep is more important.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Watch with one eye open",
          emoji: "😜",
          description: "That doesn't work well.",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 2,
      text: "Your eyes hurt from playing tablet games. What does it mean?",
      options: [
        
        {
          id: "b",
          text: "Play faster",
          emoji: "⚡",
          description: "That hurts more.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Rub them hard",
          emoji: "😣",
          description: "Don't rub hard!",
          isCorrect: false
        },
        {
          id: "d",
          text: "Close one eye",
          emoji: "😉",
          description: "Both eyes need rest.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Time to take a break",
          emoji: "🛑",
          description: "Yes! Your eyes need rest.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Instead of staring at screens all day, you should...",
      options: [
        {
          id: "a",
          text: "Play outside with friends",
          emoji: "⚽",
          description: "Correct! Active play is great.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stare at the wall",
          emoji: "🧱",
          description: "Go have some fun!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sleep all day",
          emoji: "🛌",
          description: "Balance sleep and play.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Eat only chips",
          emoji: "🥔",
          description: "Healthy food is better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is too much screen time bad before bed?",
      options: [
        {
          id: "a",
          text: "The monsters come out",
          emoji: "👹",
          description: "Monsters aren't real.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It makes your brain too awake",
          emoji: "💡",
          description: "Yes! The blue light wakes you up.",
          isCorrect: true
        },
        {
          id: "c",
          text: "The tablet melts",
          emoji: "🫠",
          description: "Tablets don't melt.",
          isCorrect: false
        },
        {
          id: "d",
          text: "You forget your name",
          emoji: "❓",
          description: "You won't forget that.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a good screen-time rule?",
      options: [
        {
          id: "a",
          text: "Screens only on weekends",
          emoji: "🗓️",
          description: "That's a very strict rule.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No screens during dinner",
          emoji: "🍽️",
          description: "Correct! Talk to your family instead.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Screens in the bath",
          emoji: "🛁",
          description: "Water destroys electronics!",
          isCorrect: false
        },
        {
          id: "d",
          text: "Screens while walking",
          emoji: "🚶",
          description: "Watch where you are going!",
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
      title="Screen-Time Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={95}
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

export default ScreenTimeStory;