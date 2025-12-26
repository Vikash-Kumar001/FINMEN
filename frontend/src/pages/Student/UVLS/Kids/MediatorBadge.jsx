import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const MediatorBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-80");
  const gameId = gameData?.id || "uvls-kids-80";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for MediatorBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getUvlsKidsGames({});
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
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Toy Dispute",
      description: "Two friends are fighting over a toy. How do you help?",
      question: "Two friends are fighting over a toy. How do you help?",
      options: [
        { 
          text: "Help them find a fair solution - Listen to both and suggest taking turns", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Pick a winner - Choose who gets the toy", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Let them fight - Stay out of it completely", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Take the toy away - Remove the source of conflict", 
          emoji: "📤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Game Argument",
      description: "Friends are arguing about game rules. What do you do?",
      question: "Friends are arguing about game rules. What do you do?",
      options: [
        { 
          text: "Take one side - Support one friend over the other", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Help them agree on rules - Find a compromise that works for everyone", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Walk away - Leave them to figure it out", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Change the game - Suggest playing something else", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Sharing Conflict",
      description: "Two friends both want the same snack. How do you help?",
      question: "Two friends both want the same snack. How do you help?",
      options: [
        { 
          text: "Give it to one person - Pick who gets it all", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Do nothing - Let them argue about it", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Suggest sharing equally - Help them split it fairly", 
          emoji: "🍎", 
          isCorrect: true
        },
        { 
          text: "Buy another snack - Get a replacement", 
          emoji: "🛒", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Team Disagreement",
      description: "Your team can't agree on a project idea. What do you do?",
      question: "Your team can't agree on a project idea. What do you do?",
      options: [
        { 
          text: "Force your idea - Make everyone use your idea", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Help combine ideas - Find a way to use everyone's ideas", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "Let them argue - Stay quiet and wait", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Vote on ideas - Have everyone vote for their favorite", 
          emoji: "🗳️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Playground Dispute",
      description: "Kids are fighting over who goes first. How do you help?",
      question: "Kids are fighting over who goes first. How do you help?",
      options: [
        { 
          text: "Pick someone - Choose who goes first", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Ignore the fight - Continue playing without them", 
          emoji: "🙈", 
          isCorrect: false
        },
        
        { 
          text: "Create a new game - Suggest something that doesn't require turns", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          text: "Suggest fair rotation - Help them take turns fairly", 
          emoji: "🔄", 
          isCorrect: true
        },
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
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Mediator"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="uvls"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAnswer(index);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === index
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Mediator Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great mediation skills!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being a good mediator means helping people find fair solutions, listening to all sides, finding compromises, combining ideas, and suggesting fair rotations. You've shown you can help resolve conflicts!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Mediation skills are important for resolving conflicts!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setChallenge(0);
                    setScore(0);
                    setAnswered(false);
                    setSelectedAnswer(null);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always listen to all sides, find compromises, and suggest fair solutions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MediatorBadge;
