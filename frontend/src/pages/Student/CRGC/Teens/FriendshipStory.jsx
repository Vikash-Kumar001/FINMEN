import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendshipStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen argues with best friend. Should she apologize or stay angry?",
      options: [
        {
          id: "a",
          text: "Stay angry to show her friend who's boss",
          emoji: "😠",
          description: "That's not healthy. Staying angry damages friendships and prevents resolution.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Apologize if she was wrong and try to make amends",
          emoji: "🙏",
          description: "That's right! Apologizing when you've hurt someone shows maturity and helps repair relationships.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the friend completely from now on",
          emoji: "🚫",
          description: "That's not helpful. Ending a friendship over a disagreement prevents growth and resolution.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Her friend also apologizes after realizing their part in the argument. How should she respond?",
      options: [
        {
          id: "a",
          text: "Accept the apology and forgive them",
          emoji: "🤗",
          description: "Perfect! Accepting apologies and forgiving others helps heal relationships and move forward positively.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hold a grudge and bring it up in future arguments",
          emoji: "😤",
          description: "That's not healthy. Holding grudges prevents healing and damages relationships over time.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Demand they never make that mistake again",
          emoji: "👑",
          description: "That's not realistic. Everyone makes mistakes, and demanding perfection damages relationships.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "They decide to talk about what triggered the argument. What's the benefit of this approach?",
      options: [
        {
          id: "a",
          text: "It helps them understand each other better",
          emoji: "🧠",
          description: "That's right! Understanding each other's triggers helps prevent similar arguments in the future.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It allows them to blame each other more effectively",
          emoji: "⚔️",
          description: "That's not helpful. Blaming each other escalates conflicts rather than resolving them.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's unnecessary since they've already apologized",
          emoji: "🤐",
          description: "That's not right. Understanding the root cause helps prevent future conflicts and strengthens the relationship.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "They establish some ground rules for future disagreements. What should these rules include?",
      options: [
        {
          id: "a",
          text: "Listen respectfully and take breaks when emotions run high",
          emoji: "👂",
          description: "That's perfect! These rules create a healthy framework for handling future disagreements constructively.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never argue about anything important",
          emoji: "🤫",
          description: "That's not healthy. Avoiding important topics prevents growth and can lead to resentment.",
          isCorrect: false
        },
        {
          id: "c",
          text: "The person who apologizes first loses the argument",
          emoji: "⚖️",
          description: "That's not right. Apologizing shows maturity, not weakness, and helps maintain healthy relationships.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How has their friendship changed after working through this conflict?",
      options: [
        {
          id: "a",
          text: "It's stronger because they learned to communicate better",
          emoji: "💪",
          description: "That's right! Working through conflicts constructively strengthens relationships and builds trust.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's weaker because they argued",
          emoji: "💔",
          description: "That's not accurate. When handled well, conflicts can actually strengthen relationships through better understanding.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's the same as before with no changes",
          emoji: "🔄",
          description: "That's not right. Working through conflicts should lead to growth and better communication in relationships.",
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
      title="Friendship Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-45"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={45}
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

export default FriendshipStory;