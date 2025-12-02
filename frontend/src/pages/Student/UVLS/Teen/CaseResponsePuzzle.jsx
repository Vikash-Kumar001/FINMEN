import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const CaseResponsePuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-8";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getUvlsTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Alex is a student who recently lost a parent. You notice Alex sitting alone at lunch, looking at their phone, avoiding eye contact. What's the best first response?",
      options: [
        { 
          id: "a", 
          text: "Hey Alex, mind if I sit here? No pressure to talk.", 
          emoji: "🤝",
          description: "Offers gentle connection without pressure",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Why are you always so sad? Cheer up!", 
          emoji: "😠",
          description: "Dismissive and hurtful",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Are you okay? You seem weird lately.", 
          emoji: "😐",
          description: "Judgmental and insensitive",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Alex opens up: 'Things have been really hard at home.' How do you respond?",
      options: [
        { 
          id: "b", 
          text: "At least you still have one parent.", 
          emoji: "😕",
          description: "Minimizes their loss",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "I can't imagine how difficult this is for you. I'm here to listen.", 
          emoji: "💙",
          description: "Validates their feelings and offers support",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Oh, that's tough. Want to talk about something else?", 
          emoji: "🔄",
          description: "Avoids their need to share",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Alex mentions they're falling behind in classes and feeling overwhelmed. What's helpful to say?",
      options: [
        { 
          id: "a", 
          text: "Would you like me to help you catch up, or find resources together?", 
          emoji: "🤝",
          description: "Offers practical support",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "You just need to try harder.", 
          emoji: "👆",
          description: "Blaming and unhelpful",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Everyone has problems, you're not special.", 
          emoji: "😤",
          description: "Dismissive and hurtful",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Alex says: 'I don't think anyone understands what I'm going through.' What validates their feelings?",
      options: [
        { 
          id: "b", 
          text: "I totally understand because I went through something similar.", 
          emoji: "🔄",
          description: "Makes it about yourself",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "I may not fully understand, but I want to support you. You're not alone.", 
          emoji: "💝",
          description: "Honest and supportive",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "You're right, no one can understand.", 
          emoji: "😞",
          description: "Reinforces isolation",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Alex seems hesitant about seeking professional help. How do you encourage them?",
      options: [
        { 
          id: "c", 
          text: "Just deal with it on your own.", 
          emoji: "🚫",
          description: "Unsupportive",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Talking to a counselor could really help. Would you like me to go with you?", 
          emoji: "💙",
          description: "Encourages help-seeking and offers support",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "You're not crazy, you don't need therapy.", 
          emoji: "😐",
          description: "Stigmatizes help-seeking",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Case-Response Puzzle"
      subtitle={levelCompleted ? "Case Study Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="uvls"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {currentQuestion === 0 && !answered && (
          <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-6 mb-4 border-2 border-purple-400/50">
            <h3 className="text-white text-xl font-bold mb-2">Alex's Story</h3>
            <p className="text-white/90">Alex is a talented student who recently lost a parent. They've been withdrawn, missing assignments, and avoiding friends.</p>
          </div>
        )}
        
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CaseResponsePuzzle;
