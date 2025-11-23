import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GameStory = () => {
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
      text: "Friends can't decide a game. Should you invent new rules?",
      options: [
        {
          id: "c",
          text: "Let them argue until they decide",
          emoji: "😠",
          description: "That doesn't solve the problem!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Refuse to play",
          emoji: "🚫",
          description: "That's not collaborative!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, create fun new rules together",
          emoji: "🎯",
          description: "Perfect! Collaboration and creativity solve the problem!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "How can you make sure everyone enjoys the new game?",
      options: [
        {
          id: "b",
          text: "Make rules that only you like",
          emoji: "👑",
          description: "That's not fair to others!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore others' suggestions",
          emoji: "🙉",
          description: "That's not teamwork!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Include everyone in rule-making",
          emoji: "🤝",
          description: "Exactly! Inclusive creation makes games fun for all!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What if someone doesn't like the new rules?",
      options: [
        {
          id: "a",
          text: "Listen and adjust together",
          emoji: "👂",
          description: "Perfect! Flexibility makes games better for everyone!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Insist they follow your rules",
          emoji: "😤",
          description: "That's not collaborative!",
          isCorrect: false
        },
        {
          id: "c",
          text: "End the game immediately",
          emoji: "🏳️",
          description: "There are better solutions!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the benefit of creating your own games?",
      options: [
        {
          id: "c",
          text: "To prove you're the best",
          emoji: "🏆",
          description: "That's not the main benefit!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To avoid learning existing games",
          emoji: "📚",
          description: "Learning existing games is also valuable!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To develop creativity and teamwork",
          emoji: "🧠",
          description: "Exactly! Game creation builds important skills!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How can you test if your new game rules work?",
      options: [
        {
          id: "b",
          text: "Play without any changes",
          emoji: "🔁",
          description: "That doesn't test your new rules!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make it overly complicated",
          emoji: "🤯",
          description: "Complexity doesn't mean better!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Try a short round and adjust",
          emoji: "🔄",
          description: "Perfect! Testing and iteration improve games!",
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
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Game Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-38"
      gameType="ehe"
      totalLevels={10}
      currentLevel={38}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
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
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default GameStory;