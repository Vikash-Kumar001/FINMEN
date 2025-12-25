import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const RequestExtensionRoleplay = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-95";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
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
      text: "Part 1: Greeting. How should you start your extension request?",
      options: [
        { 
          id: "a", 
          text: "Dear Teacher,", 
          emoji: "👋",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Hey,", 
          emoji: "😎",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Yo,", 
          emoji: "🤙",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Part 2: Reason. How should you explain why you need an extension?",
      options: [
        { 
          id: "b", 
          text: "I was lazy and didn't do it", 
          emoji: "😴",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Due to unexpected illness, I need additional time", 
          emoji: "🤒",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "I forgot about it", 
          emoji: "🤷",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Part 3: New date. How should you propose a new deadline?",
      options: [
        { 
          id: "a", 
          text: "Would it be possible to submit by Friday?", 
          emoji: "📅",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Give me more time", 
          emoji: "⏰",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "I'll turn it in whenever", 
          emoji: "🤷",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Part 4: Make-up plan. How should you show you'll complete the work?",
      options: [
        { 
          id: "b", 
          text: "No plan, I'll figure it out", 
          emoji: "🤷",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Maybe I'll finish it", 
          emoji: "❓",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "I have a plan to complete it by the new deadline", 
          emoji: "✅",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Part 5: Closing. How should you end your request?",
      options: [
        { 
          id: "a", 
          text: "Thank you for your consideration", 
          emoji: "🙏",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Bye", 
          emoji: "👋",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "That's it", 
          emoji: "✌️",
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
      title="Request Extension Roleplay"
      subtitle={levelCompleted ? "Roleplay Complete!" : `Part ${currentQuestion + 1} of ${questions.length}`}
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
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Part {currentQuestion + 1}/{questions.length}</span>
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

export default RequestExtensionRoleplay;
