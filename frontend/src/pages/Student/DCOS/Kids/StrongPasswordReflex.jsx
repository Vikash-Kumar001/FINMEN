import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StrongPasswordReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-1";
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
      text: "You need to create a password for your game account. Which password is the strongest?",
      options: [
        { 
          id: "weak1", 
          text: "12345", 
          emoji: "🔓", 
          description: "Easy numbers only",
          isCorrect: false
        },
        { 
          id: "strong", 
          text: "Tiger@2025", 
          emoji: "🔒", 
          description: "Mix of letters, numbers, and symbols",
          isCorrect: true
        },
        { 
          id: "weak2", 
          text: "password", 
          emoji: "❌", 
          description: "Common word only",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend asks you to share your password so they can play your game. What should you do?",
      options: [
        { 
          id: "share", 
          text: "Share It", 
          emoji: "👥", 
          description: "Give them your password",
          isCorrect: false
        },
        { 
          id: "refuse", 
          text: "Never Share", 
          emoji: "🚫", 
          description: "Keep your password private",
          isCorrect: true
        },
        { 
          id: "tell-parents", 
          text: "Tell Parents", 
          emoji: "👨‍👩‍👧", 
          description: "Ask parents what to do",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see a password: 'Star#123!'. Is this a strong password?",
      options: [
        { 
          id: "strong-yes", 
          text: "Yes, Strong", 
          emoji: "✅", 
          description: "Has letters, numbers, and symbols",
          isCorrect: true
        },
        { 
          id: "weak-no", 
          text: "No, Weak", 
          emoji: "❌", 
          description: "Too simple",
          isCorrect: false
        },
        { 
          id: "not-sure", 
          text: "Not Sure", 
          emoji: "🤔", 
          description: "I don't know",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What makes a password strong and safe?",
      options: [
        { 
          id: "long-only", 
          text: "Just Long", 
          emoji: "📏", 
          description: "Only needs to be long",
          isCorrect: false
        },
        { 
          id: "mix", 
          text: "Mix of Everything", 
          emoji: "🔐", 
          description: "Letters, numbers, and symbols together",
          isCorrect: true
        },
        { 
          id: "simple", 
          text: "Simple Words", 
          emoji: "📝", 
          description: "Easy words you remember",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You forgot your password. What's the safest thing to do?",
      options: [
        { 
          id: "guess", 
          text: "Keep Guessing", 
          emoji: "🎲", 
          description: "Try different passwords",
          isCorrect: false
        },
        { 
          id: "ask-adult", 
          text: "Ask an Adult", 
          emoji: "👨‍👩‍👧", 
          description: "Tell a parent or teacher",
          isCorrect: true
        },
        { 
          id: "use-same", 
          text: "Use Same Password", 
          emoji: "🔄", 
          description: "Use password from another account",
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
      title="Strong Password Reflex"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-1"
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

export default StrongPasswordReflex;
