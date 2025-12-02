import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const EmpathyDebate = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-5";
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
      text: "Should empathy be a required part of the school curriculum? Which argument is most effective for supporting empathy in schools?",
      options: [
        { 
          id: "a", 
          text: "Studies show empathetic students perform better academically", 
          emoji: "📚",
          description: "Evidence-based argument",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "I think empathy is nice to have", 
          emoji: "🤷",
          description: "Weak personal opinion",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "My friend said empathy is important", 
          emoji: "👥",
          description: "Not a strong argument",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How can empathy reduce conflicts in schools? What's the best way to respond when someone disagrees with you?",
      options: [
        { 
          id: "b", 
          text: "That's completely wrong and you don't know what you're talking about", 
          emoji: "😠",
          description: "Aggressive and dismissive",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "I understand your concern, but evidence shows...", 
          emoji: "💬",
          description: "Respectful and evidence-based",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore them completely", 
          emoji: "🙈",
          description: "Doesn't address the disagreement",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Can empathy be taught or is it natural? Which evidence best supports that empathy can be learned?",
      options: [
        { 
          id: "a", 
          text: "Research shows empathy training programs reduce bullying by 40%", 
          emoji: "📊",
          description: "Strong research evidence",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Some people are just born nice", 
          emoji: "🎲",
          description: "Suggests it's only natural",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "You either have it or you don't", 
          emoji: "❌",
          description: "Fixed mindset",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does empathy affect academic performance? What's the relationship between empathy and learning?",
      options: [
        { 
          id: "b", 
          text: "Empathy has no impact on academics", 
          emoji: "🚫",
          description: "Incorrect claim",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Empathetic students collaborate better, leading to improved group project outcomes", 
          emoji: "🤝",
          description: "Shows positive impact",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Empathy actually hurts test scores", 
          emoji: "📉",
          description: "Negative and incorrect",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is respectful disagreement important? When debating, what makes a rebuttal effective and respectful?",
      options: [
        { 
          id: "a", 
          text: "I see your point, however, consider this evidence...", 
          emoji: "💭",
          description: "Respectful and constructive",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Your opinion is stupid", 
          emoji: "😤",
          description: "Disrespectful and dismissive",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Just agree to avoid conflict", 
          emoji: "🤐",
          description: "Avoids meaningful discussion",
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
      title="Empathy Debate"
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

export default EmpathyDebate;
