import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GameCoinScamQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-43");
  const gameId = gameData?.id || "dcos-kids-43";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for GameCoinScamQuiz, using fallback ID");
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
      text: "An app says 'Buy unlimited coins for ₹100.' Should you trust it?",
      options: [
        { 
          id: "a", 
          text: "Yes, it's a great deal!", 
          emoji: "😄", 
          description: "Great deals are always safe",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No, it might be a scam.", 
          emoji: "🚫", 
          description: "Suspicious offers are often scams",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only if it looks cool.", 
          emoji: "😎", 
          description: "If it looks good, it's safe",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A pop-up says 'You won 10,000 game coins! Click to claim.' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Click it fast!", 
          emoji: "⚡", 
          description: "Click immediately to claim",
          isCorrect: false
        },
        
        { 
          id: "c", 
          text: "Share with friends first.", 
          emoji: "👥", 
          description: "Share before clicking",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ignore or close it.", 
          emoji: "❌", 
          description: "Pop-ups like this are usually scams",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "A website asks for your game password to get free coins. What do you do?",
      options: [
        { 
          id: "b", 
          text: "Never share your password.", 
          emoji: "🛡️", 
          description: "Never share passwords with anyone",
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Give it, to get coins.", 
          emoji: "💸", 
          description: "Share password to get free coins",
          isCorrect: false
        },
        
        { 
          id: "c", 
          text: "Ask a stranger online.", 
          emoji: "🤔", 
          description: "Ask others for advice",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A real game store always uses secure payment methods. What should you look for?",
      options: [
       
        { 
          id: "b", 
          text: "Random links or pop-ups", 
          emoji: "⚠️", 
          description: "Random links are safe",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Free download buttons", 
          emoji: "⬇️", 
          description: "Free downloads are always safe",
          isCorrect: false
        },
         { 
          id: "a", 
          text: "Lock symbol & HTTPS", 
          emoji: "🔒", 
          description: "Look for security symbols",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "If you think a coin offer is fake, what should you do?",
      options: [
        { 
          id: "a", 
          text: "Report it to an adult or teacher.", 
          emoji: "📢", 
          description: "Tell a trusted adult about scams",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Try it once anyway.", 
          emoji: "😬", 
          description: "Try it to see if it works",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore and forget.", 
          emoji: "🤷‍♂️", 
          description: "Just ignore it",
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
      title="Quiz on Scams"
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

export default GameCoinScamQuiz;
