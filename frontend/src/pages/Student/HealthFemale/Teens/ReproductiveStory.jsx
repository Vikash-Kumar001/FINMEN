import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproductiveStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "In health class, the teacher begins explaining reproductive health. This is a normal part of growing up. What should the girls do?",
      options: [
        {
          id: "a",
          text: "Listen calmly and respectfully",
          emoji: "👂",
          description: "Correct! Reproductive health is an important topic that helps us understand our bodies as we grow.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Giggle and make jokes about it",
          emoji: "😂",
          description: "Not quite. Making jokes can make others uncomfortable. It's better to listen respectfully.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Put their hands over their ears",
          emoji: "🙉",
          description: "This isn't helpful. It's important to learn about our bodies and health as we grow.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A friend asks you about changes happening to her body. What is the best response?",
      options: [
        {
          id: "a",
          text: "Tell her it's normal and she can talk to a trusted adult",
          emoji: "💬",
          description: "Correct! Body changes are normal, and talking to a trusted adult is always a good idea.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make fun of her for asking",
          emoji: "😒",
          description: "Not appropriate. We should be supportive and kind to our friends.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore her question",
          emoji: "🤐",
          description: "It's better to be supportive. Friends should help each other.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You notice changes in your body that worry you. What should you do?",
      options: [
        {
          id: "a",
          text: "Talk to a parent, teacher, or healthcare provider",
          emoji: "👩‍⚕️",
          description: "Correct! Talking to trusted adults helps you understand what's normal and get support.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep it to yourself and worry alone",
          emoji: "😰",
          description: "It's always better to talk to someone you trust. You don't have to face concerns alone.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Search online without guidance",
          emoji: "🔍",
          description: "While information is helpful, it's better to talk to a trusted adult who can guide you properly.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your friend is embarrassed about body changes. How can you help?",
      options: [
        {
          id: "a",
          text: "Reassure her that changes are normal and everyone goes through them",
          emoji: "🤗",
          description: "Correct! Being supportive and reassuring helps friends feel better about natural changes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell her she's weird",
          emoji: "😤",
          description: "This is hurtful. We should be kind and supportive to our friends.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Share her concerns with others without permission",
          emoji: "📢",
          description: "Privacy is important. We should respect our friends' feelings and keep personal matters private.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Learning about reproductive health helps you:",
      options: [
        {
          id: "a",
          text: "Understand your body and make informed decisions",
          emoji: "🧠",
          description: "Correct! Knowledge about reproductive health helps you understand your body and make healthy choices.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Feel embarrassed and confused",
          emoji: "😳",
          description: "While it might feel awkward at first, learning helps reduce confusion and builds confidence.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid talking about health topics",
          emoji: "🚫",
          description: "Actually, learning helps you feel more comfortable discussing important health topics.",
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
    navigate("/student/health-female/teens/quiz-reproductive-basics");
  };

  return (
    <GameShell
      title="Reproductive Story"
      subtitle={`Level 31 of 40`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-31"
      gameType="health-female"
      totalLevels={40}
      currentLevel={31}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => (
              <div
                key={option.id}
                onClick={() => !choices.find(c => c.question === currentQuestion) && handleChoice(option.id)}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  choices.find(c => c.question === currentQuestion)?.optionId === option.id
                    ? option.isCorrect
                      ? "border-green-400 bg-green-500/20"
                      : "border-red-400 bg-red-500/20"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
                
                {choices.find(c => c.question === currentQuestion)?.optionId === option.id && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    option.isCorrect ? "bg-green-500/30 text-green-200" : "bg-red-500/30 text-red-200"
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReproductiveStory;