import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PersonalInfoPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-4";
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
      text: "Your full name - is this private information or okay to share online?",
      options: [
        { 
          id: "a", 
          text: "Private Info", 
          emoji: "🔒", 
          description: "Never share your full name online",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Okay to Share", 
          emoji: "✅", 
          description: "It's fine to share your name",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only with Friends", 
          emoji: "👥", 
          description: "Share only with close friends",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your home address - should this be kept private or can you share it?",
      options: [
        { 
          id: "a", 
          text: "Private Info", 
          emoji: "🏠", 
          description: "Never share your address online",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Okay to Share", 
          emoji: "📍", 
          description: "It's safe to share addresses",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Share City Only", 
          emoji: "🌆", 
          description: "Share only the city name",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your password - is this private or okay to share?",
      options: [
        { 
          id: "a", 
          text: "Private Info", 
          emoji: "🔐", 
          description: "Never share passwords with anyone",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Share with Friends", 
          emoji: "👫", 
          description: "It's okay to share with friends",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Share if Asked", 
          emoji: "❓", 
          description: "Share if someone asks nicely",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your favorite color - is this private or okay to share?",
      options: [
        { 
          id: "a", 
          text: "Private Info", 
          emoji: "🔒", 
          description: "Keep favorite color private",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Okay to Share", 
          emoji: "🎨", 
          description: "It's safe to share your favorite color",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only with Family", 
          emoji: "👨‍👩‍👧", 
          description: "Share only with family members",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your phone number - should this be kept private?",
      options: [
        { 
          id: "a", 
          text: "Private Info", 
          emoji: "📱", 
          description: "Never share your phone number online",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Okay to Share", 
          emoji: "✅", 
          description: "It's fine to share phone numbers",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Share Last 4 Digits", 
          emoji: "🔢", 
          description: "Share only the last 4 digits",
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
      title="Personal Info Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-4"
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

export default PersonalInfoPuzzle;
