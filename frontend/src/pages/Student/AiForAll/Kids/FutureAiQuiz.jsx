import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FutureAiQuiz = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      emoji: "🚗🤖",
      text: "Will AI fly cars in the future?",
      choices: [
        { id: 1, text: "Maybe", emoji: "🤔", isCorrect: true },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: false },
        { id: 3, text: "No", emoji: "❌", isCorrect: false },
      ],
    },
    {
      id: 2,
      emoji: "🏢🤖",
      text: "Will AI help in building smart cities?",
      choices: [
        { id: 1, text: "Yes, as a helper", emoji: "🧠🏙️", isCorrect: true },
        { id: 2, text: "No, it can’t help", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI replaces humans completely", emoji: "⚠️", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "🛰️🤖",
      text: "Will AI explore space?",
      choices: [
        { id: 1, text: "Yes, it will help astronauts", emoji: "🧠🚀", isCorrect: true },
        { id: 2, text: "No, AI can’t work in space", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI becomes human astronauts", emoji: "⚠️", isCorrect: false },
      ],
    },
    {
      id: 4,
      emoji: "🏥🤖",
      text: "Can AI assist doctors in hospitals?",
      choices: [
        { id: 1, text: "Yes, as a helper", emoji: "🧠💉", isCorrect: true },
        { id: 2, text: "No, AI cannot help", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI replaces doctors completely", emoji: "⚠️", isCorrect: false },
      ],
    },
    {
      id: 5,
      emoji: "🌱🤖",
      text: "Will AI help in saving the environment?",
      choices: [
        { id: 1, text: "Yes, it can assist humans", emoji: "🧠🌳", isCorrect: true },
        { id: 2, text: "No, AI has no impact", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI controls nature alone", emoji: "⚠️", isCorrect: false },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find((c) => c.id === selectedChoice);
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = question.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, false);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/kids/ai-in-space-story");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Future of AI Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastQuestion && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-87-${currentQuestion + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={87 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {question.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-8 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4">{selectedChoiceData?.isCorrect ? "🌟" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Not Exactly..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold mb-4">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                  {isLastQuestion ? "Finish" : "Next Question"}
                </button>
              </>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FutureAiQuiz;
