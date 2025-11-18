import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionsEqualsWeaknessDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is showing emotions weak or strong?",
      options: [
        {
          id: "b",
          text: "Strong",
          emoji: "💪",
          description: "Expressing emotions takes courage and builds emotional intelligence",
          isCorrect: true
        },
        {
          id: "a",
          text: "Weak",
          emoji: "😔",
          description: "Suppressing emotions can harm mental health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only for certain emotions",
          emoji: "🤔",
          description: "All emotions are valid and should be expressed healthily",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when men express emotions?",
      options: [
        {
          id: "a",
          text: "They appear weaker",
          emoji: "😞",
          description: "Expressing emotions shows emotional maturity",
          isCorrect: false
        },
        {
          id: "c",
          text: "They build stronger relationships",
          emoji: "🤝",
          description: "Open emotional expression improves connections with others",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing changes",
          emoji: "😐",
          description: "Emotional expression leads to better mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should society view men who express emotions?",
      options: [
        {
          id: "b",
          text: "As less masculine",
          emoji: "👎",
          description: "Emotional expression is a sign of strength",
          isCorrect: false
        },
        {
          id: "a",
          text: "As emotionally healthy",
          emoji: "❤️",
          description: "Healthy emotional expression benefits everyone",
          isCorrect: true
        },
        {
          id: "c",
          text: "As attention-seeking",
          emoji: "📢",
          description: "Expressing emotions is a normal human need",
          isCorrect: false
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
    navigate("/student/health-male/teens/journal-of-masculinity");
  };

  return (
    <GameShell
      title="Debate: Emotions = Weakness?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="health-male-teen-66"
      gameType="health-male"
      totalLevels={70}
      currentLevel={66}
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
            <h3 className="text-2xl font-bold text-white mb-2">Emotions & Strength Debate</h3>
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

export default EmotionsEqualsWeaknessDebate;
