import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SharingStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-55";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel really sad because your pet is sick. What helps?",
      options: [
        {
          id: "a",
          text: "Hiding in your room forever",
          emoji: "🚪",
          description: "Hiding makes you feel lonely.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Telling your mom or dad",
          emoji: "👪",
          description: "Yes! They can hug and comfort you.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pretending you are happy",
          emoji: "🎭",
          description: "It's okay to be sad.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend looks lonely on the playground. What can you do?",
      options: [
        {
          id: "a",
          text: "Ignore them",
          emoji: "🤷‍♀️",
          description: "That's not very kind.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask them to play with you",
          emoji: "🤝",
          description: "Correct! Sharing fun is the best.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Laugh at them",
          emoji: "😆",
          description: "That would hurt their feelings.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You are worried about a test at school.",
      options: [
        {
          id: "a",
          text: "Tell your teacher or parent",
          emoji: "🗣️",
          description: "Yes! They can help you study.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Crumple up your homework",
          emoji: "📝",
          description: "That won't help you learn.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip school",
          emoji: "🏫",
          description: "You need to go to learn!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is sharing feelings good?",
      options: [
        {
          id: "a",
          text: "It makes your feelings smaller and manageable",
          emoji: "🎈",
          description: "Exactly! A problem shared is a problem halved.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes people laugh at you",
          emoji: "🤡",
          description: "True friends won't laugh.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It is boring",
          emoji: "🥱",
          description: "It's actually very helpful.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who are 'Safe People' to share secrets with?",
      options: [
        {
          id: "a",
          text: "A stranger in the park",
          emoji: "🌳",
          description: "Never share secrets with strangers.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Parents, Teachers, Doctors",
          emoji: "🛡️",
          description: "Correct! Determine who you trust.",
          isCorrect: true
        },
        {
          id: "c",
          text: "The internet",
          emoji: "💻",
          description: "The internet isn't always private.",
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
      title="Sharing Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={55}
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

export default SharingStory;