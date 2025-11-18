import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OverfittingStoryy = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      title: "Red Apple Bias 🍎",
      situation: "The AI saw only red apples and predicts every fruit is red. What happened?",
      choices: [
        { id: 1, text: "Overfitting AI 🤖", isCorrect: true },
        { id: 2, text: "Perfect Model ✔️", isCorrect: false },
      ],
    },
    {
      title: "Green Apple Surprise 🍏",
      situation: "AI fails to recognize a green apple. Why did it happen?",
      choices: [
        { id: 1, text: "Overfitting on Red Apples 🤖", isCorrect: true },
        { id: 2, text: "Random Guess 🌟", isCorrect: false },
      ],
    },
    {
      title: "Learn More Variety 🌈",
      situation: "To improve AI, what should we do next?",
      choices: [
        { id: 1, text: "Train with diverse fruits 🍎🍏🍐", isCorrect: true },
        { id: 2, text: "Keep red apples only 🍎", isCorrect: false },
      ],
    },
    {
      title: "Better Predictions 📈",
      situation: "After adding variety, AI now predicts all fruits correctly. This teaches?",
      choices: [
        { id: 1, text: "Variety avoids overfitting 🤖", isCorrect: true },
        { id: 2, text: "Overfitting is good ✔️", isCorrect: false },
      ],
    },
    {
      title: "AI Lesson Learned 🎓",
      situation: "Teen learns that AI needs diverse data. Outcome?",
      choices: [
        { id: 1, text: "Better AI with more data 🌟", isCorrect: true },
        { id: 2, text: "Stick to red apples only 🍎", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins((prev) => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/teen/ai-mistake-reflex"); // update next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Overfitting Story"
      subtitle="Learning from Mistakes 🍏"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-overfitting-story"
      gameType="ai"
      totalLevels={20}
      currentLevel={55}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">🍎</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-red-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.text.split(" ")[1]}</div>
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.text.split(" ")[1]}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Overfitting Fixed!" : "❌ Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! Adding variety improves AI learning and prevents overfitting. 🌟🤖
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +10 Coins Earned! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    AI can overfit if it sees limited data. Try again to learn more! 🍏
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OverfittingStoryy;
