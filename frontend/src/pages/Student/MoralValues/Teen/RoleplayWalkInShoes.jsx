import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayWalkInShoes = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      situation: "You are a new student in school and no one talks to you. How would you feel?",
      options: ["Lonely", "Excited", "Angry"],
      correct: "Lonely",
    },
    {
      id: 2,
      situation: "Your friend lost their pencil and looks sad. How would you feel if it were you?",
      options: ["Upset", "Happy", "Confused"],
      correct: "Upset",
    },
    {
      id: 3,
      situation: "You dropped your lunch in front of everyone. What feeling best fits?",
      options: ["Embarrassed", "Proud", "Calm"],
      correct: "Embarrassed",
    },
    {
      id: 4,
      situation: "A classmate forgot their homework. What might they feel?",
      options: ["Worried", "Relaxed", "Joyful"],
      correct: "Worried",
    },
    {
      id: 5,
      situation: "You helped someone who fell down. How would that make you feel?",
      options: ["Kind", "Guilty", "Angry"],
      correct: "Kind",
    },
  ];

  const currentScenario = scenarios[currentIndex];

  const handleSelect = (option) => {
    setSelectedFeeling(option);
  };

  const handleConfirm = () => {
    if (selectedFeeling === currentScenario.correct) {
      showCorrectAnswerFeedback(1, true);
      setCorrectCount((prev) => prev + 1);
    }

    if (currentIndex < scenarios.length - 1) {
      setTimeout(() => {
        setSelectedFeeling("");
        setCurrentIndex((prev) => prev + 1);
      }, 700);
    } else {
      setCoins(correctCount + (selectedFeeling === currentScenario.correct ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedFeeling("");
    setCurrentIndex(0);
    setCorrectCount(0);
    setCoins(0);
    setShowResult(false);
  };

  const handleNext = () => {
    navigate("/games/moral-values/teen/debate-kindness-strength");
  };

  return (
    <GameShell
      title="Roleplay: Walk in Shoes"
      subtitle="Empathy and Understanding"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={showResult && coins > 0}
      score={coins}
      gameId="moral-teen-25"
      gameType="moral"
      totalLevels={100}
      currentLevel={25}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🤔</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Imagine Their Feelings
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                {currentScenario.situation}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentScenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedFeeling === option
                      ? "bg-blue-500/60 border-blue-300 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">
                    {option}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedFeeling}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedFeeling
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">💖</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins >= 3 ? "🌟 Great Empathy!" : "Keep Practicing!"}
            </h2>

            {coins >= 3 ? (
              <>
                <p className="text-white/80 mb-4">
                  You understood how others might feel — that’s real empathy! 🌈
                </p>
                <p className="text-yellow-400 text-2xl font-bold">
                  You earned {coins} Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <p className="text-white/80 mb-4">
                  Some answers were close! Try again to walk in others’ shoes and
                  understand their emotions better. 💕
                </p>
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

export default RoleplayWalkInShoes;
