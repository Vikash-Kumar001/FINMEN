import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DeviceSharingQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-8";
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
      text: "Is it safe to share your phone or tablet with a stranger?",
      options: [
        { 
          id: "a", 
          text: "No, Never Share", 
          emoji: "🛡️", 
          description: "Never share devices with strangers",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes, It's Okay", 
          emoji: "👍", 
          description: "It's safe to share with strangers",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only If They Ask Nicely", 
          emoji: "😊", 
          description: "Share if they ask politely",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should you let a classmate use your device without asking?",
      options: [
        { 
          id: "a", 
          text: "Yes, Classmates Are Safe", 
          emoji: "👍", 
          description: "Classmates can use it anytime",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask Parent First", 
          emoji: "🛡️", 
          description: "Always ask parents before sharing",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only for a Minute", 
          emoji: "⏰", 
          description: "Share for just a short time",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Can you share your device password with friends?",
      options: [
        { 
          id: "a", 
          text: "No, Passwords Are Private", 
          emoji: "🔒", 
          description: "Never share passwords with anyone",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes, Friends Are Safe", 
          emoji: "👍", 
          description: "Friends can know your password",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only Best Friends", 
          emoji: "👫", 
          description: "Share only with close friends",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Should you let someone you just met use your device?",
      options: [
        { 
          id: "a", 
          text: "Yes, If They Seem Nice", 
          emoji: "😊", 
          description: "Share if they look friendly",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No, Never Share", 
          emoji: "🛡️", 
          description: "Don't share with people you don't know well",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only for Games", 
          emoji: "🎮", 
          description: "Share only to play games together",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is it safe to leave your device unlocked around strangers?",
      options: [
        { 
          id: "a", 
          text: "Always Lock Device", 
          emoji: "🔒", 
          description: "Always lock your device for safety",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes, It's Fine", 
          emoji: "👍", 
          description: "Leaving it unlocked is okay",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only at Home", 
          emoji: "🏠", 
          description: "Unlocked is fine at home only",
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
      title="Device Sharing Quiz"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-8"
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

export default DeviceSharingQuiz;
