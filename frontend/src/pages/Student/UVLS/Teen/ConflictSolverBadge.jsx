import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const ConflictSolverBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-80");
  const gameId = gameData?.id || "uvls-teen-80";
  
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
      title: "Resolve Friend Disagreement",
      question: "Two friends are arguing about a group project decision. How do you help resolve it?",
      options: [
       
        { 
          text: "Pick one side and ignore the other", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Stay out of it completely", 
          emoji: "🙈", 
          isCorrect: false
        },
         { 
          text: "Listen to both sides, find common ground, and suggest a compromise", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Blame both parties equally", 
          emoji: "⚖️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Mediate Classroom Conflict",
      question: "Classmates are having a disagreement in class. How do you mediate effectively?",
      options: [
       
        { 
          text: "Take one person's side publicly", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Make fun of the conflict", 
          emoji: "😄", 
          isCorrect: false
        },
        { 
          text: "Tell the teacher to handle it", 
          emoji: "👩‍🏫", 
          isCorrect: false
        },
         { 
          text: "Help them express their views calmly and find a solution together", 
          emoji: "💬", 
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      title: "Handle Team Dispute",
      question: "Your team can't agree on roles. How do you solve this conflict?",
      options: [
        { 
          text: "Facilitate discussion to understand everyone's strengths and assign roles fairly", 
          emoji: "👥", 
          isCorrect: true
        },
        { 
          text: "Force your own solution", 
          emoji: "👑", 
          isCorrect: false
        },
        { 
          text: "Let the conflict continue", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Assign roles randomly", 
          emoji: "🎲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Resolve Misunderstanding",
      question: "There's a misunderstanding between peers. How do you help clarify?",
      options: [
        
        { 
          text: "Spread rumors about it", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Ignore the misunderstanding", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Help clarify the facts and encourage open communication between the parties", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Take sides based on personal preference", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Prevent Escalation",
      question: "A conflict is about to escalate into something bigger. How do you prevent it?",
      options: [
       
        { 
          text: "Encourage them to fight it out", 
          emoji: "👊", 
          isCorrect: false
        },
         { 
          text: "De-escalate calmly, separate if needed, and involve appropriate adults", 
          emoji: "🛑", 
          isCorrect: true
        },
        { 
          text: "Record it for social media", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Join the conflict to make it more exciting", 
          emoji: "🔥", 
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
      title="Badge: Conflict Solver"
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

export default ConflictSolverBadge;
