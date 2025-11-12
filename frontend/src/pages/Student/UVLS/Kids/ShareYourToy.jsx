import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShareYourToy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "You see a new classmate sitting alone at lunch. What do you do?",
      image: "🧸",
      options: [
        { 
          id: "share", 
          text: "Share Toys", 
          emoji: "🤝", 
          description: "Invite them to play with your toys",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Play Alone", 
          emoji: "🙅", 
          description: "Keep playing by yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend forgot their crayons. You have extras. What do you do?",
      image: "🖍️",
      options: [
        { 
          id: "share", 
          text: "Share Crayons", 
          emoji: "🎨", 
          description: "Give them some of your crayons",
          isCorrect: true
        },
        { 
          id: "keep", 
          text: "Keep All", 
          emoji: "❌", 
          description: "Keep all crayons for yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone wants to join your game during recess. What do you do?",
      image: "⚽",
      options: [
        { 
          id: "include", 
          text: "Let Them Join", 
          emoji: "👫", 
          description: "Welcome them to play",
          isCorrect: true
        },
        { 
          id: "exclude", 
          text: "Say No", 
          emoji: "🚫", 
          description: "Tell them to go away",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your sibling wants to play with your favorite toy. What do you do?",
      image: "🎮",
      options: [
        { 
          id: "share", 
          text: "Take Turns", 
          emoji: "🔄", 
          description: "Share and take turns playing",
          isCorrect: true
        },
        { 
          id: "hoard", 
          text: "Keep It", 
          emoji: "😠", 
          description: "Refuse to share",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A friend asks to borrow your pencil. What do you do?",
      image: "✏️",
      options: [
        { 
          id: "lend", 
          text: "Lend Pencil", 
          emoji: "🤲", 
          description: "Let them borrow it",
          isCorrect: true
        },
        { 
          id: "refuse", 
          text: "Say No", 
          emoji: "🙅‍♂️", 
          description: "Don't let them use it",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: scenarios[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: scenarios[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    const isCorrect = scenarios[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1); // +1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 0);
    } else {
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      // Award bonus coins for passing
      if (correctAnswers >= 3 && coins < 3) {
        setCoins(3); // Minimum 3 coins for passing
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentScenario = () => scenarios[currentQuestion];

  return (
    <GameShell
      title="Share Your Toy"
      subtitle={`Scenario ${currentQuestion + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-1"
      gameType="uvls"
      totalLevels={10}
      currentLevel={1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentQuestion + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{getCurrentScenario().image}</div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentScenario().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentScenario().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-105"
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="text-white font-bold mb-1">{option.text}</div>
                    <div className="text-white/70 text-sm">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Well Done!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {finalScore} out of {scenarios.length} correct!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              Total Coins: {coins} 🪙
            </p>
            {finalScore < 3 && (
              <button
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShareYourToy;

