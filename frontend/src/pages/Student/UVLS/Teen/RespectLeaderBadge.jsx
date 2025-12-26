import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const RespectLeaderBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-20");
  const gameId = gameData?.id || "uvls-teen-20";
  
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
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Leading Inclusion Initiative",
      question: "You want to organize an inclusion event at school. Some students say it's not necessary. How do you lead?",
      options: [
        { 
          text: "Listen to concerns, explain benefits, and invite everyone to participate", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Force everyone to participate", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Give up and cancel the event", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Exclude those who don't want to participate", 
          emoji: "❌", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Mentoring a Peer",
      question: "A peer feels excluded. They're hesitant about joining activities. How do you mentor them?",
      options: [
        
        { 
          text: "Tell them to just get over it", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Ignore their hesitation", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Push them to join without support", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          text: "Offer to attend activities together and provide ongoing support", 
          emoji: "💙", 
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      title: "Challenging Discrimination",
      question: "You witness discriminatory behavior. Someone is being treated unfairly based on their background. How do you respond as a leader?",
      options: [
        { 
          text: "Speak up safely, report it, and support the affected person", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Stay quiet to avoid conflict", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          text: "Join in the discrimination", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Laugh along to fit in", 
          emoji: "😂", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Creating Inclusive Content",
      question: "You're creating content to promote inclusion. How do you ensure it's truly inclusive?",
      options: [
        
        { 
          text: "Only feature one group", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Include diverse voices and perspectives in the creation process", 
          emoji: "🎨", 
          isCorrect: true
        },
        { 
          text: "Create it alone without input", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Focus on a single perspective", 
          emoji: "👁️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Facilitating Dialogue",
      question: "You're facilitating a discussion about inclusion. People have strong, conflicting opinions. How do you lead?",
      options: [
        
        { 
          text: "Let one person dominate the conversation", 
          emoji: "👑", 
          isCorrect: false
        },
        { 
          text: "Avoid the difficult topics", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Create safe space for respectful dialogue, ensure everyone is heard", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Shut down opposing viewpoints", 
          emoji: "❌", 
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
      title="Respect Leader Badge"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
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
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You're a Respect Leader!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Practice leadership skills by supporting inclusion and respect!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default RespectLeaderBadge;
