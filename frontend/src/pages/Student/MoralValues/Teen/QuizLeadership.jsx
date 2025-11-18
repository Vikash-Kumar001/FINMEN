import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizLeadership = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  // 🧠 Leadership Quiz Questions
  const questions = [
    {
      id: 1,
      text: "What makes a great leader?",
      emoji: "👑",
      choices: [
        { id: 1, text: "Commanding others", emoji: "📣", isCorrect: false },
        { id: 2, text: "Serving and helping others", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Ignoring the team", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "A true leader inspires others by…",
      emoji: "💡",
      choices: [
        { id: 1, text: "Yelling for obedience", emoji: "😠", isCorrect: false },
        { id: 2, text: "Setting a good example", emoji: "🌟", isCorrect: true },
        { id: 3, text: "Doing everything alone", emoji: "🚶‍♂️", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "When your team is struggling, a leader should…",
      emoji: "🧩",
      choices: [
        { id: 1, text: "Blame them for failure", emoji: "👎", isCorrect: false },
        { id: 2, text: "Support and guide them", emoji: "🫶", isCorrect: true },
        { id: 3, text: "Stay silent", emoji: "🤐", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "What quality best defines good leadership?",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Kindness and fairness", emoji: "💖", isCorrect: true },
        { id: 2, text: "Bossiness", emoji: "😤", isCorrect: false },
        { id: 3, text: "Popularity", emoji: "🎭", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "A good leader makes decisions that…",
      emoji: "📊",
      choices: [
        { id: 1, text: "Benefit everyone in the team", emoji: "🌍", isCorrect: true },
        { id: 2, text: "Only help themselves", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Avoid responsibility", emoji: "🚫", isCorrect: false },
      ],
    },
  ];

  const currentQuestionData = questions[currentQuestion];
  const selectedChoiceData = currentQuestionData?.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoiceData) return;

    setShowFeedback(true);

    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }

    // ⏳ Auto move to next question after 3s
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedChoice(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        // ✅ Move to next game after last question
        navigate("/student/moral-values/teen/reflex-leadership-traits");
      }
    }, 3000);
  };

  return (
    <GameShell
      title="Quiz on Leadership"
      subtitle="Learn What True Leaders Do"
      score={coins}
      gameId="moral-teen-72"
      gameType="moral"
      totalLevels={100}
      currentLevel={72}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">
              {currentQuestionData.emoji}
            </div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            {/* ✅ Choices */}
            <div className="space-y-3 mb-6">
              {currentQuestionData.choices.map((choice) => (
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
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* ✅ Confirm Button */}
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
          // ✅ Feedback View
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🌟 Great Leader!" : "🤔 Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {selectedChoiceData.text}
            </p>
            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <p className="text-white">
                {selectedChoiceData.isCorrect
                  ? "Excellent! True leaders serve, inspire, and support others instead of commanding. 💪"
                  : "Leadership isn't about control — it's about guiding with kindness and setting an example."}
              </p>
            </div>
            {selectedChoiceData.isCorrect && (
              <p className="text-yellow-400 text-2xl font-bold">
                You earned 3 Coins! 🪙
              </p>
            )}
            <p className="text-white/60 text-sm mt-3">
              Next question loading...
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizLeadership;
