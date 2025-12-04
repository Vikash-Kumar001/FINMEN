import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const KindnessJournal = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-18");
  const gameId = gameData?.id || "dcos-kids-18";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for KindnessJournal, using fallback ID");
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
      text: "What is a good way to be kind online?",
      options: [
        { 
          id: "a", 
          text: "Say Nice Things", 
          emoji: "💬", 
          description: "Say nice things about someone's post",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Make Mean Comments", 
          emoji: "😠", 
          description: "Make mean comments on posts",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Everyone", 
          emoji: "😐", 
          description: "Ignore everyone online",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How can you help someone who needs it?",
      options: [
        { 
          id: "a", 
          text: "Offer to Help", 
          emoji: "🤝", 
          description: "Offer to help when someone needs it",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Laugh at Them", 
          emoji: "😄", 
          description: "Laugh at their problems",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Them", 
          emoji: "🙈", 
          description: "Ignore them completely",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What can you do to make someone smile?",
      options: [
        { 
          id: "a", 
          text: "Say Something Kind", 
          emoji: "😊", 
          description: "Say something kind and encouraging",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Make Fun of Them", 
          emoji: "😈", 
          description: "Make fun of them",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Them", 
          emoji: "😐", 
          description: "Ignore them",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do when you see someone being bullied?",
      options: [
        { 
          id: "a", 
          text: "Stand Up for Them", 
          emoji: "🛡️", 
          description: "Stand up for them and get help",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Join the Bully", 
          emoji: "😈", 
          description: "Join in with the bully",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Do Nothing", 
          emoji: "😐", 
          description: "Do nothing and watch",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a way to show kindness to others?",
      options: [
        { 
          id: "a", 
          text: "Be Helpful and Caring", 
          emoji: "💖", 
          description: "Be helpful and caring to others",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Be Mean", 
          emoji: "😠", 
          description: "Be mean to others",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Everyone", 
          emoji: "🙈", 
          description: "Ignore everyone",
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
      title="Journal of Kindness"
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

export default KindnessJournal;
