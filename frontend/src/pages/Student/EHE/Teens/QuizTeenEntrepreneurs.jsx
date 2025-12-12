import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheTeenGames } from "../../../../pages/Games/GameCategories/EHE/teenGamesData";

const QuizTeenEntrepreneurs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-42";
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
      text: "Which quality do teen entrepreneurs show?",
      emoji: "🚀",
      options: [
        {
          id: "a",
          text: "Risk-taking",
          emoji: "🎢",
          description: "Correct! Teen entrepreneurs often take calculated risks to pursue their ideas",
          isCorrect: true
        },
        {
          id: "b",
          text: "Doing nothing",
          emoji: "🛋️",
          description: "Entrepreneurs are action-oriented, not passive",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding challenges",
          emoji: "🛡️",
          description: "Entrepreneurs embrace challenges as opportunities for growth",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What motivates teen entrepreneurs?",
      emoji: "💡",
      options: [
        {
          id: "a",
          text: "Solving problems and creating value",
          emoji: "🔧",
          description: "Exactly! Successful entrepreneurs identify and solve genuine problems",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoiding responsibility",
          emoji: "😴",
          description: "Entrepreneurship involves taking responsibility, not avoiding it",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying others",
          emoji: "📎",
          description: "While learning from others helps, innovation comes from original thinking",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is creativity important for teen entrepreneurs?",
      emoji: "🎨",
      options: [
        {
          id: "a",
          text: "To develop unique solutions",
          emoji: "✨",
          description: "Great! Creativity enables entrepreneurs to solve problems differently",
          isCorrect: true
        },
        {
          id: "b",
          text: "To copy existing ideas",
          emoji: "📋",
          description: "While借鉴 is helpful, creativity involves original thinking",
          isCorrect: false
        },
        {
          id: "c",
          text: "To avoid innovation",
          emoji: "🚫",
          description: "Innovation is a key driver of entrepreneurial success",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What skill helps teen entrepreneurs succeed?",
      emoji: "🤝",
      options: [
        {
          id: "a",
          text: "Communication and leadership",
          emoji: "🎤",
          description: "Perfect! These skills help entrepreneurs inspire teams and connect with customers",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoiding teamwork",
          emoji: "👤",
          description: "Most successful ventures require collaboration and partnership",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring feedback",
          emoji: "🙉",
          description: "Feedback is essential for improvement and course correction",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a benefit of teen entrepreneurship?",
      emoji: "⭐",
      options: [
        {
          id: "a",
          text: "Early financial literacy and experience",
          emoji: "💰",
          description: "Exactly! Real-world business experience builds valuable financial skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "Reduced learning opportunities",
          emoji: "📉",
          description: "Entrepreneurship actually expands learning opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Limited skill development",
          emoji: "🚧",
          description: "Entrepreneurship develops diverse skills across multiple domains",
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
      title="Quiz on Teen Entrepreneurs"
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

export default QuizTeenEntrepreneurs;