import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EcoBagStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A girl makes cloth bags to replace plastic. What is she solving?",
      options: [
        {
          id: "a",
          text: "Pollution",
          emoji: "🌍",
          description: "Exactly! Cloth bags reduce plastic pollution!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Making money only",
          emoji: "💰",
          description: "While she might earn money, her main goal is solving pollution!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Creating waste",
          emoji: "🗑️",
          description: "She's reducing waste, not creating it!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why are plastic bags harmful?",
      options: [
        {
          id: "a",
          text: "They don't decompose",
          emoji: "⏳",
          description: "Correct! Plastic bags take hundreds of years to decompose!",
          isCorrect: true
        },
        {
          id: "b",
          text: "They're too colorful",
          emoji: "🎨",
          description: "Color isn't the environmental issue with plastic bags!",
          isCorrect: false
        },
        {
          id: "c",
          text: "They're too strong",
          emoji: "💪",
          description: "Strength isn't the environmental problem with plastic bags!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What are eco-friendly alternatives?",
      options: [
        {
          id: "a",
          text: "Cloth, jute, paper bags",
          emoji: "🌿",
          description: "Perfect! These materials are biodegradable and reusable!",
          isCorrect: true
        },
        {
          id: "b",
          text: "More plastic bags",
          emoji: "🛍️",
          description: "More plastic increases pollution!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Throwing them away",
          emoji: "🗑️",
          description: "Disposal isn't a solution to plastic pollution!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do reusable bags help?",
      options: [
        {
          id: "a",
          text: "Reduce waste over time",
          emoji: "♻️",
          description: "Exactly! One reusable bag replaces hundreds of plastic ones!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only look nice",
          emoji: "👀",
          description: "While they look nice, their main benefit is environmental!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Are cheaper than plastic",
          emoji: "💸",
          description: "Initially more expensive, but cost-effective over time!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What can you do to help?",
      options: [
        {
          id: "a",
          text: "Use reusable bags",
          emoji: "👜",
          description: "Perfect! Small actions create big environmental changes!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the problem",
          emoji: "🙈",
          description: "Ignoring environmental issues makes them worse!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use more plastic",
          emoji: "层出不",
          description: "More plastic increases environmental damage!",
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
      title="Eco Bag Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-85"
      gameType="ehe"
      totalLevels={10}
      currentLevel={85}
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

export default EcoBagStory;