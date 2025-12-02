import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SupportRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-28";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Friend is told 'You can't do that because you're a girl.'",
      options: [
        { id: "a", text: "That's not true, you can!", emoji: "💪", isCorrect: true },
        { id: "b", text: "Maybe they're right.", emoji: "🤷", isCorrect: false },
        { id: "c", text: "Ignore it.", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Classmate discouraged from playing sports.",
      options: [
        { id: "b", text: "Sports aren't for you.", emoji: "🚫", isCorrect: false },
        { id: "a", text: "Let's play together!", emoji: "⚽", isCorrect: true },
        { id: "c", text: "Find something else.", emoji: "🔍", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Sibling mocked for career choice.",
      options: [
        { id: "b", text: "Choose differently.", emoji: "🔄", isCorrect: false },
        { id: "c", text: "Laugh along.", emoji: "😂", isCorrect: false },
        { id: "a", text: "You'll be great at it!", emoji: "🌟", isCorrect: true }
      ]
    },
    {
      id: 4,
      text: "Peer feels bad about stereotype.",
      options: [
        { id: "b", text: "Get used to it.", emoji: "😔", isCorrect: false },
        { id: "a", text: "Stereotypes are wrong, be yourself!", emoji: "🦸", isCorrect: true },
        { id: "c", text: "Change to fit in.", emoji: "🕶️", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Friend discouraged from hobby.",
      options: [
        { id: "b", text: "Stop if others say so.", emoji: "🛑", isCorrect: false },
        { id: "c", text: "Hide it.", emoji: "🙊", isCorrect: false },
        { id: "a", text: "Keep doing what you love!", emoji: "❤️", isCorrect: true }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastQuestion = currentLevel === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setFinalScore(coins + (isCorrect ? 1 : 0));
        setShowResult(true);
      } else {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setCoins(0);
    setFinalScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Support Roleplay"
      score={coins}
      subtitle={!showResult ? `Question ${currentLevel + 1} of ${questions.length}` : "Quiz Complete!"}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      maxScore={questions.length}
      currentLevel={currentLevel + 1}
      totalLevels={questions.length}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId="uvls-kids-28"
      gameType="uvls"
    >
      <div className="space-y-8">
        {!showResult && questions[currentLevel] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentLevel + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentLevel].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentLevel].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Support Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} correct!
                  You know how to support others!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Supporting others means encouraging them, standing up for them, and helping them feel valued!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} correct.
                  Remember: Supporting others means encouraging and standing up for them!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Support others by encouraging them, standing up for them, and helping them feel valued!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SupportRoleplay;