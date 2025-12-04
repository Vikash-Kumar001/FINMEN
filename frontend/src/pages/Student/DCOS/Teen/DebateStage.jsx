import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-56";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should schools teach privacy rights?",
      options: [
        { 
          id: "yes-important", 
          text: "Yes - it's important to learn", 
          emoji: "✅", 
          description: "Teaching privacy rights is essential for students",
          isCorrect: true
        },
        { 
          id: "no-necessary", 
          text: "No - not necessary", 
          emoji: "❌", 
          description: "Privacy rights don't need to be taught in schools",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only for older students", 
          emoji: "🤔", 
          description: "Only teach privacy to older students",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should privacy be taught in schools?",
      options: [
        { 
          id: "yes-need", 
          text: "Yes - students need to know", 
          emoji: "✅", 
          description: "Students need to learn about privacy protection",
          isCorrect: true
        },
        { 
          id: "no-important", 
          text: "No - it's not important", 
          emoji: "❌", 
          description: "Privacy education is not important",
          isCorrect: false
        },
        { 
          id: "sometimes", 
          text: "Sometimes - as an optional topic", 
          emoji: "📚", 
          description: "Teach privacy only as an optional subject",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Is teaching privacy rights important?",
      options: [
        { 
          id: "yes-protects", 
          text: "Yes - protects students", 
          emoji: "✅", 
          description: "Teaching privacy rights protects students online",
          isCorrect: true
        },
        { 
          id: "no-needed", 
          text: "No - not needed", 
          emoji: "❌", 
          description: "Privacy education is not needed",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only if students ask", 
          emoji: "🤷", 
          description: "Only teach if students specifically ask",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Should students learn about data privacy?",
      options: [
        { 
          id: "yes-essential", 
          text: "Yes - essential knowledge", 
          emoji: "✅", 
          description: "Data privacy is essential knowledge for students",
          isCorrect: true
        },
        { 
          id: "no-relevant", 
          text: "No - not relevant", 
          emoji: "❌", 
          description: "Data privacy is not relevant for students",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only for tech students", 
          emoji: "💻", 
          description: "Only teach to students studying technology",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is privacy education necessary in schools?",
      options: [
        { 
          id: "yes-helps", 
          text: "Yes - helps protect students", 
          emoji: "✅", 
          description: "Privacy education helps protect students online",
          isCorrect: true
        },
        { 
          id: "no-unnecessary", 
          text: "No - unnecessary", 
          emoji: "❌", 
          description: "Privacy education is unnecessary",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only in high school", 
          emoji: "🎓", 
          description: "Only teach privacy in high school",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
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

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Privacy Rights"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default DebateStage;
