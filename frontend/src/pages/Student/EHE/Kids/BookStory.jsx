import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BookStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You finish one book. Should you stop reading forever or read more?",
      options: [
        {
          id: "a",
          text: "Stop reading forever",
          emoji: "🚫",
          description: "Reading is a lifelong skill that helps you learn and grow!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Read more books",
          emoji: "📚",
          description: "Great choice! Reading more books helps you learn new things and expand your knowledge!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Reading helps you:",
      options: [
        {
          id: "a",
          text: "Become smarter and learn new things",
          emoji: "🧠",
          description: "Exactly! Reading expands your knowledge and improves your thinking skills!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Waste time that could be spent playing",
          emoji: "🎮",
          description: "Reading is valuable for learning and personal growth, not a waste of time!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do after finishing a book you enjoyed?",
      options: [
        {
          id: "a",
          text: "Look for another book by the same author",
          emoji: "📖",
          description: "Good idea! If you liked one book, you might enjoy more by the same author!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never read again because you already finished one",
          emoji: "❌",
          description: "Don't stop! There are so many great books to discover!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Reading different types of books helps you:",
      options: [
        {
          id: "a",
          text: "Understand different topics and perspectives",
          emoji: "🌍",
          description: "Perfect! Different books teach you about various subjects and ways of thinking!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Get confused because they all say different things",
          emoji: "😵",
          description: "Actually, different perspectives help you think more critically and broadly!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's a good reading habit?",
      options: [
        {
          id: "a",
          text: "Read for a few minutes every day",
          emoji: "📅",
          description: "Excellent! Regular reading builds your knowledge and improves your skills over time!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only read when you're bored",
          emoji: "😴",
          description: "Reading is valuable anytime, not just when you're bored!",
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
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Book Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-91"
      gameType="ehe"
      totalLevels={10}
      currentLevel={91}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
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

export default BookStory;