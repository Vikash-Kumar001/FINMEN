import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GoodVsBadPostQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-64");
  const gameId = gameData?.id || "dcos-kids-64";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for GoodVsBadPostQuiz, using fallback ID");
  }
  
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
      text: "Which post is safe to share online?",
      options: [
        { 
          id: "a", 
          text: "I love football! ⚽", 
          emoji: "⚽", 
          description: "Positive posts about hobbies are safe",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Teacher is stupid. 😡", 
          emoji: "😡", 
          description: "Mean posts about others",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "My address is...", 
          emoji: "🏠", 
          description: "Posts with personal information",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which comment is kind?",
      options: [
        { 
          id: "a", 
          text: "You played really well today! 👏", 
          emoji: "👏", 
          description: "Encouraging and positive comments",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "You're the worst player ever! 😠", 
          emoji: "😠", 
          description: "Mean and hurtful comments",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "I don't care", 
          emoji: "😐", 
          description: "Indifferent comments",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What kind of post should you avoid?",
      options: [
        { 
          id: "a", 
          text: "Sharing fun team pictures 🏆", 
          emoji: "🏆", 
          description: "Positive team photos",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Posting mean comments about friends 😢", 
          emoji: "😢", 
          description: "Mean posts hurt others",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Sharing your favorite book 📚", 
          emoji: "📚", 
          description: "Sharing interests",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which post shows good digital behavior?",
      options: [
        { 
          id: "a", 
          text: "Congrats on your new puppy! 🐶", 
          emoji: "🐶", 
          description: "Kind and supportive posts",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Your puppy looks ugly. 🙄", 
          emoji: "🙄", 
          description: "Mean and rude posts",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "I hate puppies", 
          emoji: "😠", 
          description: "Negative posts",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do before posting?",
      options: [
        { 
          id: "a", 
          text: "Think if it's kind and safe 😊", 
          emoji: "😊", 
          description: "Always think before posting",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Post it quickly without checking 😬", 
          emoji: "😬", 
          description: "Post immediately",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask strangers first", 
          emoji: "👥", 
          description: "Get approval from strangers",
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Good vs Bad Posts"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
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
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default GoodVsBadPostQuiz;
