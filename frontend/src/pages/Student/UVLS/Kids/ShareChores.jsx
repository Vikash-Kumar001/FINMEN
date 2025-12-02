import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ShareChores = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-21";
  const gameData = getGameDataById(gameId);
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
      text: "How should chores be shared in a family?",
      emoji: "🏠",
      options: [
        { 
          id: "fair", 
          text: "Everyone helps equally", 
          emoji: "⚖️", 
          description: "Fair distribution of work",
          isCorrect: true 
        },
        { 
          id: "one", 
          text: "Only one person does everything", 
          emoji: "😤", 
          description: "Unfair and exhausting",
          isCorrect: false 
        },
        { 
          id: "none", 
          text: "No one does chores", 
          emoji: "😴", 
          description: "Creates a messy home",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to assign chores?",
      emoji: "📋",
      options: [
        { 
          id: "gender", 
          text: "Based on gender stereotypes", 
          emoji: "🚫", 
          description: "Unfair and outdated",
          isCorrect: false 
        },
        { 
          id: "equal", 
          text: "Share tasks fairly among everyone", 
          emoji: "🤝", 
          description: "Fair and inclusive approach",
          isCorrect: true 
        },
        { 
          id: "age", 
          text: "Only older kids do chores", 
          emoji: "👴", 
          description: "Unfair to older children",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "If there are 3 chores and 3 people, how should they be divided?",
      emoji: "🧹",
      options: [
        { 
          id: "one", 
          text: "One person does all 3", 
          emoji: "😓", 
          description: "Unfair and overwhelming",
          isCorrect: false 
        },
        { 
          id: "skip", 
          text: "Skip the chores", 
          emoji: "🙈", 
          description: "Not responsible",
          isCorrect: false 
        },
        { 
          id: "each", 
          text: "Each person does 1 chore", 
          emoji: "✅", 
          description: "Fair and balanced",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if someone has more chores than others?",
      emoji: "⚖️",
      options: [
        { 
          id: "redistribute", 
          text: "Redistribute to make it fair", 
          emoji: "🔄", 
          description: "Ensures fairness for everyone",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Ignore the unfairness", 
          emoji: "😐", 
          description: "Doesn't solve the problem",
          isCorrect: false 
        },
        { 
          id: "add", 
          text: "Give them even more chores", 
          emoji: "😤", 
          description: "Makes it more unfair",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to share chores fairly?",
      emoji: "💡",
      options: [
        { 
          id: "easy", 
          text: "So chores are easier", 
          emoji: "😊", 
          description: "Chores still need to be done",
          isCorrect: false 
        },
        { 
          id: "unfair", 
          text: "So one person doesn't get overwhelmed", 
          emoji: "😰", 
          description: "Prevents burnout and stress",
          isCorrect: true 
        },
        { 
          id: "avoid", 
          text: "To avoid doing chores", 
          emoji: "🙈", 
          description: "Chores still need to be done",
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
      title="Share Chores"
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
                <h3 className="text-2xl font-bold text-white mb-4">Fair Sharing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to share chores fairly!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Sharing chores fairly means everyone helps equally and no one is left with too much work. This creates a happy and fair home!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Try Fairer!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Chores should be shared fairly among everyone!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Fair sharing means everyone gets an equal amount of work. Balance chores so no one person is overwhelmed!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShareChores;
