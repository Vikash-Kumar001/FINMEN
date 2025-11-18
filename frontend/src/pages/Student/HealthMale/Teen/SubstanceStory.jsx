import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SubstanceStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen at party sees drugs. Should he take them?",
      options: [
        {
          id: "b",
          text: "No, absolutely not",
          emoji: "✋",
          description: "Drugs are dangerous and illegal for teens",
          isCorrect: true
        },
        {
          id: "c",
          text: "Try just a little",
          emoji: "🤏",
          description: "Any drug use can lead to addiction and health problems",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ask what they are",
          emoji: "❓",
          description: "Curiosity doesn't justify trying dangerous substances",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends offer you drugs at a party. What's your response?",
      options: [
        {
          id: "a",
          text: "Firmly say no and leave",
          emoji: "🚪",
          description: "Clear boundaries protect your health and future",
          isCorrect: true
        },
        {
          id: "b",
          text: "Say maybe later",
          emoji: "⏰",
          description: "Delays can lead to giving in to pressure",
          isCorrect: false
        },
        {
          id: "c",
          text: "Take them to fit in",
          emoji: "😔",
          description: "True friends won't pressure you into harm",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you handle drug pressure from friends?",
      options: [
        {
          id: "c",
          text: "Report to authorities",
          emoji: "📞",
          description: "Talking to trusted adults is often best approach",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and explain why",
          emoji: "💬",
          description: "Educating friends can help them understand risks",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try it once to see",
          emoji: "🤔",
          description: "Even trying once can have serious consequences",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if someone offers you drugs?",
      options: [
        {
          id: "a",
          text: "Politely but firmly refuse",
          emoji: "✋",
          description: "Clear refusal shows strength and self-respect",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pretend to take them",
          emoji: "🎭",
          description: "Honest refusal is always best",
          isCorrect: false
        },
        {
          id: "b",
          text: "Take them secretly",
          emoji: "🤫",
          description: "No substance use is safe for teens",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you help friends avoid drugs?",
      options: [
        {
          id: "b",
          text: "Be a positive influence",
          emoji: "⭐",
          description: "Setting good example helps friends make healthy choices",
          isCorrect: true
        },
        {
          id: "a",
          text: "Force them to stop",
          emoji: "🛑",
          description: "Support is better than force",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore their choices",
          emoji: "🙈",
          description: "Supporting healthy decisions helps friends",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/teens/cool-or-fool-debate");
  };

  return (
    <GameShell
      title="Substance Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-85"
      gameType="health-male"
      totalLevels={90}
      currentLevel={85}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default SubstanceStory;
