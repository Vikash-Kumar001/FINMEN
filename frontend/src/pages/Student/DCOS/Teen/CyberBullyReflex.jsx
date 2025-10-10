import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CyberBullyReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentComment, setCurrentComment] = useState(0);
  const [score, setScore] = useState(0);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showComment, setShowComment] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const comments = [
    { id: 1, text: "You're so stupid!", emoji: "😡", isHurtful: true },
    { id: 2, text: "Great job on your project!", emoji: "👏", isHurtful: false },
    { id: 3, text: "Nobody likes you", emoji: "💔", isHurtful: true },
    { id: 4, text: "Thanks for helping me!", emoji: "🙏", isHurtful: false },
    { id: 5, text: "You look ugly today", emoji: "😢", isHurtful: true },
    { id: 6, text: "Nice post!", emoji: "❤️", isHurtful: false },
    { id: 7, text: "Go away, loser!", emoji: "👎", isHurtful: true },
    { id: 8, text: "That's a cool idea!", emoji: "💡", isHurtful: false },
    { id: 9, text: "Everyone hates you", emoji: "😠", isHurtful: true },
    { id: 10, text: "You're amazing!", emoji: "⭐", isHurtful: false }
  ];

  useEffect(() => {
    if (gameStarted && showComment && !showResult) {
      const timer = setTimeout(() => {
        setShowComment(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showComment, currentComment, showResult]);

  const currentCommentData = comments[currentComment];

  const handleAction = (shouldBlock) => {
    if (showComment) return;
    
    const isCorrect = currentCommentData.isHurtful === shouldBlock;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentComment < comments.length - 1) {
      setTimeout(() => {
        setCurrentComment(prev => prev + 1);
        setShowComment(true);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / comments.length) * 100;
      if (accuracy >= 80) {
        setEarnedBadge(true);
      }
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentComment(0);
    setScore(0);
    setEarnedBadge(false);
    setShowComment(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/peer-pressure-story");
  };

  const accuracy = Math.round((score / comments.length) * 100);

  return (
    <GameShell
      title="Cyberbully Reflex"
      subtitle={gameStarted ? `Comment ${currentComment + 1} of ${comments.length}` : "Block Hurtful Comments"}
      onNext={handleNext}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="dcos-teen-11"
      gameType="dcos"
      totalLevels={20}
      currentLevel={11}
      showConfetti={showResult && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Block Cyberbullying!</h2>
            <p className="text-white/80 mb-6">Quickly identify and block/report hurtful comments!</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Comment {currentComment + 1}/{comments.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              {showComment ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentCommentData.emoji}</div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <p className="text-white text-2xl font-bold">"{currentCommentData.text}"</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction(true)}
                    className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Block/Report 🚫</div>
                  </button>
                  <button
                    onClick={() => handleAction(false)}
                    className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Keep ✓</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {earnedBadge ? "🏆 Cyber Shield!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You identified {score} out of {comments.length} correctly ({accuracy}%)
            </p>
            
            {earnedBadge ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Excellent! You can identify cyberbullying and know to block/report it. Never 
                    engage with bullies - just block, report, and tell a trusted adult!
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-2">🛡️</div>
                  <p className="text-white text-2xl font-bold">Cyber Shield Badge!</p>
                  <p className="text-white/80 text-sm mt-2">You protect yourself and others!</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center text-sm">
                    Remember: Hurtful, mean, or threatening comments should always be blocked and 
                    reported. Don't let cyberbullies affect you!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CyberBullyReflex;

