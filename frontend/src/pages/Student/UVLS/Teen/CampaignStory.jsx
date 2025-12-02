import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CampaignStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-79";
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
      text: "You're planning a campaign. What should be your first step?",
      options: [
        { 
          id: "a", 
          text: "Set Specific Goals", 
          emoji: "🎯", 
          description: "Define clear, measurable objectives",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Vague Awareness", 
          emoji: "🌫️", 
          description: "Just raise general awareness",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No Goal", 
          emoji: "❌", 
          description: "Start without any plan",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Who should be your target audience?",
      options: [
        { 
          id: "a", 
          text: "Targeted Groups", 
          emoji: "👥", 
          description: "Focus on specific demographics",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Everyone", 
          emoji: "🌍", 
          description: "Try to reach everyone",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No Audience", 
          emoji: "🚫", 
          description: "Don't identify an audience",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How will you spread your message?",
      options: [
        { 
          id: "a", 
          text: "Multi-Channel", 
          emoji: "📱", 
          description: "Use multiple platforms and methods",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "One Channel", 
          emoji: "📺", 
          description: "Use only one method",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No Channel", 
          emoji: "🔇", 
          description: "Don't plan any communication",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What timeline should you set for your campaign?",
      options: [
        { 
          id: "a", 
          text: "With Milestones", 
          emoji: "📅", 
          description: "Set clear deadlines and checkpoints",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Indefinite", 
          emoji: "♾️", 
          description: "No specific timeline",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No Timeline", 
          emoji: "⏸️", 
          description: "Don't set any deadlines",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How will you measure the success of your campaign?",
      options: [
        { 
          id: "a", 
          text: "KPI Tracking", 
          emoji: "📊", 
          description: "Use key performance indicators",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Guess", 
          emoji: "🔮", 
          description: "Estimate without data",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No Measurement", 
          emoji: "🙈", 
          description: "Don't track results",
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
    navigate("/games/uvls/teens");
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
      title="Campaign Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      gameType="uvls"
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

export default CampaignStory;
