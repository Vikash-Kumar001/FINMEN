import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const ToughConversation = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-61";
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
      text: "Scenario: Your friend borrowed money and hasn't returned it. What's the most constructive way to address this?",
      options: [
        { 
          id: "a", 
          text: "I feel worried when money isn't returned. Can we discuss a plan to pay it back?", 
          emoji: "💰",
          description: "Uses 'I' statements and seeks solution",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "You're a thief! Give me my money back now!", 
          emoji: "😠",
          description: "Accusatory and aggressive",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Forget it, I don't care anymore", 
          emoji: "🤷",
          description: "Avoids addressing the issue",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Scenario: A group member isn't pulling their weight on a project. How do you address this constructively?",
      options: [
        { 
          id: "b", 
          text: "You're lazy and not doing your part!", 
          emoji: "😤",
          description: "Attacking and judgmental",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "I notice the work isn't evenly divided. How can we better collaborate to finish the project?", 
          emoji: "👥",
          description: "Observational, solution-focused",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "I'll just do everything myself", 
          emoji: "😓",
          description: "Doesn't address the problem",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Scenario: You heard your friend is spreading rumors about you. What's the best way to handle this conversation?",
      options: [
        { 
          id: "a", 
          text: "I heard some things are being said about me. Can we talk about it so I understand what's happening?", 
          emoji: "💬",
          description: "Open, non-accusatory approach",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "You're a liar and I hate you!", 
          emoji: "😡",
          description: "Emotional and destructive",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "I'll just ignore them completely", 
          emoji: "🙈",
          description: "Avoids resolving the issue",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Scenario: You and a friend disagree about weekend plans. How do you handle it constructively?",
      options: [
        { 
          id: "b", 
          text: "Your idea is stupid, let's do my plan", 
          emoji: "😒",
          description: "Dismissive and disrespectful",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Whatever, do what you want", 
          emoji: "🤷",
          description: "Passive, doesn't find compromise",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "I prefer this option, but I'd like to hear what you think so we can find something we both enjoy", 
          emoji: "🤝",
          description: "Shares preference, seeks compromise",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Scenario: A friend returned something you lent them in damaged condition. How do you address this?",
      options: [
        { 
          id: "a", 
          text: "I noticed the item came back damaged. How can we figure out how to fix this together?", 
          emoji: "🛠️",
          description: "Observational, solution-oriented",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "You broke it on purpose, you're so careless!", 
          emoji: "😠",
          description: "Assumes intent, accusatory",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "I'll never lend you anything again, forget about it", 
          emoji: "🚫",
          description: "Creates distance, doesn't solve problem",
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
      title="Tough Conversation"
      subtitle={levelCompleted ? "Conversation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
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

export default ToughConversation;
