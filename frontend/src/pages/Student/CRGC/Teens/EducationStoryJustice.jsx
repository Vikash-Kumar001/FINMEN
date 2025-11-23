import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EducationStory2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teenage girl in your community is forced to quit school for an arranged marriage. Is this right?",
      options: [
        {
          id: "a",
          text: "Yes, it's a family decision",
          emoji: "👪",
          description: "That's not right. Education is a fundamental right, and forcing someone to quit school violates that right.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, education is a basic right",
          emoji: "📚",
          description: "That's right! Education is a fundamental human right that should not be denied for any reason, including marriage.",
          isCorrect: true
        },
        {
          id: "c",
          text: "It depends on the girl's wishes",
          emoji: "🤔",
          description: "While personal wishes matter, education is a basic right that should be protected regardless of individual preferences.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do if you know someone in this situation?",
      options: [
        {
          id: "a",
          text: "Ignore it, it's not your business",
          emoji: "😶",
          description: "That's not helpful. When someone's basic rights are being violated, it's everyone's responsibility to help.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Report it to appropriate authorities",
          emoji: "📞",
          description: "That's right! Reporting child marriage and educational rights violations to authorities can help protect the individual.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Confront the family aggressively",
          emoji: "😠",
          description: "That's not the best approach. Aggressive confrontation can escalate the situation and potentially harm the person at risk.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is education especially important for girls?",
      options: [
        {
          id: "a",
          text: "It helps them become financially independent",
          emoji: "💰",
          description: "That's right! Education empowers girls to become financially independent and make informed decisions about their lives.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's only important for boys",
          emoji: "👦",
          description: "That's incorrect. Education is equally important for all genders and is essential for personal and societal development.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It makes them better wives",
          emoji: "💍",
          description: "That's not the main purpose. Education is valuable for personal growth, empowerment, and contribution to society, not just relationships.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can communities support girls' education?",
      options: [
        {
          id: "a",
          text: "Provide scholarships and safe transportation",
          emoji: "🎓",
          description: "That's right! Financial support and safe access to education help remove barriers that prevent girls from attending school.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only support boys' education",
          emoji: "🚹",
          description: "That's not right. Equal access to education for all genders is essential for social progress and human rights.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Force girls to study only domestic skills",
          emoji: "🧹",
          description: "That's not supportive. Girls should have the same educational opportunities as boys to pursue their interests and potential.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What are the long-term benefits of girls' education?",
      options: [
        {
          id: "a",
          text: "Healthier families and communities",
          emoji: "🏥",
          description: "That's right! Educated girls tend to have healthier families, participate more in the economy, and raise educated children.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No significant benefits",
          emoji: "❌",
          description: "That's incorrect. Research consistently shows that girls' education has tremendous benefits for individuals, families, and societies.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It makes society less traditional",
          emoji: "🔄",
          description: "Education doesn't eliminate tradition but helps people make informed choices about which traditions to maintain or change.",
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
      title="Education Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-61"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={61}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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

export default EducationStory2;