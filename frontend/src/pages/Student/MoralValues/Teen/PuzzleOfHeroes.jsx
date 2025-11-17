import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfHeroes = () => {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const matches = [
    { id: 1, concept: "Mahatma Gandhi", definition: "Non-violence and truth", isCorrect: true },
    { id: 2, concept: "Malala Yousafzai", definition: "Education and girls’ rights", isCorrect: true },
    { id: 3, concept: "Mother Teresa", definition: "Helping the poor and sick", isCorrect: true },
    { id: 4, concept: "Nelson Mandela", definition: "Freedom and equality", isCorrect: true },
    { id: 5, concept: "Abdul Kalam", definition: "Inspiring youth through science", isCorrect: true },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = matches[currentQuestionIndex];

  const handleMatch = (id) => {
    setSelectedMatch(id);
  };

  const handleConfirm = () => {
    const match = matches.find(m => m.id === selectedMatch);

    if (match?.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1);
    }

    if (currentQuestionIndex < matches.length - 1) {
      setTimeout(() => {
        setSelectedMatch(null);
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1000);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedMatch(null);
    setShowResult(false);
    setCoins(0);
    setCurrentQuestionIndex(0);
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/group-pressure-story");
  };

  const totalQuestions = matches.length;

  return (
    <GameShell
      title="Puzzle of Heroes"
      subtitle="Match the Great Heroes with Their Values"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={showResult && coins > 0}
      score={coins}
      gameId="moral-teen-54"
      gameType="moral"
      totalLevels={100}
      currentLevel={54}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🦸‍♂️</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Match the Hero’s Value ({currentQuestionIndex + 1}/{totalQuestions})
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                What is the key value of <span className="text-yellow-300">{currentQuestion.concept}</span>?
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => handleMatch(match.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedMatch === match.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">
                    {match.definition}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedMatch}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedMatch
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Match
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins === totalQuestions ? "🌟 Perfect Hero Matcher!" : "Good Effort!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              You matched {coins} out of {totalQuestions} heroes correctly!
            </p>

            {coins === totalQuestions ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! You’ve understood the values of great heroes like Gandhi, Malala,
                    and Kalam. Each stood for courage, peace, and inspiration — be the hero who
                    carries their legacy forward!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold">You earned 5 Coins! 🪙</p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    You almost got it! These heroes remind us that real strength lies in values —
                    try again to master their message!
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

export default PuzzleOfHeroes;
