import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafetyPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-6";
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
      text: "Which safety message is best for a poster about online safety?",
      options: [
        { 
          id: "a", 
          text: "Don't Share Your Password!", 
          emoji: "🔒", 
          description: "Keep passwords private and safe",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Share Everything Online", 
          emoji: "❌", 
          description: "Share all information freely",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Passwords Don't Matter", 
          emoji: "😔", 
          description: "Passwords are not important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best safety message for a poster about strangers?",
      options: [
        { 
          id: "a", 
          text: "Trust All Strangers", 
          emoji: "❌", 
          description: "Trust everyone you meet online",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Stranger Danger Online!", 
          emoji: "⚠️", 
          description: "Be careful with strangers online",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Meet Strangers in Person", 
          emoji: "😰", 
          description: "It's safe to meet online strangers",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which message is best for a privacy poster?",
      options: [
        { 
          id: "a", 
          text: "Keep Personal Info Private!", 
          emoji: "🛡️", 
          description: "Protect your personal information",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Share All Personal Info", 
          emoji: "❌", 
          description: "Share everything about yourself",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Privacy Doesn't Matter", 
          emoji: "😔", 
          description: "Privacy is not important",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the best safety message about clicking links?",
      options: [
        { 
          id: "a", 
          text: "Click on All Links", 
          emoji: "❌", 
          description: "Click any link you see",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Never Ask Parents", 
          emoji: "😔", 
          description: "Don't ask parents for help",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask Parent Before Clicking!", 
          emoji: "👨‍👩‍👧", 
          description: "Always ask parents before clicking links",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Which is the best general safety message for a poster?",
      options: [
        { 
          id: "a", 
          text: "Stay Safe Online!", 
          emoji: "🛡️", 
          description: "Always be safe when using the internet",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Safety Doesn't Matter", 
          emoji: "❌", 
          description: "Online safety is not important",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Safety Rules", 
          emoji: "😔", 
          description: "Don't follow safety guidelines",
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
    navigate("/games/digital-citizenship/kids");
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
      title="Safety Poster Task"
      subtitle={showResult ? "Poster Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-6"
      gameType="dcos"
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
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default SafetyPoster;
