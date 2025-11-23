import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SportsStory = () => {
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
      text: "Teen girl wants to join football team. Should coach stop her?",
      options: [
        {
          id: "a",
          text: "Yes, football is only for boys",
          emoji: "🚫",
          description: "That's not right. Sports should be open to everyone regardless of gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, give her a fair tryout",
          emoji: "⚽",
          description: "That's right! Everyone should have the opportunity to participate in sports they're interested in.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "A girl is the best player on the basketball team. Should she be captain?",
      options: [
        {
          id: "a",
          text: "No, only boys can be captains",
          emoji: "♂️",
          description: "That's not fair. Leadership positions should be based on skill and qualities, not gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, if she's the most qualified",
          emoji: "🏆",
          description: "Perfect! Leadership roles should be based on merit and qualifications, not gender.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "A school allocates more funding to boys' sports than girls' sports. Is this fair?",
      options: [
        {
          id: "a",
          text: "Yes, boys' sports are more important",
          emoji: "💰",
          description: "That's not equitable. Schools should provide equal resources and opportunities for all sports.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, equal funding for equal sports",
          emoji: "⚖️",
          description: "Great choice! Equal funding ensures fair opportunities for all student athletes.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "A girl wants to try out for the wrestling team. How should the school respond?",
      options: [
        {
          id: "a",
          text: "Create separate rules or prevent her from joining",
          emoji: "🙅",
          description: "That's not inclusive. Schools should accommodate all students who want to participate in sports.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Allow her to try out with appropriate safety measures",
          emoji: "✅",
          description: "Wonderful! With proper safety measures, everyone should be able to participate in sports they enjoy.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "A talented female athlete is told she's not as strong as male athletes. How should she respond?",
      options: [
        {
          id: "a",
          text: "Give up because of the comparison",
          emoji: "😔",
          description: "That's not empowering. Everyone has their own strengths and abilities.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus on her own progress and achievements",
          emoji: "💪",
          description: "Excellent! Focusing on personal growth and achievements builds confidence and resilience.",
          isCorrect: true
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
      title="Sports Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-25"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={25}
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
          
          <h2 className="text-xl font-semibold text-white mb-6">
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

export default SportsStory;