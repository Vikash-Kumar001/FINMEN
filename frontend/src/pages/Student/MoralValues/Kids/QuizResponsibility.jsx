import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizResponsibility = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-31";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Who is more responsible?",
      options: [
        { 
          id: "a", 
          text: "Child who cleans up toys", 
          emoji: "🧹", 
          description: "Taking care of belongings and keeping things organized",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Child who throws toys everywhere", 
          emoji: "🙈", 
          description: "Leaving messes and not taking care of belongings",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Child who ignores toys", 
          emoji: "😐", 
          description: "Not paying attention to their belongings at all",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Who is more responsible after eating snacks?",
      options: [
        { 
          id: "a", 
          text: "Leaves wrappers on the table", 
          emoji: "🗑️", 
          description: "Not cleaning up after yourself",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Throws wrappers in the bin", 
          emoji: "♻️", 
          description: "Properly disposing of trash and keeping things clean",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Forgets about wrappers", 
          emoji: "🤷", 
          description: "Not paying attention to cleanup",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Who is responsible with school materials?",
      options: [
        { 
          id: "a", 
          text: "Loses books and pencils", 
          emoji: "😵", 
          description: "Not keeping track of important items",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Forgets to bring supplies", 
          emoji: "🙄", 
          description: "Not being prepared for school",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Keeps books and pencils organized", 
          emoji: "📖", 
          description: "Taking good care of school supplies and staying organized",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Who is responsible when it comes to pets?",
      options: [
        { 
          id: "a", 
          text: "Feeds and cares for the pet daily", 
          emoji: "❤️", 
          description: "Taking consistent care and showing commitment",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Ignores feeding the pet", 
          emoji: "🙅‍♂️", 
          description: "Not taking care of responsibilities",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Feeds the pet sometimes", 
          emoji: "🤷", 
          description: "Being inconsistent with pet care",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who shows responsibility during group activities?",
      options: [
        { 
          id: "a", 
          text: "Does not help and distracts others", 
          emoji: "😜", 
          description: "Not contributing and causing problems",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Completes their tasks and helps others", 
          emoji: "💪", 
          description: "Doing your part and supporting the team",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only does their own work", 
          emoji: "😐", 
          description: "Not going beyond minimum requirements",
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Responsibility"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="moral"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand responsibility!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Responsibility means taking care of tasks, belongings, and helping others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember, responsibility means taking care of your duties!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that shows taking care of tasks and belongings.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizResponsibility;
