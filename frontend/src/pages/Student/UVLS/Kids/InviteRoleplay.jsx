import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InviteRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-18";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "A shy student is standing alone during group activities. What should you say?",
      emoji: "🧍",
      options: [
        { 
          id: "invite1", 
          text: "Hey! Want to be in our group?", 
          emoji: "👋", 
          description: "Direct and welcoming invitation",
          isCorrect: true 
        },
        { 
          id: "watch", 
          text: "You can watch us if you want", 
          emoji: "👀", 
          description: "Passive and not inclusive",
          isCorrect: false 
        },
        { 
          id: "enough", 
          text: "We already have enough people", 
          emoji: "🚫", 
          description: "Excludes them from joining",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A new student looks confused during PE class. What should you do?",
      emoji: "🤸",
      options: [
        { 
          id: "figure", 
          text: "Figure it out yourself", 
          emoji: "😒", 
          description: "Unhelpful and dismissive",
          isCorrect: false 
        },
        { 
          id: "explain", 
          text: "Want me to explain the game rules?", 
          emoji: "📖", 
          description: "Offers help and explanation",
          isCorrect: true 
        },
        { 
          id: "know", 
          text: "Don't you know how to play?", 
          emoji: "🤨", 
          description: "Makes them feel embarrassed",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Someone is sitting alone during art time. What should you say?",
      emoji: "🖌️",
      options: [
        { 
          id: "why", 
          text: "Why aren't you with anyone?", 
          emoji: "😕", 
          description: "Makes them feel uncomfortable",
          isCorrect: false 
        },
        { 
          id: "find", 
          text: "You should find your own group", 
          emoji: "🚶", 
          description: "Excludes them from joining",
          isCorrect: false 
        },
        { 
          id: "together", 
          text: "Want to create something together?", 
          emoji: "🎨", 
          description: "Invites them to collaborate",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "A classmate is waiting to be picked for a team. What should you do?",
      emoji: "👥",
      options: [
        { 
          id: "pick", 
          text: "Come join our team! We'd love to have you!", 
          emoji: "🤝", 
          description: "Welcoming and inclusive invitation",
          isCorrect: true 
        },
        { 
          id: "wait", 
          text: "Maybe next time", 
          emoji: "⏳", 
          description: "Delays inclusion",
          isCorrect: false 
        },
        { 
          id: "ignore", 
          text: "Pretend you don't see them", 
          emoji: "🙈", 
          description: "Excludes them completely",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Someone looks nervous about joining a group discussion. What should you say?",
      emoji: "💬",
      options: [
        { 
          id: "quiet", 
          text: "You're too quiet, speak up", 
          emoji: "😤", 
          description: "Puts pressure on them",
          isCorrect: false 
        },
        { 
          id: "welcome", 
          text: "We'd love to hear what you think! Join us!", 
          emoji: "👂", 
          description: "Encouraging and welcoming",
          isCorrect: true 
        },
        { 
          id: "later", 
          text: "Maybe you can join later", 
          emoji: "⏰", 
          description: "Postpones their inclusion",
          isCorrect: false 
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Invite Roleplay"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
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
      gameType="uvls"
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {!showResult && questions[currentQuestion] ? (
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6 text-center">
                <div className="text-6xl mb-3">{questions[currentQuestion].emoji}</div>
                <h3 className="text-white text-xl font-bold">{questions[currentQuestion].text}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`w-full text-left p-4 rounded-xl transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{option.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{option.text}</div>
                        <div className="text-sm opacity-90">{option.description}</div>
                      </div>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Inviting!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to make everyone feel welcome!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Inviting others and being inclusive makes everyone feel welcome and valued!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember to invite others and be welcoming!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Use phrases that invite others to join and make them feel welcome. Pair shy students with buddies!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InviteRoleplay;
