import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RefugeeStory = () => {
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
      text: "A refugee girl joins your class. Should you welcome her?",
      options: [
        {
          id: "a",
          text: "Yes, welcome her",
          emoji: "🌍",
          description: "That's right! Welcoming newcomers creates an inclusive environment where everyone feels valued.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, ignore her",
          emoji: "🚫",
          description: "That's not kind. Everyone deserves to feel welcomed and accepted, especially those who have had difficult experiences.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The refugee girl seems lonely during lunch. What should you do?",
      options: [
        {
          id: "a",
          text: "Invite her to sit with you and your friends",
          emoji: "🍱",
          description: "Perfect! Including others who seem lonely helps them feel part of the community.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Let her eat alone",
          emoji: "😔",
          description: "That's not compassionate. A small act of inclusion can make a big difference in someone's day.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Some classmates are making fun of the refugee girl's accent. How should you respond?",
      options: [
        {
          id: "a",
          text: "Join in the teasing",
          emoji: "😈",
          description: "That's hurtful and wrong. Making fun of someone's accent is a form of bullying.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stand up for her and tell the others to stop",
          emoji: "✋",
          description: "Great choice! Standing up against bullying protects others and promotes respect.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "The refugee girl needs help understanding the homework. What's the right thing to do?",
      options: [
        {
          id: "a",
          text: "Offer to help her understand",
          emoji: "📚",
          description: "Wonderful! Helping classmates with their studies builds supportive relationships and academic success.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell her to figure it out herself",
          emoji: "🙄",
          description: "That's not helpful. Offering academic support to classmates creates a positive learning environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The refugee girl shares that she misses her home country. How should you respond?",
      options: [
        {
          id: "a",
          text: "Listen with empathy and ask her to tell you about it",
          emoji: "👂",
          description: "Excellent! Listening to others' experiences with empathy helps build understanding and connection.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell her to forget about her old life",
          emoji: "🤐",
          description: "That's dismissive. Everyone has a right to remember and cherish their past experiences.",
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
      title="Refugee Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-5"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={5}
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

export default RefugeeStory;