import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleSwap = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-17");
  const gameId = gameData?.id || "dcos-kids-17";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleSwap, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Someone posts a mean comment about your drawing online. How would you feel?",
      options: [
        { 
          id: "a", 
          text: "Sad and Hurt", 
          emoji: "😢", 
          description: "Feeling sad and hurt by the comment",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Happy", 
          emoji: "😊", 
          description: "Feeling happy about it",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Excited", 
          emoji: "🎉", 
          description: "Feeling excited",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Kids at school laugh at your new haircut. How would you feel?",
      options: [
        { 
          id: "a", 
          text: "Embarrassed and Upset", 
          emoji: "😳", 
          description: "Feeling embarrassed and upset",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Proud", 
          emoji: "😌", 
          description: "Feeling proud",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Happy", 
          emoji: "😊", 
          description: "Feeling happy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone shares your secret without asking. How would you feel?",
      options: [
        { 
          id: "a", 
          text: "Betrayed and Angry", 
          emoji: "😞", 
          description: "Feeling betrayed and angry",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Grateful", 
          emoji: "🙏", 
          description: "Feeling grateful",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Excited", 
          emoji: "🎉", 
          description: "Feeling excited",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're left out of a game everyone else is playing. How would you feel?",
      options: [
        { 
          id: "a", 
          text: "Lonely and Sad", 
          emoji: "😔", 
          description: "Feeling lonely and sad",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Excited", 
          emoji: "🎉", 
          description: "Feeling excited",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Happy", 
          emoji: "😊", 
          description: "Feeling happy",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Someone spreads a rumor about you that isn't true. How would you feel?",
      options: [
        { 
          id: "a", 
          text: "Angry and Hurt", 
          emoji: "😠", 
          description: "Feeling angry and hurt",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Happy", 
          emoji: "😊", 
          description: "Feeling happy",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Grateful", 
          emoji: "🙏", 
          description: "Feeling grateful",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Role Swap Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
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

export default RoleSwap;
