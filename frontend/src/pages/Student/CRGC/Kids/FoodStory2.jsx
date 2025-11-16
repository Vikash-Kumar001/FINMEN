import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FoodStory2 = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friend brings sushi for lunch. Some classmates laugh and say it looks weird. What should you do?",
      options: [
        {
          id: "a",
          text: "Join them in laughing to fit in",
          emoji: "😂",
          description: "That's not respectful. Different foods are part of what makes cultures unique and interesting.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Try a piece respectfully and thank your friend",
          emoji: "🍣",
          description: "That's right! Being open to trying different foods shows respect for other cultures.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore your friend for bringing something different",
          emoji: "😒",
          description: "That's not kind. Your friend shared something special from their culture with you.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "At a potluck, you see dishes from many cultures. How should you approach trying them?",
      options: [
        {
          id: "a",
          text: "Only eat what you recognize and avoid everything else",
          emoji: "🙅",
          description: "That's limiting. Trying new foods is a great way to learn about different cultures.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask questions about the dishes and try a variety",
          emoji: "🤔",
          description: "Perfect! Asking questions and trying different foods helps you learn about other cultures.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Make faces and jokes about unfamiliar foods",
          emoji: "😆",
          description: "That's disrespectful. Making fun of cultural foods can hurt people's feelings.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your family is hosting guests from another country. They bring a traditional dessert. What's the best response?",
      options: [
        {
          id: "a",
          text: "Politely decline since you've never tried it before",
          emoji: "🙅",
          description: "That's not very welcoming. Accepting and trying cultural foods shows respect for your guests.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Thank them and try a small piece to be polite",
          emoji: "😊",
          description: "Great! Accepting and trying cultural foods shows respect and appreciation for your guests.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask if they have any 'normal' desserts instead",
          emoji: "🤨",
          description: "That's not respectful. What's normal for you might be special to others, and it's good to be open to new experiences.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're at a restaurant and see menu items from a culture you're unfamiliar with. What should you do?",
      options: [
        {
          id: "a",
          text: "Stick to what you know and avoid the unfamiliar options",
          emoji: "😰",
          description: "That's playing it safe but not very adventurous. Trying new foods can be a fun way to learn about cultures.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask the server about ingredients and try something new",
          emoji: "🙋",
          description: "That's right! Asking questions and trying new foods is a great way to learn about different cultures.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Point and laugh at the strange names on the menu",
          emoji: "🤣",
          description: "That's not respectful. Different languages and food names are part of what makes cultures unique.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A new student shares a traditional snack from their home country. How should you respond?",
      options: [
        {
          id: "a",
          text: "Thank them for sharing and ask about their culture",
          emoji: "🤗",
          description: "Perfect! Showing interest in someone's culture helps build friendships and understanding.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Refuse because you don't know what's in it",
          emoji: "😒",
          description: "That's not very welcoming. Most traditional foods are safe, and refusing can hurt someone's feelings.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Take a picture to show your friends later",
          emoji: "📸",
          description: "While sharing experiences can be good, it's more important to be present and respectful in the moment.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Food Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-81"
      gameType="civic-responsibility"
      totalLevels={90}
      currentLevel={81}
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

export default FoodStory2;