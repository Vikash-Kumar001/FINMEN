import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FairnessQuiz1 = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "Game AI always favors one player. Is this fair?",
      emoji: "🎮",
      choices: [
        { id: 1, text: "Yes, it’s fine", emoji: "👍", isCorrect: false },
        { id: 2, text: "No, all players should be treated equally", emoji: "⚖️", isCorrect: true },
      ],
    },
    {
      text: "A game gives extra points only to boys. Fair or unfair?",
      emoji: "👦👧",
      choices: [
        { id: 1, text: "Fair", emoji: "✔️", isCorrect: false },
        { id: 2, text: "Unfair", emoji: "❌", isCorrect: true },
      ],
    },
    {
      text: "AI gives more chances to rich players. Is that fair?",
      emoji: "💰",
      choices: [
        { id: 1, text: "Yes, they paid more", emoji: "💸", isCorrect: false },
        { id: 2, text: "No, skill should matter", emoji: "🏅", isCorrect: true },
      ],
    },
    {
      text: "AI gives random rewards to everyone equally. Fair or unfair?",
      emoji: "🎁",
      choices: [
        { id: 1, text: "Fair", emoji: "🎉", isCorrect: true },
        { id: 2, text: "Unfair", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      text: "AI blocks a player just because of their name. Fair?",
      emoji: "🚷",
      choices: [
        { id: 1, text: "Fair", emoji: "✅", isCorrect: false },
        { id: 2, text: "Unfair", emoji: "⚠️", isCorrect: true },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const choice = question.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setScore((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const coins = score >= 4 ? 3 : 0;
      setEarnedCoins(coins);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setScore(0);
    setEarnedCoins(0);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/ai-friend-story");
  };

  const currentQ = questions[currentQuestion];
  const selectedChoiceData = currentQ.choices.find((c) => c.id === selectedChoice);

  const isGameOver = currentQuestion === questions.length - 1 && showFeedback;
  const allDone = earnedCoins > 0 || isGameOver;

  return (
    <GameShell
      title="Fairness Quiz1"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNextGame}
      nextEnabled={earnedCoins > 0}
      showGameOver={earnedCoins > 0}
      score={earnedCoins}
      gameId="dcos-kids-74"
      gameType="quiz"
      totalLevels={100}
      currentLevel={74}
      showConfetti={earnedCoins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!isGameOver ? (
          <>
            {!showFeedback ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-8xl mb-6 text-center">{currentQ.emoji}</div>
                <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-xl leading-relaxed text-center font-semibold">
                    {currentQ.text}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {currentQ.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice.id)}
                      className={`w-full border-2 rounded-xl p-5 transition-all ${
                        selectedChoice === choice.id
                          ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                          : "bg-white/20 border-white/40 hover:bg-white/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{choice.emoji}</div>
                        <div className="text-white font-semibold text-lg">{choice.text}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedChoice}
                  className={`w-full py-3 rounded-xl font-bold text-white transition ${
                    selectedChoice
                      ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                      : "bg-gray-500/50 cursor-not-allowed"
                  }`}
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedChoiceData.isCorrect ? "✅ Correct!" : "❌ Oops!"}
                </h2>
                <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

                {selectedChoiceData.isCorrect ? (
                  <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                    <p className="text-white text-center">
                      Great! Fair AI treats all players equally — no favorites or bias!
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                    <p className="text-white text-center">
                      Remember: AI must be fair to everyone — no unfair advantages!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion === questions.length - 1 ? "See Results" : "Next Question"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score >= 4 ? "🎉 Fairness Hero!" : "💭 Keep Trying!"}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              You answered {score} out of {questions.length} correctly.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {score >= 4
                ? "You earned 3 Coins! 🪙"
                : "Get 4 or more correct to earn coins!"}
            </p>
            {score < 4 ? (
              <button
                onClick={handleRestart}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            ) : (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 mt-4 text-center">
                <div className="text-5xl mb-2">🏅</div>
                <p className="text-white text-2xl font-bold">Fairness Hero Badge!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FairnessQuiz1;
