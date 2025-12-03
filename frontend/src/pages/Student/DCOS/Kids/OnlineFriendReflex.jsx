import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const OnlineFriendReflex = () => {
  const location = useLocation();
  
  const gameId = "dcos-kids-9";
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
      const games = getDcosKidsGames({});
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
      text: "A stranger online says: 'Hi! I'm your age. Want to meet at the park?'",
      emoji: "👤",
      options: [
        { 
          id: "a", 
          text: "Say 'No' and tell a parent", 
          emoji: "🛡️",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Say 'Yes' and meet them", 
          emoji: "😊",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask for more information first", 
          emoji: "🤔",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone online says: 'I know your friend. Let's meet after school.'",
      emoji: "👥",
      options: [
        { 
          id: "a", 
          text: "Agree to meet", 
          emoji: "😊",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Refuse and tell trusted adult", 
          emoji: "🛡️",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask where to meet", 
          emoji: "🤔",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Online person says: 'I'm a kid too. Want to play at my house?'",
      emoji: "🏠",
      options: [
        { 
          id: "a", 
          text: "Say no and block them", 
          emoji: "🛡️",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Say yes", 
          emoji: "😊",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask for address", 
          emoji: "📍",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Stranger says: 'I have candy. Come meet me at the park.'",
      emoji: "🍬",
      options: [
        { 
          id: "a", 
          text: "Go meet them", 
          emoji: "😊",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Refuse and tell parent immediately", 
          emoji: "🛡️",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask what kind of candy", 
          emoji: "🤔",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Online friend says: 'Let's meet in person. I'll bring my parents.'",
      emoji: "👨‍👩‍👧",
      options: [
        { 
          id: "a", 
          text: "Tell your parent first and only meet with parent present", 
          emoji: "🛡️",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Go alone", 
          emoji: "😊",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Go with friends only", 
          emoji: "👥",
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
      title="Online Friend Reflex"
      subtitle={levelCompleted ? "Reflex Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="dcos"
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
                  ⚠️ Never meet someone you only know online!
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4 mb-6">
                <p className="text-white text-lg leading-relaxed text-center font-semibold">
                  {currentQuestionData.text}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center font-semibold text-lg">What should you do?</p>
              
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
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <h3 className="font-bold text-base">{option.text}</h3>
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

export default OnlineFriendReflex;
