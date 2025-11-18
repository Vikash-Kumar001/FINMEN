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
      text: "Two friends want to play with the same toy. What should they do?",
      options: [
        {
          id: "a",
          text: "Fight over it",
          emoji: "😠",
          description: "That's not a good solution. Fighting can hurt feelings and damage friendships.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Take turns playing with it",
          emoji: "🔄",
          description: "That's right! Taking turns is a fair way for both friends to enjoy the toy.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "One friend wants to play longer. How should they resolve this?",
      options: [
        {
          id: "a",
          text: "Demand to play more",
          emoji: "😤",
          description: "That's not fair. Demanding more time doesn't consider the other person's feelings.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Negotiate a fair time",
          emoji: "🤝",
          description: "Perfect! Negotiating helps both friends feel heard and find a solution that works for everyone.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "They decide to set a timer for turns. What's the benefit of this approach?",
      options: [
        {
          id: "a",
          text: "One person controls the timer",
          emoji: "⏰",
          description: "That's not fair. If one person controls the timer, they might not be honest about time limits.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Both get equal time",
          emoji: "⚖️",
          description: "Great idea! Using a timer ensures both friends get the same amount of time with the toy.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "One friend finishes their turn early. What should they do?",
      options: [
        {
          id: "a",
          text: "Keep playing without telling",
          emoji: "🤫",
          description: "That's not honest. Keeping the toy without telling breaks the agreement and trust.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Let the other friend know",
          emoji: "📢",
          description: "Wonderful! Communicating honestly helps maintain trust and fairness in friendships.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The timer goes off but one friend isn't finished. How should they handle this?",
      options: [
        {
          id: "a",
          text: "Ignore the timer and keep playing",
          emoji: "⏳",
          description: "That's not respectful. Ignoring the timer breaks the agreement made with the other friend.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask for more time politely",
          emoji: "🙏",
          description: "Excellent! Asking politely shows respect and gives the other friend a chance to agree or suggest alternatives.",
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
      title="Sharing Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-45"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={45}
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

export default SharingStory;