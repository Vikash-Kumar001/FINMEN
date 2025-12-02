import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const PolicyCasePuzzle = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-19";
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
      text: "Several students with diverse needs report feeling excluded. As a student leader, which policy action should you recommend?",
      options: [
        { 
          id: "a", 
          text: "Implement mandatory diversity and inclusion training for all students", 
          emoji: "🎓",
          description: "Evidence-based approach that builds understanding",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Just tell students to be nicer", 
          emoji: "😐",
          description: "Vague directive with minimal impact",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore the problem", 
          emoji: "🙈",
          description: "Doesn't address the issue",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's another effective policy to improve inclusion?",
      options: [
        { 
          id: "b", 
          text: "Segregate students by ability", 
          emoji: "🚫",
          description: "Creates divisions",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Create student-led inclusion committees", 
          emoji: "👥",
          description: "Peer-driven initiatives create lasting change",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Hope it goes away", 
          emoji: "🤷",
          description: "Not a solution",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which policy establishes clear boundaries for inclusion?",
      options: [
        { 
          id: "a", 
          text: "Establish clear anti-discrimination policies with consequences", 
          emoji: "🛡️",
          description: "Clear boundaries reduce incidents",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Make vague suggestions", 
          emoji: "💭",
          description: "Not effective",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Do nothing", 
          emoji: "❌",
          description: "Won't help",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you ensure all students can participate fully?",
      options: [
        { 
          id: "b", 
          text: "Only provide one format for everything", 
          emoji: "📄",
          description: "Limits accessibility",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore different needs", 
          emoji: "🙈",
          description: "Doesn't address the problem",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Provide accessible materials and flexible participation options", 
          emoji: "♿",
          description: "Students with different needs can participate fully",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What policy helps build appreciation for diversity?",
      options: [
        { 
          id: "a", 
          text: "Celebrate diversity through cultural awareness events", 
          emoji: "🌍",
          description: "Students learn to appreciate differences",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Avoid talking about differences", 
          emoji: "🤐",
          description: "Misses learning opportunities",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Pretend everyone is the same", 
          emoji: "🔄",
          description: "Doesn't acknowledge diversity",
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
      title="Policy Case Puzzle"
      subtitle={levelCompleted ? "Puzzle Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
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
            <h3 className="text-white text-xl font-bold mb-2">School Inclusion Challenge</h3>
            <p className="text-white/90">Several students with diverse needs report feeling excluded from activities. As a student leader, recommend policy actions to improve inclusion.</p>
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

export default PolicyCasePuzzle;
