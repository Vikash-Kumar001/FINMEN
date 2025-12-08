import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayTrueLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-78");
  const gameId = gameData?.id || "moral-teen-78";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayTrueLeader, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Your team is struggling to complete a science project. Some members are tired. As a true leader, what do you do?",
      emoji: "🔬",
      options: [
        { 
          id: "help", 
          text: "Offer to help and motivate the team to finish together", 
          emoji: "💪", 
          description: "Helping and motivating shows true leadership",
          isCorrect: true 
        },
        { 
          id: "hurry", 
          text: "Tell them to hurry up without helping", 
          emoji: "😠", 
          description: "Commanding without helping isn't true leadership",
          isCorrect: false 
        },
        { 
          id: "blame", 
          text: "Blame them for being slow", 
          emoji: "👆", 
          description: "Blaming doesn't help the team",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "During cleaning duty, one student refuses to help. How does a true leader respond?",
      emoji: "🧹",
      options: [
        { 
          id: "complain", 
          text: "Complain loudly to the teacher", 
          emoji: "😠", 
          description: "Complaining doesn't show leadership",
          isCorrect: false 
        },
        { 
          id: "example", 
          text: "Do the task yourself and inspire others by example", 
          emoji: "🌟", 
          description: "Leading by example shows true leadership",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Ignore it and leave the work unfinished", 
          emoji: "😶", 
          description: "Ignoring problems doesn't show leadership",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Your friend takes credit for work you helped with. What's a true leader's action?",
      emoji: "👥",
      options: [
        { 
          id: "argue", 
          text: "Publicly argue and embarrass them", 
          emoji: "😠", 
          description: "Public arguments damage relationships",
          isCorrect: false 
        },
        { 
          id: "stop", 
          text: "Stop working with them forever", 
          emoji: "🚫", 
          description: "Cutting ties doesn't resolve issues",
          isCorrect: false 
        },
        { 
          id: "calm", 
          text: "Calmly talk later and focus on teamwork over ego", 
          emoji: "🤝", 
          description: "Calm communication shows mature leadership",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "A classmate makes a mistake while presenting. Everyone laughs. What do you do as a leader?",
      emoji: "🎤",
      options: [
        { 
          id: "encourage", 
          text: "Encourage them and remind others to be kind", 
          emoji: "💪", 
          description: "Encouraging and promoting kindness shows leadership",
          isCorrect: true 
        },
        { 
          id: "laugh", 
          text: "Join in the laughter", 
          emoji: "😄", 
          description: "Laughing at mistakes is unkind",
          isCorrect: false 
        },
        { 
          id: "silent", 
          text: "Stay silent and ignore it", 
          emoji: "😶", 
          description: "Leaders should support others",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Your team wins a competition. As the leader, how do you celebrate?",
      emoji: "🏆",
      options: [
        { 
          id: "praise", 
          text: "Take all the praise for yourself", 
          emoji: "😏", 
          description: "Taking all credit is selfish",
          isCorrect: false 
        },
        { 
          id: "thank", 
          text: "Thank the team and share credit with everyone", 
          emoji: "👏", 
          description: "Sharing credit shows true leadership",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Ignore the team and post about it alone", 
          emoji: "😶", 
          description: "Ignoring the team is disrespectful",
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

  return (
    <GameShell
      title="Roleplay: True Leader"
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
      gameType="moral"
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {!showResult && questions[currentQuestion] ? (
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
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
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
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
                <h3 className="text-2xl font-bold text-white mb-4">You're a True Leader!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to lead by serving others!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: True leaders serve others, lead by example, and share credit with their team!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose actions that serve and support your team!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: True leaders serve others, lead by example, and share credit. Practice leading through service!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayTrueLeader;
