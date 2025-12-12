import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheTeenGames } from "../../../../pages/Games/GameCategories/EHE/teenGamesData";

const QuizTeenPaths = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-52";
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
      const games = getEheTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : "/games/ehe/teens",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/games/ehe/teens", nextGameId: null };
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
      text: "Which is a career path after school?",
      emoji: "🎓",
      options: [
        {
          id: "a",
          text: "College only",
          emoji: "📚",
          description: "College is one path, but not the only option for career preparation",
          isCorrect: false
        },
        {
          id: "b",
          text: "Both college and vocational training",
          emoji: "✅",
          description: "Exactly! Both paths offer valuable skills for different career opportunities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Vocational training only",
          emoji: "🔧",
          description: "Vocational training is another path, but not the only option",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What factors should influence career path selection?",
      emoji: "🧭",
      options: [
        {
          id: "a",
          text: "Parental pressure only",
          emoji: "👪",
          description: "While family input matters, your own interests and abilities are crucial",
          isCorrect: false
        },
        {
          id: "b",
          text: "Interests, skills, and market demand",
          emoji: "🎯",
          description: "Perfect! Aligning personal passion with abilities and opportunities leads to satisfaction",
          isCorrect: true
        },
        {
          id: "c",
          text: "Peer choices only",
          emoji: "👥",
          description: "Following friends without considering your fit may lead to dissatisfaction",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is researching career paths important?",
      emoji: "🔍",
      options: [
        {
          id: "a",
          text: "Follow trends without thinking",
          emoji: "🌪️",
          description: "Blindly following trends without analysis rarely leads to success",
          isCorrect: false
        },
        {
          id: "b",
          text: "Make informed decisions about the future",
          emoji: "🧠",
          description: "Exactly! Research helps you understand requirements, outlook, and fit",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid all planning",
          emoji: "🚫",
          description: "Research actually supports planning rather than avoiding it",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a benefit of vocational training?",
      emoji: "🛠️",
      options: [
        {
          id: "a",
          text: "No career opportunities",
          emoji: "❌",
          description: "Vocational training actually opens specific career pathways",
          isCorrect: false
        },
        {
          id: "b",
          text: "Practical skills for specific jobs",
          emoji: "✅",
          description: "Correct! Vocational training provides hands-on skills for immediate employment",
          isCorrect: true
        },
        {
          id: "c",
          text: "Less valuable than college",
          emoji: "📉",
          description: "Both paths have value depending on career goals and interests",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can teens explore different career paths?",
      emoji: "🕵️",
      options: [
        {
          id: "a",
          text: "Avoid all exposure",
          emoji: "🙈",
          description: "Limited exposure restricts understanding of possibilities",
          isCorrect: false
        },
        {
          id: "b",
          text: "Internships, job shadowing, and career fairs",
          emoji: "🏢",
          description: "Correct! Hands-on experiences provide realistic insights into various fields",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stick to one idea only",
          emoji: "📌",
          description: "Exploring multiple options helps identify the best fit",
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
      title="Quiz on Teen Paths"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="ehe"
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
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
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
              
              {answered && (
                <div className={`rounded-lg p-5 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white whitespace-pre-line">
                    {currentQuestionData.options.find(opt => opt.id === selectedOption)?.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizTeenPaths;