import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproductiveHealthDebateTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Friend says: 'Reproductive health should only be taught to adults!' What do you think?",
      options: [
        {
          id: "b",
          text: "Agree, it's only for adults",
          emoji: "👨",
          description: "Teens need reproductive health education to make informed choices",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, but taught responsibly",
          emoji: "✅",
          description: "Age-appropriate education helps teens stay healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "No education needed",
          emoji: "❌",
          description: "Knowledge prevents health problems and misinformation",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Parent says: 'We shouldn't talk about reproductive health in school.' How do you respond?",
      options: [
        {
          id: "c",
          text: "Stay silent",
          emoji: "🤐",
          description: "Open discussion helps teens understand their bodies",
          isCorrect: false
        },
        {
          id: "a",
          text: "Explain it helps teens make healthy choices",
          emoji: "💪",
          description: "Education empowers teens to take care of their health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Argue that it's embarrassing",
          emoji: "😳",
          description: "Reproductive health education reduces embarrassment through knowledge",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Teacher asks: 'Should reproductive health be part of school curriculum?' Your view?",
      options: [
        {
          id: "a",
          text: "Yes, it's essential for teen health",
          emoji: "🏥",
          description: "School provides accurate information from qualified teachers",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only basic information needed",
          emoji: "📝",
          description: "Comprehensive education prevents health issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "No, families should teach it",
          emoji: "👨‍👩‍👧‍👦",
          description: "Schools complement family education with medical facts",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Classmate says: 'Reproductive health education makes teens curious about sex.' What do you say?",
      options: [
        {
          id: "b",
          text: "Agree, it encourages bad behavior",
          emoji: "👎",
          description: "Education provides facts, not encouragement",
          isCorrect: false
        },
        {
          id: "a",
          text: "Education provides healthy understanding",
          emoji: "🧠",
          description: "Knowledge helps teens make responsible decisions",
          isCorrect: true
        },
        {
          id: "c",
          text: "Change the subject",
          emoji: "😶",
          description: "Addressing concerns openly builds understanding",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Health expert says: 'Reproductive health education should include emotional aspects.' Do you agree?",
      options: [
        {
          id: "c",
          text: "No, only physical facts matter",
          emoji: "🔬",
          description: "Emotional health is part of overall wellbeing",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, both body and emotions matter",
          emoji: "❤️",
          description: "Reproductive health affects physical and emotional development",
          isCorrect: true
        },
        {
          id: "b",
          text: "Maybe, but not important",
          emoji: "🤷",
          description: "Understanding emotions helps with puberty changes",
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
    navigate("/student/health-male/teens/puberty-awareness-journal");
  };

  return (
    <GameShell
      title="Debate: Talking About Reproductive Health (Teen)"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 10}
      gameId="health-male-teen-36"
      gameType="health-male"
      totalLevels={100}
      currentLevel={36}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 36/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 10}</span>
          </div>

          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl mb-4">
              <p className="font-bold">💬 Debate Topic</p>
            </div>
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

export default ReproductiveHealthDebateTeen;
