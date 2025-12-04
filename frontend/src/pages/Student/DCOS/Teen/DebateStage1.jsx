import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage1 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-65";
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
      text: "Does online identity matter for success?",
      options: [
        { 
          id: "yes-opportunities", 
          text: "Yes - it affects opportunities", 
          emoji: "✅", 
          description: "Your online identity directly impacts your opportunities",
          isCorrect: true
        },
        { 
          id: "no-matter", 
          text: "No - it doesn't matter", 
          emoji: "❌", 
          description: "Online identity has no impact on success",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only for some careers", 
          emoji: "🤔", 
          description: "It only matters for certain types of careers",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is your online presence important for your future?",
      options: [
        { 
          id: "yes-check", 
          text: "Yes - employers and colleges check", 
          emoji: "✅", 
          description: "Employers and colleges check your online presence",
          isCorrect: true
        },
        { 
          id: "no-skills", 
          text: "No - only skills matter", 
          emoji: "❌", 
          description: "Only your skills matter, not your online presence",
          isCorrect: false
        },
        { 
          id: "sometimes", 
          text: "Sometimes - depends on the field", 
          emoji: "💼", 
          description: "It depends on what field you're in",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Can your digital footprint impact your career?",
      options: [
        { 
          id: "yes-help-hurt", 
          text: "Yes - it can help or hurt", 
          emoji: "✅", 
          description: "Your digital footprint can positively or negatively impact your career",
          isCorrect: true
        },
        { 
          id: "no-separate", 
          text: "No - online doesn't affect real life", 
          emoji: "❌", 
          description: "Online presence is separate from real life",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only if it's negative", 
          emoji: "🤷", 
          description: "Only negative online content matters",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Does your online reputation matter for success?",
      options: [
        { 
          id: "yes-identity", 
          text: "Yes - it's part of your identity", 
          emoji: "✅", 
          description: "Online reputation is part of your overall identity",
          isCorrect: true
        },
        { 
          id: "no-separate-success", 
          text: "No - it's separate from success", 
          emoji: "❌", 
          description: "Online reputation is separate from real-world success",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only for public figures", 
          emoji: "⭐", 
          description: "Only matters if you're a public figure",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is building a positive online identity important?",
      options: [
        { 
          id: "yes-doors", 
          text: "Yes - it opens doors", 
          emoji: "✅", 
          description: "A positive online identity opens opportunities",
          isCorrect: true
        },
        { 
          id: "no-necessary", 
          text: "No - not necessary", 
          emoji: "❌", 
          description: "Building a positive online identity is not necessary",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - only if you want to be famous", 
          emoji: "🌟", 
          description: "Only important if you want to be famous",
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
      title="Debate: Online Identity"
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

export default DebateStage1;
