import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const PeerSupportRoleplay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-7";
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
      text: "Your peer says: 'I've been feeling really down lately. Nothing seems to be going right.' How do you respond?",
      options: [
        { 
          id: "a", 
          text: "That sounds really tough. Can you tell me more about what's been happening?", 
          emoji: "💙",
          description: "Shows empathy and invites sharing",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Just think positive and you'll feel better.", 
          emoji: "😐",
          description: "Dismisses their feelings",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Everyone feels that way sometimes.", 
          emoji: "🤷",
          description: "Minimizes their experience",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your peer says: 'I think I'm just not good enough. Everyone else seems to have it together.' How do you respond?",
      options: [
        { 
          id: "b", 
          text: "Stop comparing yourself to others.", 
          emoji: "👆",
          description: "Commands them without understanding",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "I hear how hard you're being on yourself. Those thoughts must be painful.", 
          emoji: "💝",
          description: "Validates their feelings with empathy",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "You're right, they are better than you.", 
          emoji: "😞",
          description: "Hurts them further",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your peer says: 'I don't want to burden anyone with my problems.' How do you respond?",
      options: [
        { 
          id: "a", 
          text: "Your feelings are important and you're not a burden. I want to help.", 
          emoji: "🤝",
          description: "Reassures them they're not a burden",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yeah, you probably shouldn't bother people.", 
          emoji: "😕",
          description: "Confirms their fear",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Just deal with it yourself then.", 
          emoji: "🚶",
          description: "Abandons them",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your peer says: 'I'm not sure if I should talk to a counselor. What if people think I'm weak?' How do you respond?",
      options: [
        { 
          id: "c", 
          text: "You should just handle it alone.", 
          emoji: "🚫",
          description: "Discourages seeking help",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Seeking help takes courage. It's a sign of strength, not weakness.", 
          emoji: "💪",
          description: "Reframes help-seeking positively",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yeah, people might think that.", 
          emoji: "😰",
          description: "Confirms their fear",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your peer says: 'I feel like I'm always messing up. Nothing I do is right.' How do you respond?",
      options: [
        { 
          id: "a", 
          text: "I can see how frustrating that must be. Can you tell me about a time you succeeded?", 
          emoji: "🌟",
          description: "Validates feelings and helps reframe",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Stop being so negative all the time.", 
          emoji: "😠",
          description: "Dismisses their feelings",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Maybe you are messing up.", 
          emoji: "😕",
          description: "Hurts them",
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
      title="Peer Support Roleplay"
      subtitle={levelCompleted ? "Roleplay Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
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
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic text-lg">
                  "{currentQuestionData.text}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center font-semibold">Choose your response:</p>
              
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

export default PeerSupportRoleplay;
