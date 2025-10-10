import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexTeenRespect = () => {
  const navigate = useNavigate();
  const [currentAction, setCurrentAction] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const actions = [
    { text: "Respect Women", emoji: "👩", isRespectful: true },
    { text: "Disrespect Women", emoji: "🚫", isRespectful: false },
    { text: "Listen to All", emoji: "👂", isRespectful: true },
    { text: "Interrupt Rudely", emoji: "🗣️", isRespectful: false },
    { text: "Value Diversity", emoji: "🌈", isRespectful: true },
    { text: "Discriminate", emoji: "⛔", isRespectful: false },
    { text: "Honor Elders", emoji: "🙏", isRespectful: true },
    { text: "Mock Elderly", emoji: "😂", isRespectful: false },
    { text: "Include Everyone", emoji: "🤗", isRespectful: true },
    { text: "Exclude Others", emoji: "🙅", isRespectful: false }
  ];

  useEffect(() => {
    if (round < 10) {
      setCurrentAction(actions[round]);
    } else if (round === 10) {
      setGameOver(true);
      if (correctCount >= 7) {
        showCorrectAnswerFeedback(3, true);
        setScore(3);
      }
    }
  }, [round]);

  const handleChoice = (isRespectful) => {
    if (currentAction.isRespectful === isRespectful) {
      setCorrectCount(prev => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Wrong!");
    }

    setTimeout(() => {
      setFeedback("");
      setRound(prev => prev + 1);
    }, 800);
  };

  const handleNext = () => {
    navigate("/student/civic-responsibility/teen/puzzle-inclusion-acts");
  };

  return (
    <GameShell
      title="Reflex Teen Respect"
      subtitle="Identify Respectful Actions"
      onNext={handleNext}
      nextEnabled={gameOver && score > 0}
      showGameOver={gameOver}
      score={score}
      gameId="crgc-teen-13"
      gameType="crgc"
      totalLevels={20}
      currentLevel={13}
      showConfetti={gameOver && score > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        {!gameOver ? (
          <>
            <div className="text-center mb-8">
              <div className="text-xl font-semibold text-gray-700 mb-2">
                Round {round + 1} of 10
              </div>
              <div className="text-lg text-purple-600 font-bold">
                Correct: {correctCount}/10
              </div>
            </div>

            {currentAction && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 shadow-lg">
                <div className="text-center">
                  <div className="text-8xl mb-6">{currentAction.emoji}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">{currentAction.text}</h2>
                  
                  <div className="flex gap-6 justify-center">
                    <button
                      onClick={() => handleChoice(true)}
                      className="px-12 py-6 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition-all transform hover:scale-110 shadow-lg"
                    >
                      👍 Respectful
                    </button>
                    <button
                      onClick={() => handleChoice(false)}
                      className="px-12 py-6 bg-red-500 text-white rounded-xl font-bold text-xl hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
                    >
                      👎 Not Respectful
                    </button>
                  </div>
                </div>
              </div>
            )}

            {feedback && (
              <div className="text-center">
                <p className="text-3xl font-bold">{feedback}</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Complete!</h2>
              <p className="text-2xl text-gray-700 mb-4">
                You got <span className="font-bold text-purple-600">{correctCount}/10</span> correct!
              </p>
              <p className="text-lg text-gray-600">
                {correctCount >= 7 
                  ? "Great! You understand what it means to be respectful! 🌟"
                  : "Keep learning about respect and inclusion! 💪"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenRespect;

