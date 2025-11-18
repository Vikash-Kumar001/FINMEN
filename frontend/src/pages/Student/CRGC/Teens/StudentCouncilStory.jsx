import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StudentCouncilStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen elected as class rep. Should she serve all or only friends?",
      options: [
        {
          id: "a",
          text: "Serve all students fairly",
          emoji: "👥",
          description: "That's right! A good representative serves all constituents equally, not just personal friends.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only help close friends",
          emoji: "👬",
          description: "That's not right. Favoring friends over other students is unfair and undermines the representative's role.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Do whatever is easiest",
          emoji: "🛋️",
          description: "That's not responsible leadership. A representative should prioritize the needs of their constituents.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should the class representative gather input from students?",
      options: [
        {
          id: "a",
          text: "Listen to diverse perspectives",
          emoji: "👂",
          description: "That's right! Good leaders listen to all perspectives to make informed decisions that benefit everyone.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only listen to popular opinions",
          emoji: "📢",
          description: "That's not inclusive. Good leaders consider all viewpoints, not just the loudest or most popular ones.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make decisions without consultation",
          emoji: "🤐",
          description: "That's not democratic. Representatives should engage with those they represent to understand their needs.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should the representative do when facing conflicting requests?",
      options: [
        {
          id: "a",
          text: "Find balanced solutions",
          emoji: "⚖️",
          description: "That's right! Good leaders work to find solutions that fairly address different needs and perspectives.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Always side with friends",
          emoji: "🤝",
          description: "That's not fair. Prioritizing friends over others creates inequality and undermines trust in leadership.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid making any decisions",
          emoji: "⏳",
          description: "That's not leadership. Avoiding decisions fails to serve those who elected the representative.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should the representative handle criticism?",
      options: [
        {
          id: "a",
          text: "Consider feedback constructively",
          emoji: "🤔",
          description: "That's right! Good leaders use constructive criticism to improve their service to constituents.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore all criticism",
          emoji: "🙉",
          description: "That's not wise. Ignoring feedback prevents growth and improvement in serving others.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Retaliate against critics",
          emoji: "😠",
          description: "That's not leadership. Retaliation undermines trust and creates a hostile environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the most important quality for a student representative?",
      options: [
        {
          id: "a",
          text: "Integrity and fairness",
          emoji: "💎",
          description: "That's right! Integrity and fairness are essential for earning and maintaining the trust of those you represent.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Popularity with friends",
          emoji: "⭐",
          description: "That's not the primary role. While relationships matter, a representative's primary duty is to all constituents.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding difficult decisions",
          emoji: "😴",
          description: "That's not leadership. Effective representatives must be willing to make difficult but necessary decisions.",
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Student Council Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-91"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={91}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default StudentCouncilStory;