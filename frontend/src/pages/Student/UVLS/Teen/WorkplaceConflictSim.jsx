import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const WorkplaceConflictSim = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-79");
  const gameId = gameData?.id || "uvls-teen-79";
  
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
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Task Overlap Conflict",
      question: "Conflict: Intern vs senior task overlap. What's the most balanced solution?",
      options: [
        { 
          text: "Balance tasks or rotate duties", 
          emoji: "👔",
          isCorrect: true
        },
        { 
          text: "Intern does all work", 
          emoji: "😰",
          isCorrect: false
        },
        { 
          text: "Senior avoids work", 
          emoji: "😔",
          isCorrect: false
        },
        { 
          text: "Assign tasks based on expertise and development goals", 
          emoji: "🎯",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Deadline Pressure",
      question: "Conflict: Deadline pressure. What's the most balanced solution?",
      options: [
        
        { 
          text: "Overwork one person", 
          emoji: "😰",
          isCorrect: false
        },
        { 
          text: "Miss deadline", 
          emoji: "🚫",
          isCorrect: false
        },
        { 
          text: "Prioritize and delegate or team overtime", 
          emoji: "⏰",
          isCorrect: true
        },
        { 
          text: "Cancel the project", 
          emoji: "❌",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Idea Credit Dispute",
      question: "Conflict: Idea credit dispute. What's the most balanced solution?",
      options: [
        
        { 
          text: "Claim all credit", 
          emoji: "😤",
          isCorrect: false
        },
        { 
          text: "Ignore the issue", 
          emoji: "🙈",
          isCorrect: false
        },
        { 
          text: "Compete for individual recognition", 
          emoji: "🏆",
          isCorrect: false
        },
        { 
          text: "Acknowledge contributions or team recognition", 
          emoji: "💡",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "Resource Sharing",
      question: "Conflict: Resource sharing. What's the most balanced solution?",
      options: [
       
        { 
          text: "First come first served", 
          emoji: "🏃",
          isCorrect: false
        },
         { 
          text: "Schedule usage or equitable allocation", 
          emoji: "🛠️",
          isCorrect: true
        },
        { 
          text: "Hoard resources", 
          emoji: "😤",
          isCorrect: false
        },
        { 
          text: "Request more resources", 
          emoji: "➕",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Feedback Conflict",
      question: "Conflict: Feedback conflict. What's the most balanced solution?",
      options: [
        
        { 
          text: "Ignore feedback", 
          emoji: "🙈",
          isCorrect: false
        },
        { 
          text: "Escalate to boss immediately", 
          emoji: "📢",
          isCorrect: false
        },
        { 
          text: "Constructive discussion or mediate meeting", 
          emoji: "🗣️",
          isCorrect: true
        },
        { 
          text: "Defend your position aggressively", 
          emoji: "🛡️",
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

  const currentChallengeData = challenges[challenge];

  return (
    <GameShell
      title="Badge: Workplace Conflict Sim"
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
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentChallengeData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallengeData.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallengeData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallengeData.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default WorkplaceConflictSim;
