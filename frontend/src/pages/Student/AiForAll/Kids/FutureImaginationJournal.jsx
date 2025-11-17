import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FutureImaginationJournal = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 sequential imagination prompts
  const questions = [
    { id: 1, text: "How will AI help humans in 2050?", emoji: "🤖" },
    { id: 2, text: "What AI-powered tool would make daily life easier?", emoji: "🛠️" },
    { id: 3, text: "How can AI improve education?", emoji: "📚" },
    { id: 4, text: "Imagine a safe AI robot that helps at home. What does it do?", emoji: "🏠" },
    { id: 5, text: "Describe a futuristic AI invention you’d like to see.", emoji: "🌟" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [coins, setCoins] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestionIndex].id]: e.target.value }));
  };

  const handleSubmit = () => {
    const answer = answers[questions[currentQuestionIndex].id]?.trim();
    if (!answer) {
      flashPoints(0); // optional feedback
      return;
    }

    // Give coins for each valid answer
    setCoins((prev) => prev + 5);
    showCorrectAnswerFeedback(5, true);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, show popup
      setTimeout(() => setShowPopup(true), 500);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCoins(0);
    resetFeedback();
    setShowPopup(false);
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-explorer-hero-badge"); // Update with next game path
  };

  const currentQuestion = questions[currentQuestionIndex];
  const userInput = answers[currentQuestion.id] || "";

  return (
    <GameShell
      title="Future Imagination Journal ✍️"
      subtitle="AI in 2050"
      onNext={handleNext}
      nextEnabled={coins === questions.length * 5}
      showGameOver={coins === questions.length * 5}
      score={coins}
      gameId="ai-kids-99"
      gameType="input"
      totalLevels={100}
      currentLevel={99}
      showConfetti={coins === questions.length * 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-7xl mb-4 text-center">{currentQuestion.emoji}</div>
          <h3 className="text-white text-2xl font-bold mb-4">{currentQuestion.text}</h3>
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your idea here..."
            className="w-full bg-white/20 text-white p-4 rounded-xl border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-40 mb-6"
          />
          <button
            onClick={handleSubmit}
            disabled={userInput.trim().length === 0}
            className={`w-full py-3 rounded-xl font-bold text-white transition ${
              userInput.trim().length > 0
                ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                : 'bg-gray-500/50 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish"}
          </button>
        </div>
      </div>

      {/* ✅ Popup for Completion */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You completed all imagination prompts and earned the <strong>AI Explorer Hero Badge!</strong>
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned {coins} Coins! 🪙
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-blue-600 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default FutureImaginationJournal;
