import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HomeworkStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "In Ravi's house, only his sister is asked to clean the dishes after dinner, while he is allowed to watch TV. What is the fair thing to do?",
      options: [
        {
          id: "a",
          text: "Let only his sister do all the household chores",
          emoji: "🧹",
          description: "That's not fair. Household chores should be shared among all family members.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Both Ravi and his sister should share household chores equally",
          emoji: "🤝",
          description: "Great! Sharing household responsibilities equally promotes fairness and teaches responsibility to everyone.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Neither of them should do any household chores",
          emoji: "📺",
          description: "That's not practical. Everyone should contribute to household maintenance.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Ravi's parents always ask his sister to help with cooking but never ask him. When he offers to help, his parents say it's not his job. How should this be handled?",
      options: [
        {
          id: "a",
          text: "Accept that cooking is only for girls in their family",
          emoji: "👩",
          description: "That's not promoting equality. Cooking is a life skill everyone should learn.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that cooking is a skill everyone should learn regardless of gender",
          emoji: "👨‍🍳",
          description: "Perfect! Cooking is a valuable life skill that everyone should learn, regardless of gender.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let his sister handle all the cooking without question",
          emoji: "🙅",
          description: "That's not fair. Everyone should have the opportunity to learn life skills.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Ravi's sister has to take care of their younger sibling every day after school, while Ravi can go play with friends. What would be fair?",
      options: [
        {
          id: "a",
          text: "Only girls should take care of younger siblings",
          emoji: "👧",
          description: "That's not fair. Childcare responsibilities should be shared.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Both Ravi and his sister should take turns caring for their sibling",
          emoji: "👶",
          description: "Wonderful! Sharing childcare responsibilities teaches empathy and cooperation.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Neither should take care of their younger sibling",
          emoji: "🏃",
          description: "That's not responsible. Family members should help care for each other.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "When it comes to helping with grocery shopping, Ravi's parents only take his sister along. What should they do instead?",
      options: [
        {
          id: "a",
          text: "Continue taking only his sister for shopping",
          emoji: "🛒",
          description: "That's not inclusive. Everyone should learn practical life skills.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Take both children to teach them both about shopping and budgeting",
          emoji: "👨‍👩‍👧‍👦",
          description: "Excellent! Teaching life skills to all children equally prepares them for adulthood.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stop going shopping altogether",
          emoji: "🏠",
          description: "That's not practical. Shopping is a necessary life activity.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Ravi's parents give his sister a smaller allowance because 'she won't need as much money as a boy.' What is the right approach?",
      options: [
        {
          id: "a",
          text: "Accept that boys need more money than girls",
          emoji: "💰",
          description: "That's not fair. Financial resources should be based on needs and responsibilities, not gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Give both children equal allowance for equal responsibilities",
          emoji: "⚖️",
          description: "Great! Equal treatment in allowances for equal responsibilities promotes fairness and self-worth.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give neither child an allowance",
          emoji: "❌",
          description: "That's not teaching financial responsibility. Allowances help children learn money management.",
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
      title="Homework Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-25"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={25}
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

export default HomeworkStory;