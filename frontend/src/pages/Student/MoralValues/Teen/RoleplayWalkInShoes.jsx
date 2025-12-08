import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayWalkInShoes = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-25");
  const gameId = gameData?.id || "moral-teen-25";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayWalkInShoes, using fallback ID");
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
      text: "You are a new student in school and no one talks to you. How would you feel?",
      emoji: "😔",
      options: [
        { 
          id: "lonely", 
          text: "Lonely", 
          emoji: "😔", 
          description: "Being ignored makes people feel isolated",
          isCorrect: true 
        },
        { 
          id: "excited", 
          text: "Excited", 
          emoji: "😄", 
          description: "Being ignored doesn't usually cause excitement",
          isCorrect: false 
        },
        { 
          id: "angry", 
          text: "Angry", 
          emoji: "😠", 
          description: "While possible, lonely is the more common feeling",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Your friend lost their pencil and looks sad. How would you feel if it were you?",
      emoji: "✏️",
      options: [
        { 
          id: "happy", 
          text: "Happy", 
          emoji: "😄", 
          description: "Losing something important doesn't make you happy",
          isCorrect: false 
        },
        { 
          id: "upset", 
          text: "Upset", 
          emoji: "😢", 
          description: "Losing something important makes you feel upset",
          isCorrect: true 
        },
        { 
          id: "confused", 
          text: "Confused", 
          emoji: "🤔", 
          description: "While possible, upset is the more common feeling",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "You dropped your lunch in front of everyone. What feeling best fits?",
      emoji: "🍱",
      options: [
        { 
          id: "proud", 
          text: "Proud", 
          emoji: "😊", 
          description: "Embarrassing moments don't make you proud",
          isCorrect: false 
        },
        { 
          id: "calm", 
          text: "Calm", 
          emoji: "😌", 
          description: "Embarrassing moments usually don't make you calm",
          isCorrect: false 
        },
        { 
          id: "embarrassed", 
          text: "Embarrassed", 
          emoji: "😳", 
          description: "Public mistakes make you feel embarrassed",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "A classmate forgot their homework. What might they feel?",
      emoji: "📝",
      options: [
        { 
          id: "worried", 
          text: "Worried", 
          emoji: "😟", 
          description: "Forgetting homework makes you worried about consequences",
          isCorrect: true 
        },
        { 
          id: "relaxed", 
          text: "Relaxed", 
          emoji: "😌", 
          description: "Forgetting homework doesn't usually make you relaxed",
          isCorrect: false 
        },
        { 
          id: "joyful", 
          text: "Joyful", 
          emoji: "😄", 
          description: "Forgetting homework doesn't make you joyful",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You helped someone who fell down. How would that make you feel?",
      emoji: "🤝",
      options: [
        { 
          id: "guilty", 
          text: "Guilty", 
          emoji: "😔", 
          description: "Helping others doesn't make you feel guilty",
          isCorrect: false 
        },
        { 
          id: "angry", 
          text: "Angry", 
          emoji: "😠", 
          description: "Helping others doesn't make you feel angry",
          isCorrect: false 
        },
        { 
          id: "kind", 
          text: "Kind", 
          emoji: "💖", 
          description: "Helping others makes you feel kind and good",
          isCorrect: true 
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
      title="Roleplay: Walk in Shoes"
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Empathy!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You understand how others might feel!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Empathy means understanding how others feel by imagining yourself in their situation!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Try to imagine how others feel in different situations!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Empathy means understanding how others feel. Practice imagining yourself in their situation!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayWalkInShoes;
