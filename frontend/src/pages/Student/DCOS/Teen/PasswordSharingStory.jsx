import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PasswordSharingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-1";
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
      text: "Your best friend asks: 'Can I borrow your password to check something on your account? I promise I'll just look quickly and won't change anything.'",
      options: [
        { 
          id: "share", 
          text: "Share it - they're my best friend", 
          emoji: "🤝", 
          description: "Give them your password since you trust them",
          isCorrect: false
        },
        { 
          id: "never", 
          text: "Never share passwords with anyone", 
          emoji: "🛡️", 
          description: "Keep your password private, even from close friends",
          isCorrect: true
        },
        { 
          id: "share-later", 
          text: "Share it but change it later", 
          emoji: "🔄", 
          description: "Share now but change the password afterward",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your sibling says: 'I need to use your account for a game. Just tell me your password, I won't mess with anything.'",
      options: [
        { 
          id: "share-family", 
          text: "Share it - they're family", 
          emoji: "👨‍👩‍👧", 
          description: "Share your password with family members",
          isCorrect: false
        },
        { 
          id: "never-family", 
          text: "Never share passwords, even with family", 
          emoji: "🛡️", 
          description: "Keep passwords private from everyone, including family",
          isCorrect: true
        },
        { 
          id: "temporary", 
          text: "Share it temporarily", 
          emoji: "⏰", 
          description: "Share for a short time then change it",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A classmate asks: 'Can I use your account to submit my assignment? I'll just log in once.'",
      options: [
        { 
          id: "help", 
          text: "Share it to help them", 
          emoji: "🤝", 
          description: "Share your password to help a classmate",
          isCorrect: false
        },
        { 
          id: "never-classmate", 
          text: "Never share passwords with anyone", 
          emoji: "🛡️", 
          description: "Keep your password private from everyone",
          isCorrect: true
        },
        { 
          id: "monitor", 
          text: "Share it but monitor the account", 
          emoji: "👀", 
          description: "Share but keep an eye on account activity",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Someone you've chatted with online asks: 'Can I access your account to help you with something?'",
      options: [
        { 
          id: "trust", 
          text: "Share it - they seem trustworthy", 
          emoji: "😊", 
          description: "Share your password with someone online you trust",
          isCorrect: false
        },
        { 
          id: "never-online", 
          text: "Never share passwords with anyone", 
          emoji: "🛡️", 
          description: "Never share passwords, especially with online contacts",
          isCorrect: true
        },
        { 
          id: "change-after", 
          text: "Share it but change it immediately after", 
          emoji: "🔄", 
          description: "Share now but change password right away",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Someone claiming to be tech support calls: 'We need your password to fix your account. Can you share it?'",
      options: [
        { 
          id: "tech-support", 
          text: "Share it - they're tech support", 
          emoji: "🔧", 
          description: "Share your password with tech support",
          isCorrect: false
        },
        { 
          id: "scam", 
          text: "Never share passwords - this is a scam", 
          emoji: "🛡️", 
          description: "This is a scam - never share passwords with anyone",
          isCorrect: true
        },
        { 
          id: "verify-first", 
          text: "Share it but verify first", 
          emoji: "🤔", 
          description: "Verify their identity before sharing",
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
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
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
    navigate("/student/dcos/teen/privacy-settings-quiz");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Password Sharing Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand password security!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  Never share your password with anyone - not even your best friend. Passwords are personal security keys!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, never share passwords with anyone!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that keeps your password private in all situations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PasswordSharingStory;
