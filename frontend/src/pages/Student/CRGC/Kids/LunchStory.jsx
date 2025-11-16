import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LunchStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice a classmate's lunch is stolen every day. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore it",
          emoji: "🤫",
          description: "Ignoring a problem that affects someone every day doesn't help them and allows the problem to continue.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell a teacher",
          emoji: "👩‍🏫",
          description: "That's right! Telling a trusted adult helps protect your classmate and stops the problem.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "The teacher asks if you've seen anything. What do you do?",
      options: [
        {
          id: "a",
          text: "Lie to protect the bully",
          emoji: "🤥",
          description: "Lying protects the bully and doesn't help your classmate who is being hurt.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell the truth",
          emoji: "✅",
          description: "Great choice! Telling the truth helps the teacher understand what's happening and take action.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your classmate is scared to tell. How can you help?",
      options: [
        {
          id: "a",
          text: "Tell them to deal with it alone",
          emoji: "-alone",
          description: "Telling someone to deal with bullying alone doesn't help and can make them feel more isolated.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Offer to go with them to talk to an adult",
          emoji: "🤝",
          description: "Perfect! Supporting your friend by going with them shows you care and helps them feel safe.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "The bully threatens you if you tell. What should you do?",
      options: [
        {
          id: "a",
          text: "Stay quiet out of fear",
          emoji: "😨",
          description: "Staying quiet out of fear allows the bullying to continue and potentially hurt others.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell a trusted adult about the threat",
          emoji: "📢",
          description: "That's right! Telling an adult about threats keeps everyone safe and helps address the problem.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The situation is resolved. How can you support your classmate?",
      options: [
        {
          id: "a",
          text: "Make fun of them for being a victim",
          emoji: "😂",
          description: "Making fun of someone who has been through a difficult situation is hurtful and unkind.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Be a good friend and include them",
          emoji: "😊",
          description: "Excellent! Being a good friend and including them helps them feel accepted and valued.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Lunch Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-35"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={35}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
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

export default LunchStory;