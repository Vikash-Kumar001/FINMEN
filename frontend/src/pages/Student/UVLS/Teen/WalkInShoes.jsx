import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const WalkInShoes = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-4";
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
      text: "You're a new student who speaks a different language. During lunch, you sit alone because you're not sure how to join others. What do you do?",
      options: [
        { 
          id: "a", 
          text: "Try to ask someone if you can join", 
          emoji: "🤝", 
          description: "Shows courage and helps you connect",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Hide in the library to avoid everyone", 
          emoji: "📚", 
          description: "Avoids the problem and increases isolation",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Just sit alone and feel sad", 
          emoji: "😔", 
          description: "Doesn't help the situation",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You have a learning disability and the class is moving too fast. You're falling behind and feeling overwhelmed. How do you handle this?",
      options: [
        { 
          id: "b", 
          text: "Give up and stop trying", 
          emoji: "😔", 
          description: "Not helpful and makes things worse",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Ask the teacher for help or accommodations", 
          emoji: "🙋", 
          description: "Advocating for yourself is important",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Copy someone else's work", 
          emoji: "📋", 
          description: "Dishonest and doesn't help you learn",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "You're being excluded from group activities because of your background. Others make comments that hurt. What's your choice?",
      options: [
        { 
          id: "b", 
          text: "Accept it and try to change who you are", 
          emoji: "😞", 
          description: "Hurts your self-esteem",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "React with anger and aggression", 
          emoji: "😠", 
          description: "Can make the situation worse",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Report the exclusion to a trusted adult", 
          emoji: "🛡️", 
          description: "Gets you the help and support you need",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "You're dealing with family financial struggles and can't afford school supplies. Others seem to have everything they need. How do you respond?",
      options: [
        { 
          id: "b", 
          text: "Feel ashamed and try to hide your situation", 
          emoji: "😳", 
          description: "Prevents you from getting help",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Ask the school counselor for resources", 
          emoji: "💼", 
          description: "Gets you the support you need",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Take supplies from others without asking", 
          emoji: "🚫", 
          description: "Wrong and can cause problems",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You're experiencing mental health challenges and feel like you're the only one struggling. Others seem happy and carefree. What action do you take?",
      options: [
        { 
          id: "b", 
          text: "Withdraw and isolate yourself from everyone", 
          emoji: "🚪", 
          description: "Makes things worse",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Pretend everything is fine and ignore your feelings", 
          emoji: "😶", 
          description: "Doesn't address the problem",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Seek help from a school counselor or therapist", 
          emoji: "💙", 
          description: "Professional help can make a big difference",
          isCorrect: true 
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
      title="Walk in Their Shoes"
      subtitle={levelCompleted ? "Simulation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
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
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  ⚠️ Content Warning: This simulation touches on sensitive topics
                </p>
              </div>
              
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

export default WalkInShoes;

