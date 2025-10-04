import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gameCompletionService from "../../../services/gameCompletionService";
import { toast } from "react-toastify";

/* --------------------- Floating Background Particles --------------------- */
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

export const ScoreFlash = ({ points }) => (
  <div
    className="fixed inset-0 flex items-center justify-center pointer-events-none"
    style={{ zIndex: 1000 }}
  >
    <div
      className="text-6xl md:text-[12rem] font-extrabold text-yellow-400"
      style={{
        animation: "score-flash 1s ease-out forwards",
      }}
    >
      +{points}
    </div>

    {/* Global keyframes for score flash */}
    <style>
      {`
        @keyframes score-flash {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1.2); }
          60% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}
    </style>
  </div>
);

/* --------------------- Level Complete Component with Instant Coins --------------------- */
export const LevelCompleteHandler = ({ 
  gameId, 
  gameType = 'ai', 
  levelNumber, 
  levelScore, 
  maxLevelScore = 20,
  onComplete,
  children 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleLevelComplete = async () => {
    if (hasSubmitted || !gameId) return;
    
    setIsSubmitting(true);
    setHasSubmitted(true);
    
    try {
      const result = await gameCompletionService.completeLevel(gameId, {
        levelNumber,
        levelScore,
        maxLevelScore,
        coinsForLevel: 5 // Default coins per level
      });
      
      if (result.success && result.coinsEarned > 0) {
        // Show coin notification for this level
        toast.success(`🎯 Level ${levelNumber} complete! +${result.coinsEarned} HealCoins`);
      }
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Failed to submit level completion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit when level is completed
  useEffect(() => {
    if (levelScore > 0 && !hasSubmitted) {
      handleLevelComplete();
    }
  }, [levelScore, hasSubmitted]);

  return children;
};

/* --------------------- Game Card --------------------- */
export const GameCard = ({ children }) => (
  <div
    className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl z-10 max-w-3xl mx-auto w-full"
    style={{ textAlign: "center" }}
  >
    {children}
  </div>
);

/* --------------------- Option Button --------------------- */
export const OptionButton = ({ option, onClick, selected, disabled, feedback }) => {
  const isCorrect = feedback?.type === "correct" && selected === option;
  const isWrong = feedback?.type === "wrong" && selected === option;

  return (
    <button
      onClick={() => !disabled && onClick(option)}
      disabled={disabled}
      style={{
        minWidth: "120px",
        padding: "12px 20px",
        borderRadius: "16px",
        backgroundColor: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(8px)",
        border: `3px solid ${isCorrect ? "#4CAF50" : isWrong ? "#F44336" : "rgba(255,255,255,0.3)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        boxShadow: selected ? "0 0 12px rgba(255,255,255,0.4)" : "0 4px 10px rgba(0,0,0,0.15)",
        transform: selected ? "scale(1.05)" : "scale(1)",
        opacity: disabled && !selected ? 0.6 : 1,
        fontSize: "clamp(14px, 2.5vw, 18px)",
        fontWeight: "bold",
        color: "white",
        textTransform: "capitalize",
      }}
    >
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </button>
  );
};

/* --------------------- Feedback Bubble --------------------- */
export const FeedbackBubble = ({ message, type }) => (
  <div
    style={{
      backgroundColor: type === "correct" ? "#4CAF50" : "#F44336",
      color: "white",
      padding: "10px 18px",
      borderRadius: "25px",
      fontSize: "clamp(16px, 4vw, 24px)",
      fontWeight: "bold",
      marginTop: "18px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      animation: "pop-in 0.3s ease-out forwards",
      textAlign: "center",
    }}
  >
    {message}
  </div>
);

/* --------------------- Confetti --------------------- */
export const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          backgroundColor: `hsl(${Math.random() * 360},100%,70%)`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random(),
          animation: `confetti-fall ${Math.random() * 2 + 3}s linear infinite`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      />
    ))}
  </div>
);

/* --------------------- Game Over Modal with Heal Coins --------------------- */
export const GameOverModal = ({ score, gameId, gameType = 'ai', totalLevels = 5, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  useEffect(() => {
    const submitGameCompletion = async () => {
      if (submissionComplete || !gameId) return;
      
      setIsSubmitting(true);
      try {
        const result = await gameCompletionService.completeGame({
          gameId,
          gameType,
          score,
          maxScore: totalLevels * 20, // Assuming 20 points max per level
          levelsCompleted: totalLevels,
          totalLevels,
          timePlayed: 0, // Can be enhanced to track actual time
          isFullCompletion: true
        });
        
        if (result.success) {
          setCoinsEarned(result.coinsEarned);
          setSubmissionComplete(true);
        }
      } catch (error) {
        console.error('Failed to submit game completion:', error);
        toast.error('Failed to save progress, but you can still replay!');
      } finally {
        setIsSubmitting(false);
      }
    };

    submitGameCompletion();
  }, [gameId, gameType, score, totalLevels, submissionComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-8 z-10 text-center max-w-md w-full mx-4 animate-pop">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Congratulations!</h2>
        <p className="text-gray-600 text-lg mb-4">
          You finished the game with a score of{" "}
          <span className="font-bold text-gray-900">{score}</span> ⭐
        </p>
        
        {isSubmitting ? (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Saving your progress...</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-4">
              <h3 className="text-xl font-bold text-green-700 mb-2">💰 HealCoins Earned!</h3>
              <p className="text-3xl font-black text-green-600">+{coinsEarned}</p>
              {coinsEarned === 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You've already earned coins for this game, but you can replay for fun!
                </p>
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </button>
      </div>

      <style jsx>{`
        .animate-pop {
          animation: pop-in 0.4s ease-out forwards;
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/* --------------------- Main GameShell --------------------- */
const GameShell = ({
  title,
  subtitle,
  rightSlot,
  children,
  onNext,
  nextEnabled,
  nextLabel = "Next Level",
  showGameOver = false,
  score,
  gameId, // New prop for game identification
  gameType = 'ai', // New prop for game type
  totalLevels = 5, // New prop for total levels
  currentLevel = 1, // New prop for current level
  showConfetti = false, // New prop to control confetti display
}) => {
  const navigate = useNavigate();

  const handleGameOverClose = () => {
    // Changed redirect URL to financial literacy games page
    navigate("/games/financial-literacy/kids");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Confetti effect when showConfetti is true */}
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 z-10">
        <button
          onClick={() => navigate("/games/financial-literacy/kids")}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all cursor-pointer"
        >
          ← Back
        </button>
        {/* Added score and level display */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-white font-medium">Score: {score || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-white font-medium">Level {currentLevel}/{totalLevels}</span>
          </div>
        </div>
        {rightSlot || <div />}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 z-10">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-title-glow">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-white/80 text-base md:text-lg mt-2 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>

      {/* Next Level Button */}
      {onNext && (
        <div className="flex justify-center py-6 z-10">
          <button
            onClick={onNext}
            disabled={!nextEnabled}
            className={`rounded-full flex flex-col items-center justify-center font-bold text-white shadow-lg transition-all bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 animate-title-glow
              ${nextEnabled ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-50"}`}
            style={{
              width: "clamp(84px, 12vw, 120px)",
              height: "clamp(84px, 12vw, 120px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <span>{nextLabel.split(" ")[0]}</span>
            {nextLabel.split(" ")[1] && <span>{nextLabel.split(" ")[1]}</span>}
          </button>
        </div>
      )}

      {/* Centralized Game Over Modal with HealCoins */}
      {showGameOver && (
        <GameOverModal 
          score={score} 
          gameId={gameId}
          gameType={gameType}
          totalLevels={totalLevels}
          onClose={handleGameOverClose} 
        />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-title-glow {
          animation: title-glow 2s ease-in-out infinite;
        }
        @keyframes title-glow {
          0%,100% { filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GameShell;