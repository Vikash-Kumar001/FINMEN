import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReligionStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A friend prays differently. Should you laugh or respect?",
      options: [
        {
          id: "a",
          text: "Laugh at their different prayer style",
          emoji: "😂",
          description: "That's not respectful. Making fun of someone's religious practices is hurtful and shows intolerance.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Respect their prayer style and beliefs",
          emoji: "🙏",
          description: "That's right! Respecting different religious practices promotes understanding and inclusion.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "A classmate wears religious clothing. What should you do?",
      options: [
        {
          id: "a",
          text: "Ask questions respectfully to learn more",
          emoji: "❓",
          description: "Perfect! Showing genuine interest in someone's religious clothing helps build understanding.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make comments about their clothing",
          emoji: "👕",
          description: "That's not kind. Making comments about someone's religious clothing is disrespectful.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Different religious holidays are celebrated at school. Should you participate?",
      options: [
        {
          id: "a",
          text: "Learn about and respect all religious holidays",
          emoji: "🎉",
          description: "Great choice! Learning about different religious holidays shows respect for diversity.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the celebrations",
          emoji: "🚫",
          description: "That's not inclusive. Participating respectfully in religious celebrations helps build community.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A friend invites you to their religious service. How should you respond?",
      options: [
        {
          id: "a",
          text: "Thank them for the invitation and ask respectful questions",
          emoji: "🤝",
          description: "Wonderful! Being open to learning about different religions shows respect and curiosity.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Decline rudely and make fun of their beliefs",
          emoji: "😒",
          description: "That's hurtful. Being rude about someone's religious beliefs damages relationships.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Religious discussions happen in class. What should you do?",
      options: [
        {
          id: "a",
          text: "Listen respectfully and share your own views politely",
          emoji: "👂",
          description: "Excellent! Listening respectfully and sharing views politely promotes healthy dialogue.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Mock others' religious beliefs",
          emoji: "😆",
          description: "That's inappropriate. Mocking others' religious beliefs creates division and hurt feelings.",
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
      title="Religion Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-15"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={15}
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

export default ReligionStory;