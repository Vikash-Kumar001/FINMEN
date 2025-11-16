import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SharingStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel scared. Should you hide it or tell your parents?",
      options: [
        {
          id: "a",
          text: "Tell parents - they can help and support you",
          emoji: "👨‍👩‍👧",
          description: "Exactly! Sharing your fears with trusted adults helps you feel better and keeps you safe.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide it - they might get angry",
          emoji: "🤐",
          description: "That's not the best choice. Hiding fears can make them worse. Trusted adults want to help you feel safe.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You're feeling lonely. What should you do?",
      options: [
        {
          id: "a",
          text: "Talk to a friend or family member",
          emoji: "💬",
          description: "Great choice! Talking to someone helps you feel connected and less alone.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay by yourself and avoid others",
          emoji: "👤",
          description: "That might make you feel more isolated. Reaching out to others usually helps with loneliness.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're excited about something. Should you share this feeling?",
      options: [
        {
          id: "a",
          text: "Yes, sharing positive feelings spreads joy",
          emoji: "😄",
          description: "Wonderful! Sharing happy feelings can make others happy too and strengthen your relationships.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, keep it to yourself",
          emoji: "🤫",
          description: "Actually, sharing positive feelings can bring people closer together and create a more joyful environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You feel embarrassed about something you did. What's best?",
      options: [
        {
          id: "a",
          text: "Talk to someone you trust about it",
          emoji: "🤗",
          description: "Perfect! Talking about embarrassing moments with trusted people helps you process the feelings and learn.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never mention it to anyone",
          emoji: "🙈",
          description: "Keeping embarrassing feelings bottled up can make you worry more. Trusted people can help you feel better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You're feeling overwhelmed with schoolwork. What should you do?",
      options: [
        {
          id: "a",
          text: "Tell a teacher or parent about your feelings",
          emoji: "📚",
          description: "Excellent! Sharing when you're overwhelmed helps adults support you and find solutions together.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pretend everything is fine",
          emoji: "😐",
          description: "Pretending everything is fine won't solve the problem. Sharing your struggles helps find real solutions.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Sharing Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-55"
      gameType="health-female"
      totalLevels={60}
      currentLevel={55}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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

export default SharingStory;