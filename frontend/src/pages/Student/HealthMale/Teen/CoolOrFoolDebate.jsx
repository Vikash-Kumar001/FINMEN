import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CoolOrFoolDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is smoking/drinking cool or harmful?",
      options: [
        {
          id: "a",
          text: "Cool",
          emoji: "😎",
          description: "Substance use causes serious health problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Makes you popular",
          emoji: "⭐",
          description: "Real friends respect healthy choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Harmful",
          emoji: "⚠️",
          description: "Substance use damages health and future opportunities",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What happens when teens use substances to seem cool?",
      options: [
        {
          id: "b",
          text: "Gains real respect",
          emoji: "🏆",
          description: "Substance use often leads to loss of respect",
          isCorrect: false
        },
        {
          id: "a",
          text: "Impresses everyone",
          emoji: "👏",
          description: "Most people respect healthy, responsible choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Creates health problems",
          emoji: "🏥",
          description: "Substance use harms developing teen bodies",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How should teens respond to friends who use substances?",
      options: [
        {
          id: "a",
          text: "Join them to fit in",
          emoji: "👥",
          description: "Healthy choices are more important than fitting in",
          isCorrect: false
        },
        {
          id: "c",
          text: "Encourage healthy alternatives",
          emoji: "💪",
          description: "Supporting positive activities helps everyone",
          isCorrect: true
        },
        {
          id: "b",
          text: "Judge and criticize",
          emoji: "👎",
          description: "Understanding and support are more effective",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is the 'cool' thing about staying substance-free?",
      options: [
        {
          id: "b",
          text: "Being different",
          emoji: "🦄",
          description: "Making healthy choices shows real strength",
          isCorrect: false
        },
        {
          id: "a",
          text: "Protecting your future",
          emoji: "🚀",
          description: "Substance-free life leads to more opportunities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Following rules",
          emoji: "📋",
          description: "Health choices benefit your own well-being",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How does society view teen substance use?",
      options: [
        {
          id: "a",
          text: "As a rite of passage",
          emoji: "🎭",
          description: "Society increasingly discourages teen substance use",
          isCorrect: false
        },
        {
          id: "b",
          text: "As normal teen behavior",
          emoji: "😊",
          description: "Most teens choose healthy lifestyles",
          isCorrect: false
        },
        {
          id: "c",
          text: "As a serious health risk",
          emoji: "⚠️",
          description: "Substance use is recognized as harmful to teens",
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
    navigate("/student/health-male/teens/journal-of-awareness");
  };

  return (
    <GameShell
      title="Debate: Cool or Fool?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="health-male-teen-86"
      gameType="health-male"
      totalLevels={90}
      currentLevel={86}
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
            <h3 className="text-2xl font-bold text-white mb-2">Substance Use Debate</h3>
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

export default CoolOrFoolDebate;
