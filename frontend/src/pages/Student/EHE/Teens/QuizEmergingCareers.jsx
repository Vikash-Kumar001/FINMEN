import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheTeenGames } from "../../../../pages/Games/GameCategories/EHE/teenGamesData";

const QuizEmergingCareers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-72";
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
      text: "Which is an emerging field?",
      emoji: "🚀",
      options: [
        {
          id: "a",
          text: "AI & Data Science",
          emoji: "🤖",
          description: "Correct! AI and data science are rapidly growing fields with high demand",
          isCorrect: true
        },
        {
          id: "b",
          text: "Basket Weaving only",
          emoji: "🧺",
          description: "While traditional crafts have value, they're not emerging fields like AI",
          isCorrect: false
        },
        {
          id: "c",
          text: "Traditional manufacturing only",
          emoji: "🏭",
          description: "Traditional manufacturing is being transformed, not emerging as new",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why are some careers becoming obsolete?",
      emoji: "🔚",
      options: [
        {
          id: "a",
          text: "Technology advancement and changing needs",
          emoji: "💻",
          description: "Exactly! Automation and evolving demands make some roles less relevant",
          isCorrect: true
        },
        {
          id: "b",
          text: "Lack of interest",
          emoji: "😴",
          description: "Interest alone doesn't make careers obsolete or emerging",
          isCorrect: false
        },
        {
          id: "c",
          text: "Government policies",
          emoji: "🏛️",
          description: "While policies affect careers, technology is the primary driver of obsolescence",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What drives emergence of new careers?",
      emoji: "🌱",
      options: [
        {
          id: "a",
          text: "Technological innovation and societal needs",
          emoji: "🔧",
          description: "Perfect! New technologies and social challenges create career opportunities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Random chance",
          emoji: "🎲",
          description: "Career emergence follows patterns related to innovation and demand",
          isCorrect: false
        },
        {
          id: "c",
          text: "Elimination of all jobs",
          emoji: "💥",
          description: "Job displacement creates new roles rather than eliminating all opportunities",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can teens prepare for future careers?",
      emoji: "📘",
      options: [
        {
          id: "a",
          text: "Continuous learning and adaptability",
          emoji: "🔄",
          description: "Exactly! Flexibility and ongoing skill development are key for future success",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sticking to old methods",
          emoji: "📎",
          description: "Rigid approaches limit opportunities in rapidly changing fields",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding technology",
          emoji: "📴",
          description: "Technology literacy is essential for most modern careers",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a benefit of exploring emerging fields?",
      emoji: "💎",
      options: [
        {
          id: "a",
          text: "Better job prospects and innovation opportunities",
          emoji: "📈",
          description: "Correct! Emerging fields offer growth potential and creative problem-solving",
          isCorrect: true
        },
        {
          id: "b",
          text: "Less competition",
          emoji: "🕊️",
          description: "Emerging fields attract talent, creating healthy competition",
          isCorrect: false
        },
        {
          id: "c",
          text: "Guaranteed success",
          emoji: "🎯",
          description: "No field guarantees success - effort and skills always matter",
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
      title="Quiz on Emerging Careers"
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

export default QuizEmergingCareers;