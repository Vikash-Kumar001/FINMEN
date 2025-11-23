import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebatePeaceVsRevenge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const topic = "Does revenge bring peace?";
  const questions = [
    {
      id: 1,
      question: "When someone hurts you, what truly brings peace?",
      options: [
        { text: "Forgiving them and moving on", isCorrect: true },
        { text: "Getting back at them", isCorrect: false },
      ],
      feedback: "Forgiving others releases your inner peace — revenge only adds pain."
    },
    {
      id: 2,
      question: "What does revenge often lead to?",
      options: [
        { text: "More anger and pain", isCorrect: true },
        { text: "Inner satisfaction", isCorrect: false },
      ],
      feedback: "Revenge continues the cycle of hurt — peace breaks it."
    },
    {
      id: 3,
      question: "What shows true strength?",
      options: [
        { text: "Letting go and staying calm", isCorrect: true },
        { text: "Making the other person suffer", isCorrect: false },
      ],
      feedback: "True strength lies in calmness, not in causing harm."
    },
    {
      id: 4,
      question: "What helps build a peaceful world?",
      options: [
        { text: "Forgiveness and understanding", isCorrect: true },
        { text: "Revenge and retaliation", isCorrect: false },
      ],
      feedback: "Forgiveness makes peace spread — revenge breaks it."
    },
    {
      id: 5,
      question: "If someone apologizes sincerely, what should you do?",
      options: [
        { text: "Forgive them and move forward", isCorrect: true },
        { text: "Hold a grudge and plan revenge", isCorrect: false },
      ],
      feedback: "Forgiveness brings closure and frees your heart from negativity."
    },
  ];

  const current = questions[currentQuestion];

  const handleSelect = (index) => {
    setSelectedChoice(index);
  };

  const handleConfirm = () => {
    if (selectedChoice === null) return;

    const selected = current.options[selectedChoice];
    if (selected.isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setCoins((prev) => prev + 2);
      showCorrectAnswerFeedback(2, true);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
      setCurrentQuestion(questions.length); // mark quiz complete
    }
  };

  const handleFinish = () => {
    navigate("/student/moral-values/teen/journal-of-resolution");
  };

  const quizComplete = currentQuestion >= questions.length;

  return (
    <GameShell
      title="Debate: Peace vs Revenge"
      subtitle={topic}
      onNext={handleFinish}
      nextEnabled={quizComplete}
      showGameOver={quizComplete}
      score={coins}
      gameId="moral-teen-86"
      gameType="moral"
      totalLevels={100}
      currentLevel={86}
      showConfetti={showFeedback && selectedChoice !== null && current.options[selectedChoice]?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!quizComplete ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-6xl mb-4 text-center">🕊️</div>
              <h2 className="text-xl font-bold text-white mb-4 text-center">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <p className="text-white text-lg mb-6 text-center">{current.question}</p>

              <div className="space-y-4">
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full border-2 rounded-xl p-4 text-white transition-all ${
                      selectedChoice === i
                        ? "bg-purple-500/60 border-purple-400 ring-2 ring-white"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={selectedChoice === null}
                className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                  selectedChoice !== null
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-6xl mb-4 text-center">
                {current.options[selectedChoice].isCorrect ? "🌿" : "⚔️"}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {current.options[selectedChoice].isCorrect
                  ? "Peaceful Mind!"
                  : "Think Again..."}
              </h2>
              <p className="text-white/80 text-center mb-6">
                {current.feedback}
              </p>

              {current.options[selectedChoice].isCorrect ? (
                <p className="text-yellow-400 text-xl font-bold text-center mb-6">
                  +2 Coins Earned! 🪙
                </p>
              ) : null}

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentQuestion < questions.length - 1 ? "Next ➡️" : "Finish ✅"}
              </button>
            </div>
          )
        ) : (
          // Final Summary Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4">True Peace Maker!</h2>
            <p className="text-white/90 text-lg mb-6">
              You answered {correctAnswers} out of {questions.length} questions correctly.
              <br />Forgiveness, patience, and understanding bring harmony to your heart and others around you.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">You earned {coins} Coins! 🪙</p>

            <button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue 🌈
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebatePeaceVsRevenge;
