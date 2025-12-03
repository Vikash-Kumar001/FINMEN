import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const EthicsInNegotiationDebate = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-72";
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
      text: "Topic: Lying in negotiation. What's the most nuanced ethical stance?",
      options: [
        { 
          id: "a", 
          text: "Context matters - small omissions may be acceptable, but harmful lies are wrong", 
          emoji: "⚖️",
          description: "Nuanced ethical consideration",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Lying is always wrong, no exceptions", 
          emoji: "❌",
          description: "Too absolute, lacks nuance",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Lying is always okay in negotiations", 
          emoji: "🤥",
          description: "Too permissive, lacks ethics",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Topic: Compromise vs principle. What's the most balanced approach?",
      options: [
        { 
          id: "b", 
          text: "Never compromise on principles", 
          emoji: "🚫",
          description: "Too rigid, lacks flexibility",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Balance both - compromise on means but hold core values", 
          emoji: "⚖️",
          description: "Nuanced and balanced",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Always compromise, principles don't matter", 
          emoji: "🤷",
          description: "Too permissive",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Topic: Is bluffing ethical? What's the most thoughtful stance?",
      options: [
        { 
          id: "a", 
          text: "Depends on context - harmless strategic positioning vs deceptive manipulation", 
          emoji: "🃏",
          description: "Contextual ethical analysis",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Bluffing is never ethical", 
          emoji: "❌",
          description: "Too absolute",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Bluffing is always fine", 
          emoji: "✅",
          description: "Lacks ethical consideration",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Topic: Power imbalance in negotiation. What's the most ethical approach?",
      options: [
        { 
          id: "b", 
          text: "Exploit your power advantage fully", 
          emoji: "💪",
          description: "Unethical use of power",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore power differences completely", 
          emoji: "🙈",
          description: "Unrealistic and naive",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Acknowledge imbalance and seek fair outcomes", 
          emoji: "🤝",
          description: "Ethical and realistic",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Topic: Is win-win always possible? What's the most realistic stance?",
      options: [
        { 
          id: "a", 
          text: "Strive for win-win but recognize it's not always achievable", 
          emoji: "🎯",
          description: "Realistic and ethical",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Win-win is never possible, always win-lose", 
          emoji: "⚔️",
          description: "Too pessimistic",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Win-win is always possible if you try hard enough", 
          emoji: "✨",
          description: "Unrealistic",
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
      title="Ethics in Negotiation Debate"
      subtitle={levelCompleted ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
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

export default EthicsInNegotiationDebate;
