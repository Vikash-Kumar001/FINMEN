import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BoysShouldNotCryDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is crying weakness or natural?",
      options: [
        {
          id: "a",
          text: "Natural",
          emoji: "😢",
          description: "Crying is a healthy emotional response for everyone",
          isCorrect: true
        },
        {
          id: "b",
          text: "Weakness",
          emoji: "💪",
          description: "Expressing emotions shows strength, not weakness",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only for girls",
          emoji: "👧",
          description: "Everyone has emotions and needs to express them",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when boys suppress emotions?",
      options: [
        {
          id: "a",
          text: "Makes them stronger",
          emoji: "💪",
          description: "Suppressing emotions weakens mental resilience",
          isCorrect: false
        },
        {
          id: "b",
          text: "Builds mental health issues",
          emoji: "😞",
          description: "Bottling emotions can lead to stress and depression",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing happens",
          emoji: "😐",
          description: "Unexpressed emotions affect well-being",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should teens handle difficult emotions?",
      options: [
        {
          id: "a",
          text: "Hide them completely",
          emoji: "🤐",
          description: "Hiding emotions prevents getting needed support",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only cry in private",
          emoji: "🏠",
          description: "Expressing emotions when needed is important",
          isCorrect: false
        },
        {
          id: "c",
          text: "Talk about feelings openly",
          emoji: "💬",
          description: "Open communication helps process emotions healthily",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/teens/journal-of-stress");
  };

  return (
    <GameShell
      title="Debate: Boys Should Not Cry?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="health-male-teen-56"
      gameType="health-male"
      totalLevels={60}
      currentLevel={56}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Emotional Expression Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BoysShouldNotCryDebate;
