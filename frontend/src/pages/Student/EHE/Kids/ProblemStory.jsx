import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ProblemStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "School taps are leaking. What should you do?",
      options: [
        {
          id: "b",
          text: "Ignore it and walk away",
          emoji: "🚶",
          description: "Ignoring problems doesn't solve them!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Think of ways to fix/save water",
          emoji: "💧",
          description: "Perfect! Being proactive about problems helps everyone!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Tell friends to make it worse",
          emoji: "😈",
          description: "That would make the problem bigger!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Who should you tell about the leaking taps?",
      options: [
        {
          id: "c",
          text: "No one, it's not your problem",
          emoji: "🤫",
          description: "Problems are everyone's responsibility!",
          isCorrect: false
        },
        {
          id: "a",
          text: "A teacher or school authority",
          emoji: "👩‍🏫",
          description: "Exactly! Adults can help fix the problem!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Post it on social media",
          emoji: "📱",
          description: "That might cause unnecessary panic!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "While waiting for the taps to be fixed, what can you do?",
      options: [
        {
          id: "a",
          text: "Place buckets to catch water",
          emoji: "🪣",
          description: "Great! That helps save water while waiting!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Use more water to make it worse",
          emoji: "🚿",
          description: "That would waste more water!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame other students",
          emoji: "😠",
          description: "Blaming doesn't solve anything!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you help prevent water waste in school?",
      options: [
        {
          id: "c",
          text: "Leave taps running for fun",
          emoji: "🚰",
          description: "That would waste water!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Report leaks immediately",
          emoji: "📢",
          description: "Good idea, but there's an even better answer!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Turn off taps properly and report leaks",
          emoji: "✅",
          description: "Perfect! Both actions help conserve water!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to solve water problems?",
      options: [
        {
          id: "b",
          text: "To get rewarded by teachers",
          emoji: "🏆",
          description: "That's not the main reason!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To show off to friends",
          emoji: "炫耀",
          description: "That's not why we solve problems!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To conserve resources for everyone",
          emoji: "🌍",
          description: "Exactly! Water conservation helps our planet!",
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
      title="Problem Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-31"
      gameType="ehe"
      totalLevels={10}
      currentLevel={31}
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

export default ProblemStory;