import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheTeenGames } from "../../../../pages/Games/GameCategories/EHE/teenGamesData";

const QuizCareerGrowth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-92";
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
      text: "Which helps in career growth?",
      emoji: "📈",
      options: [
        {
          id: "a",
          text: "Doing nothing new",
          emoji: "🛋️",
          description: "Stagnation limits opportunities for advancement and skill development",
          isCorrect: false
        },
        {
          id: "b",
          text: "Continuous learning",
          emoji: "📖",
          description: "Exactly! Ongoing skill development keeps you competitive and opens new paths",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoiding challenges",
          emoji: "🛡️",
          description: "Shying away from challenges prevents growth and skill acquisition",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is skill development important for career growth?",
      emoji: "🛠️",
      options: [
        {
          id: "a",
          text: "Keeps you competitive and relevant",
          emoji: "🏆",
          description: "Perfect! Evolving skills ensure you meet changing industry demands",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes you overqualified",
          emoji: " overposting",
          description: "Relevant skills enhance rather than hinder career opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Reduces job opportunities",
          emoji: "📉",
          description: "Skill development typically expands rather than limits career options",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What role does networking play in career growth?",
      emoji: "🤝",
      options: [
        {
          id: "a",
          text: "Creates unnecessary competition",
          emoji: "⚔️",
          description: "Networking builds collaboration rather than unhealthy competition",
          isCorrect: false
        },
        {
          id: "b",
          text: "Has no impact",
          emoji: "🔇",
          description: "Professional relationships significantly influence career opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Opens doors to opportunities",
          emoji: "🚪",
          description: "Exactly! Connections often lead to mentorship, jobs, and collaborations",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How does taking on challenges benefit career growth?",
      emoji: "💪",
      options: [
        {
          id: "a",
          text: "Builds experience and confidence",
          emoji: "🏗️",
          description: "Correct! Challenging projects develop competence and self-assurance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Increases stress unnecessarily",
          emoji: "😰",
          description: "Managed challenges build resilience rather than harmful stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Reduces work satisfaction",
          emoji: "😞",
          description: "Appropriate challenges typically increase engagement and fulfillment",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a key to sustained career growth?",
      emoji: "🔑",
      options: [
        {
          id: "a",
          text: "Sticking to one method",
          emoji: "🔗",
          description: "Rigid approaches limit adaptation to changing environments",
          isCorrect: false
        },
        {
          id: "b",
          text: "Avoiding feedback",
          emoji: "🙉",
          description: "Feedback is essential for identifying improvement areas",
          isCorrect: false
        },
        {
          id: "c",
          text: "Adaptability and lifelong learning",
          emoji: "🔄",
          description: "Exactly! Flexibility and continuous growth drive long-term success",
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
      title="Quiz on Career Growth"
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

export default QuizCareerGrowth;