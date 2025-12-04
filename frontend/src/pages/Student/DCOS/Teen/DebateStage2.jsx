import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage2 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-85";
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
      text: "Should hate speech be allowed online?",
      options: [
        { 
          id: "yes-allowed", 
          text: "Yes - free speech allows it", 
          emoji: "🗣️", 
          description: "Free speech means hate speech should be allowed",
          isCorrect: false
        },
        { 
          id: "no-banned", 
          text: "No - hate speech should be banned", 
          emoji: "❌", 
          description: "Hate speech causes harm and should be banned",
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe - depends on the context", 
          emoji: "🤔", 
          description: "It depends on the specific context",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is hate speech protected as free speech?",
      options: [
        { 
          id: "yes-protected", 
          text: "Yes - it's free speech", 
          emoji: "🗣️", 
          description: "Hate speech is protected under free speech",
          isCorrect: false
        },
        { 
          id: "no-harmful", 
          text: "No - it causes real harm", 
          emoji: "❌", 
          description: "Hate speech causes real harm and shouldn't be protected",
          isCorrect: true
        },
        { 
          id: "sometimes", 
          text: "Sometimes - if it's not too extreme", 
          emoji: "🤷", 
          description: "Only if it's not extremely hateful",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Should platforms allow hate speech?",
      options: [
        { 
          id: "yes-platforms", 
          text: "Yes - platforms should allow it", 
          emoji: "🌐", 
          description: "Online platforms should allow all speech including hate",
          isCorrect: false
        },
        { 
          id: "no-moderation", 
          text: "No - platforms should moderate", 
          emoji: "❌", 
          description: "Platforms should moderate and remove hate speech",
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe - only moderate extreme cases", 
          emoji: "🤔", 
          description: "Only moderate the most extreme cases",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Does hate speech have consequences?",
      options: [
        { 
          id: "no-consequences", 
          text: "No - it's just words", 
          emoji: "💬", 
          description: "Hate speech is just words with no real consequences",
          isCorrect: false
        },
        { 
          id: "yes-serious", 
          text: "Yes - it has serious consequences", 
          emoji: "❌", 
          description: "Hate speech has serious real-world consequences",
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe - only for some people", 
          emoji: "🤷", 
          description: "Only affects sensitive people",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should we report hate speech online?",
      options: [
        { 
          id: "no-report", 
          text: "No - just ignore it", 
          emoji: "😐", 
          description: "Just ignore hate speech, don't report it",
          isCorrect: false
        },
        { 
          id: "yes-report", 
          text: "Yes - always report hate speech", 
          emoji: "❌", 
          description: "Always report hate speech to protect others",
          isCorrect: true
        },
        { 
          id: "sometimes", 
          text: "Sometimes - only if it's directed at you", 
          emoji: "🤔", 
          description: "Only report if it's directed at you",
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
      title="Debate: Hate Speech"
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

export default DebateStage2;
