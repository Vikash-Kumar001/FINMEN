import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AngerStory = () => {
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
      text: "Your friend breaks your favorite toy by accident. You feel very angry. What should you do?",
      options: [
        {
          id: "b",
          text: "Hit your friend",
          emoji: "👊",
          description: "Hitting hurts others and makes problems worse",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take deep breaths and calm down",
          emoji: "🧘",
          description: "Calming down helps you think clearly and solve problems",
          isCorrect: true
        },
        {
          id: "c",
          text: "Break their toy too",
          emoji: "💥",
          description: "Breaking things doesn't fix problems and makes everyone sad",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your sibling takes your turn on the game without asking. You feel mad! What's the best choice?",
      options: [
        {
          id: "c",
          text: "Yell and call them names",
          emoji: "😡",
          description: "Mean words hurt feelings and don't solve anything",
          isCorrect: false
        },

        {
          id: "b",
          text: "Push them away from the game",
          emoji: "🤜",
          description: "Pushing can hurt and doesn't teach good manners",
          isCorrect: false
        },
         {
          id: "a",
          text: "Say 'I feel angry when you don't wait your turn'",
          emoji: "💬",
          description: "Using words to express feelings helps others understand",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "You lose a game and feel angry at yourself. What should you do?",
      options: [
       {
          id: "a",
          text: "Say 'It's okay, I'll try again next time'",
          emoji: "🔄",
          description: "Being kind to yourself helps you learn and grow",
          isCorrect: true
        },
        {
          id: "b",
          text: "Throw the game pieces",
          emoji: "🎲",
          description: "Throwing things can break them and hurt others",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up and never play again",
          emoji: "😞",
          description: "Everyone loses sometimes, it's okay to try again",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your parents say no to getting a pet. You feel angry! What's healthy?",
      options: [
        {
          id: "c",
          text: "Slam doors and stomp feet",
          emoji: "🚪",
          description: "This scares others and doesn't change the answer",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ask why and talk about your feelings",
          emoji: "🗣️",
          description: "Talking helps parents understand and explain their reasons",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay mad and don't talk to them",
          emoji: "😠",
          description: "Talking is better than staying angry alone",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You feel angry because you can't have ice cream before dinner. What helps?",
      options: [
        {
          id: "b",
          text: "Sneak ice cream when no one is looking",
          emoji: "🍨",
          description: "Sneaking breaks trust and doesn't solve the real issue",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cry and say you'll never eat dinner",
          emoji: "😢",
          description: "Big reactions don't help, calm talking does",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wait for dessert time and enjoy it then",
          emoji: "⏰",
          description: "Waiting helps you learn patience and enjoy things more",
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
    navigate("/student/health-male/kids/reflex-emotion-alert");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Anger Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-58"
      gameType="health-male"
      totalLevels={60}
      currentLevel={58}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
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

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default AngerStory;
