import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIorHumanQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Who created Google Translate?",
      emoji: "🌐",
      choices: [
        { id: 1, text: "AI", isCorrect: true },
        { id: 2, text: "Human", isCorrect: false }
      ],
      feedback: "Google Translate was built using AI to learn and translate languages automatically."
    },
    {
      text: "Who paints realistic portraits faster — AI or Human?",
      emoji: "🎨",
      choices: [
        { id: 1, text: "AI", isCorrect: true },
        { id: 2, text: "Human", isCorrect: false }
      ],
      feedback: "AI can generate digital portraits quickly using deep learning models!"
    },
    {
      text: "Who writes most news headlines today?",
      emoji: "📰",
      choices: [
        { id: 1, text: "AI", isCorrect: true },
        { id: 2, text: "Human", isCorrect: false }
      ],
      feedback: "Many online news outlets use AI to generate catchy headlines fast."
    },
    {
      text: "Who creates new songs and melodies — AI or Human?",
      emoji: "🎵",
      choices: [
        { id: 1, text: "Both", isCorrect: true },
        { id: 2, text: "Only Human", isCorrect: false }
      ],
      feedback: "AI can compose songs too, but humans add emotion and creativity!"
    },
    {
      text: "Who drives self-driving cars?",
      emoji: "🚗",
      choices: [
        { id: 1, text: "AI", isCorrect: true },
        { id: 2, text: "Human", isCorrect: false }
      ],
      feedback: "Self-driving cars are powered by AI systems using sensors and data."
    }
  ];

  const currentQ = questions[currentQuestion];
  const selectedChoiceData = currentQ.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQ.choices.find((c) => c.id === selectedChoice);
    let newCoins = coins;

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      newCoins = coins + 5;
      setCoins(newCoins);
      setTotalCoins(totalCoins + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/smart-speaker-story"); // next game route
    }
  };

  return (
    <GameShell
      title="AI or Human Quiz"
      subtitle="Who created this?"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={totalCoins}
      gameId="ai-kids-33"
      gameType="ai"
      totalLevels={100}
      currentLevel={33}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{currentQ.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                Q{currentQuestion + 1}. {currentQ.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQ.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-8 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-5xl mb-2">
                    {choice.text === "AI"
                      ? "🤖"
                      : choice.text === "Human"
                      ? "🧑"
                      : "🎶"}
                  </div>
                  <div className="text-white font-bold text-2xl">{choice.text}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">
              {selectedChoiceData?.isCorrect ? "✨" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Oops!"}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{currentQ.feedback}</p>
            </div>

            {selectedChoiceData?.isCorrect && (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                +5 Coins 🪙 (Total: {totalCoins})
              </p>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < questions.length - 1 ? "Next Question →" : "Finish Quiz 🎉"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIorHumanQuiz;
