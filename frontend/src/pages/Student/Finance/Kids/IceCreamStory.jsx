import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const IceCreamStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-11";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You have ₹10. You see an ice cream shop. Do you spend on ice cream now or save for a toy you want?",
      options: [
        { 
          id: "save", 
          text: "Save for toy", 
          emoji: "🧸", 
          description: "Save your money for the toy you really want",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy ice cream", 
          emoji: "🍦", 
          description: "Spend money on ice cream right now",
          isCorrect: false
        },
        { 
          id: "split", 
          text: "Save half, spend half", 
          emoji: "⚖️", 
          description: "Save ₹5 for toy and spend ₹5 on ice cream",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend bought an expensive ice cream and is enjoying it. You only have ₹5. What do you do?",
      options: [
        { 
          id: "spend", 
          text: "Buy small treat", 
          emoji: "🍭", 
          description: "Buy a small treat for yourself",
          isCorrect: false
        },
        {
          id: "save",
          text: "Save for bigger goal",
          emoji: "🎯",
          description: "Keep saving for something more important",
          isCorrect: true
        },
        { 
          id: "borrow", 
          text: "Ask to share friend's", 
          emoji: "🤝", 
          description: "Ask your friend if you can share their ice cream",
          isCorrect: false
        },
      ]
    },
    {
      id: 3,
      text: "You planned to save ₹50 for a new book, but see a 'Buy 1 Get 1 Free' ice cream offer. What's smart?",
      options: [
        { 
          id: "save", 
          text: "Stick to savings plan", 
          emoji: "📚", 
          description: "Continue saving for your book",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Take the offer", 
          emoji: "🍦", 
          description: "Buy ice cream because it's a good deal",
          isCorrect: false
        },
        { 
          id: "delay", 
          text: "Buy later if extra money", 
          emoji: "⏰", 
          description: "Wait to see if you get extra money later",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You've saved ₹30 for a bicycle. Your sibling offers to share their ice cream if you buy some. What do you choose?",
      options: [
        { 
          id: "spend", 
          text: "Share treat", 
          emoji: "🍦", 
          description: "Spend ₹10 to share ice cream with sibling",
          isCorrect: false
        },
        {
          id: "save",
          text: "Focus on bicycle",
          emoji: "🚲",
          description: "Keep working toward your bicycle goal",
          isCorrect: true
        },
        { 
          id: "negotiate", 
          text: "Promise to help later", 
          emoji: "🤝", 
          description: "Offer to help your sibling with chores instead",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "It's a hot day and everyone is eating ice cream. You have ₹15 saved. What's the wisest choice?",
      options: [
        { 
          id: "save", 
          text: "Save for later", 
          emoji: "💰", 
          description: "Save your money for something more important",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Cool off now", 
          emoji: "🍦", 
          description: "Buy ice cream to cool off from the heat",
          isCorrect: false
        },
        { 
          id: "alternative", 
          text: "Find free way to cool off", 
          emoji: "🌳", 
          description: "Sit under a tree or drink water to cool off",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Ice Cream Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-11"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default IceCreamStory;