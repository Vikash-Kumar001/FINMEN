import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIOrNotQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Calculator = AI?",
      emoji: "🧮",
      choices: [
        { id: 1, text: "Yes - It's AI", emoji: "🤖", isCorrect: false },
        { id: 2, text: "No - It's not AI", emoji: "❌", isCorrect: true },
      ],
      feedback:
        "A calculator only follows fixed math rules — it doesn’t think or learn, so it’s NOT AI.",
    },
    {
      text: "Alexa = AI?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Yes - It's AI", emoji: "🤖", isCorrect: true },
        { id: 2, text: "No - It's not AI", emoji: "❌", isCorrect: false },
      ],
      feedback:
        "Correct! Alexa listens, understands, and learns from your commands — that’s AI in action!",
    },
    {
      text: "Fan = AI?",
      emoji: "🌀",
      choices: [
        { id: 1, text: "Yes - It's AI", emoji: "🤖", isCorrect: false },
        { id: 2, text: "No - It's not AI", emoji: "❌", isCorrect: true },
      ],
      feedback:
        "A fan just spins when you switch it on — it doesn’t make decisions or learn, so it's not AI.",
    },
    {
      text: "Google Maps Traffic Prediction = AI?",
      emoji: "🗺️",
      choices: [
        { id: 1, text: "Yes - It's AI", emoji: "🤖", isCorrect: true },
        { id: 2, text: "No - It's not AI", emoji: "❌", isCorrect: false },
      ],
      feedback:
        "Correct! Google Maps uses AI to predict traffic by analyzing data from millions of users.",
    },
    {
      text: "Automatic Street Light = AI?",
      emoji: "💡",
      choices: [
        { id: 1, text: "Yes - It's AI", emoji: "🤖", isCorrect: false },
        { id: 2, text: "No - It's not AI", emoji: "❌", isCorrect: true },
      ],
      feedback:
        "An automatic light uses sensors, not intelligence — it reacts but doesn’t learn, so it's not AI.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/kids/robot-helper-reflex");
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <GameShell
      title="AI or Not Quiz"
      subtitle="AI Awareness for Kids"
      onNext={handleFinish}
      nextEnabled={showFeedback && isLastQuestion}
      showGameOver={showFeedback && isLastQuestion}
      score={coins}
      gameId="ai-kids-21"
      gameType="ai"
      totalLevels={100}
      currentLevel={21}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                Q{currentQuestionIndex + 1}. {currentQuestion.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-2xl text-center">{choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🎉" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Not Quite..."}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{currentQuestion.feedback}</p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                +5 Coins! 🪙
              </p>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Skip to Next
              </button>
            )}

            {!isLastQuestion ? (
              <button
                onClick={handleNextQuestion}
                className="w-full mt-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 transition"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="w-full mt-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-yellow-500 hover:opacity-90 transition"
              >
                Finish Quiz 🏁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIOrNotQuiz;
