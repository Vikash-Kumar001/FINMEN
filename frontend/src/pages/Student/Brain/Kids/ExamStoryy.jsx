import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const ExamStoryy = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-35");
  const gameId = gameData?.id || "brain-kids-35";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ExamStoryy, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path if not provided in location.state
  const nextGamePath = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return location.state.nextGamePath;
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return nextGame ? nextGame.path : null;
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return null;
  }, [location.state, gameId]);
  
  // Find next game ID if not provided in location.state
  const _nextGameId = useMemo(() => {
    // First, try to get from location.state
    if (location.state?.nextGameId) {
      return location.state.nextGameId;
    }
    
    // Fallback: find next game ID from game data
    try {
      const games = getBrainKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return nextGame ? nextGame.id : null;
      }
    } catch (error) {
      console.warn("Error finding next game ID:", error);
    }
    
    return null;
  }, [location.state, gameId]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Kid is nervous before test. What helps?",
      options: [
        { 
          id: "practice", 
          text: "Practice + calm breathing", 
          emoji: "🧘", 
          description: "Helps reduce anxiety and focus",
          isCorrect: true
        },
        { 
          id: "worry", 
          text: "Worry more", 
          emoji: "😰", 
          description: "Increases stress and anxiety",
          isCorrect: false
        },
        { 
          id: "skip", 
          text: "Skip test", 
          emoji: "🏃", 
          description: "Avoiding doesn't solve the problem",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Before speech, feeling scared. Best?",
      options: [
        { 
          id: "avoid", 
          text: "Avoid it", 
          emoji: "🙈", 
          description: "Avoiding makes fear worse",
          isCorrect: false
        },
        { 
          id: "rehearse", 
          text: "Rehearse and relax", 
          emoji: "🎤", 
          description: "Practice builds confidence",
          isCorrect: true
        },
        { 
          id: "panic", 
          text: "Panic", 
          emoji: "😱", 
          description: "Panic makes it harder to perform",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Competition day, anxious. How to calm?",
      options: [
        { 
          id: "failure", 
          text: "Think failure", 
          emoji: "💔", 
          description: "Negative thoughts increase anxiety",
          isCorrect: false
        },
        { 
          id: "quit", 
          text: "Quit", 
          emoji: "🚪", 
          description: "Giving up doesn't help you grow",
          isCorrect: false
        },
        { 
          id: "visualize", 
          text: "Visualize success + breathe", 
          emoji: "✨", 
          description: "Positive thinking and breathing help",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Doctor visit, nervous. What to do?",
      options: [
        { 
          id: "talk", 
          text: "Talk about fears + breathe deep", 
          emoji: "💬", 
          description: "Sharing helps reduce worry",
          isCorrect: true
        },
        { 
          id: "hide", 
          text: "Hide", 
          emoji: "🫥", 
          description: "Hiding doesn't solve the problem",
          isCorrect: false
        },
        { 
          id: "cry", 
          text: "Cry", 
          emoji: "😢", 
          description: "Crying alone doesn't help",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "New school, worried. Best action?",
      options: [
        { 
          id: "alone", 
          text: "Stay alone", 
          emoji: "🚶", 
          description: "Isolation increases worry",
          isCorrect: false
        },
        { 
          id: "friends", 
          text: "Make friends + stay calm", 
          emoji: "👥", 
          description: "Connecting with others helps",
          isCorrect: true
        },
        { 
          id: "complain", 
          text: "Complain", 
          emoji: "😤", 
          description: "Complaining doesn't help",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Exam Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ExamStoryy;
