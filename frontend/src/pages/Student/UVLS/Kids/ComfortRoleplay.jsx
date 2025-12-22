import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const ComfortRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-8";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Your friend is crying because they lost their favorite toy. What's the best way to comfort them?",
      emoji: "😢",
      options: [
        
        { 
          id: "dismiss", 
          text: "It's just a toy, get over it.", 
          emoji: "😤", 
          description: "Dismissive and unkind",
          isCorrect: false 
        },
        { 
          id: "help", 
          text: "I'm sorry you're sad. Can I help you look for it?", 
          emoji: "🔍", 
          description: "Show empathy and offer help",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Stop crying, it's not a big deal.", 
          emoji: "🚫", 
          description: "Invalidates their feelings",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Your classmate is upset because they got a bad grade. How should you comfort them?",
      emoji: "📝",
      options: [
        { 
          id: "support", 
          text: "You can do better next time. I believe in you!", 
          emoji: "💪", 
          description: "Encouraging and supportive",
          isCorrect: true 
        },
        { 
          id: "insult", 
          text: "You're not smart enough, that's why.", 
          emoji: "😔", 
          description: "Hurts their self-esteem",
          isCorrect: false 
        },
        { 
          id: "blame", 
          text: "I told you so, you should have studied more.", 
          emoji: "👆", 
          description: "Blaming and unhelpful",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A new student is sitting alone and looks lonely. What should you do?",
      emoji: "😔",
      options: [
        
        { 
          id: "judge", 
          text: "Why are you sitting alone? That's weird.", 
          emoji: "🤨", 
          description: "Judgmental and unkind",
          isCorrect: false 
        },
        { 
          id: "ignore", 
          text: "You look sad. What's wrong with you?", 
          emoji: "😕", 
          description: "Insensitive question",
          isCorrect: false 
        },
        { 
          id: "invite", 
          text: "Hi! Want to sit with me and my friends?", 
          emoji: "👋", 
          description: "Welcoming and inclusive",
          isCorrect: true 
        },
      ]
    },
    {
      id: 4,
      text: "Your sibling is scared about their first day at a new school. How can you comfort them?",
      emoji: "😰",
      options: [
        
        { 
          id: "dismiss", 
          text: "Stop being scared, it's just school.", 
          emoji: "😒", 
          description: "Dismisses their fear",
          isCorrect: false 
        },
        { 
          id: "support", 
          text: "I'll walk with you to school. You'll be okay!", 
          emoji: "🚶", 
          description: "Offers practical support",
          isCorrect: true 
        },
        { 
          id: "scare", 
          text: "Everyone will laugh at you.", 
          emoji: "😱", 
          description: "Makes them more scared",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Your friend is worried about a test tomorrow. What's the best way to help?",
      emoji: "😟",
      options: [
        { 
          id: "study", 
          text: "Want to study together? We can practice!", 
          emoji: "📚", 
          description: "Offers help and support",
          isCorrect: true 
        },
        { 
          id: "discourage", 
          text: "You'll probably fail anyway.", 
          emoji: "😞", 
          description: "Discouraging and negative",
          isCorrect: false 
        },
        { 
          id: "dismiss", 
          text: "Tests are easy, why are you worried?", 
          emoji: "🤷", 
          description: "Minimizes their concern",
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
      title="Comfort Roleplay"
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
                <h3 className="text-2xl font-bold text-white mb-4">You're So Comforting!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to be kind and supportive!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Comforting others means showing empathy, offering help, and being understanding!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose kind and understanding responses!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Comfort others by showing empathy, offering help, and being understanding. Practice saying these phrases out loud with the right tone!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ComfortRoleplay;
