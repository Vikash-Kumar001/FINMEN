import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const PeerSupportSimulation = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-47";
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
      text: "You're planning a peer support session. How should you listen to your peer?",
      options: [
        { 
          id: "a", 
          text: "Empathize and actively listen to understand their perspective", 
          emoji: "👂",
          description: "Supportive and engaged",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Judge them for their problems", 
          emoji: "👆",
          description: "Not supportive",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Interrupt and give advice immediately", 
          emoji: "💬",
          description: "Doesn't allow them to express",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "Ignore what they're saying", 
          emoji: "🙈",
          description: "Not helpful",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you offer support in the session?",
      options: [
        { 
          id: "b", 
          text: "Do nothing and avoid helping", 
          emoji: "🚫",
          description: "Not supportive",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Suggest concrete help and plan supportive activities together", 
          emoji: "🤝",
          description: "Practical and helpful",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Criticize their approach", 
          emoji: "👆",
          description: "Harmful",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "Make it all about yourself", 
          emoji: "👤",
          description: "Not about them",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What group activities should you include?",
      options: [
        { 
          id: "a", 
          text: "Inclusive games and sharing circles that allow everyone to participate", 
          emoji: "👥",
          description: "Engaging and inclusive",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "No activities at all", 
          emoji: "🚫",
          description: "Missing opportunities",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Exclusive activities that leave some out", 
          emoji: "👋",
          description: "Not inclusive",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "Lectures only with no interaction", 
          emoji: "📚",
          description: "Not engaging",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should you follow up after the session?",
      options: [
        { 
          id: "b", 
          text: "No follow-up at all", 
          emoji: "🚫",
          description: "Shows no care",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "One-time check and then forget", 
          emoji: "👋",
          description: "Not sustained",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Schedule check-ins and provide ongoing support as needed", 
          emoji: "📅",
          description: "Sustained support",
          isCorrect: true
        },
        { 
          id: "d", 
          text: "Only follow up if convenient", 
          emoji: "⏰",
          description: "Inconsistent",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should you evaluate the impact of the support session?",
      options: [
        { 
          id: "a", 
          text: "Use feedback forms and adjust the plan based on what's working", 
          emoji: "📊",
          description: "Data-driven improvement",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Assume everything is good without checking", 
          emoji: "😊",
          description: "No evaluation",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No evaluation at all", 
          emoji: "🚫",
          description: "Can't improve",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "Evaluate once and never again", 
          emoji: "📝",
          description: "Limited feedback",
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
      title="Peer Support Simulation"
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
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default PeerSupportSimulation;
