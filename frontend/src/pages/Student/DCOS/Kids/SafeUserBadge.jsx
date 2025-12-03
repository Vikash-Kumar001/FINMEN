import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafeUserBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-10";
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
      text: "What should you do with your password to stay safe online?",
      options: [
        { 
          id: "a", 
          text: "Never Share Passwords", 
          emoji: "🔒", 
          description: "Keep passwords private and never share",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Share with Friends", 
          emoji: "👥", 
          description: "It's okay to share with close friends",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Write It on Paper", 
          emoji: "📝", 
          description: "Write password on paper and keep it visible",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do if a stranger talks to you online?",
      options: [
        { 
          id: "a", 
          text: "Talk Back to Them", 
          emoji: "💬", 
          description: "Respond and have a conversation",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Don't Talk to Strangers", 
          emoji: "🚫", 
          description: "Ignore and don't respond to strangers",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Share Personal Info", 
          emoji: "📱", 
          description: "Tell them about yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you keep private online to stay safe?",
      options: [
        { 
          id: "a", 
          text: "Share Everything", 
          emoji: "📢", 
          description: "Share all information publicly",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Keep Personal Info Private", 
          emoji: "🛡️", 
          description: "Protect your personal information",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Post Your Address", 
          emoji: "🏠", 
          description: "Share your home address online",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do with family device rules?",
      options: [
        { 
          id: "a", 
          text: "Ignore Them", 
          emoji: "😠", 
          description: "Don't follow the rules",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Break Them Secretly", 
          emoji: "😈", 
          description: "Break rules when parents aren't looking",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Follow Family Rules", 
          emoji: "👨‍👩‍👧", 
          description: "Always follow family device rules",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if a stranger sends you a message?",
      options: [
        { 
          id: "a", 
          text: "Reply to Them", 
          emoji: "💬", 
          description: "Respond to the stranger's message",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ignore It", 
          emoji: "🙈", 
          description: "Just ignore and don't tell anyone",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Tell Parents", 
          emoji: "📢", 
          description: "Tell parents about stranger messages",
          isCorrect: true
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
      title="Safe User Badge"
      subtitle={showResult ? "Badge Earned!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-10"
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

export default SafeUserBadge;
