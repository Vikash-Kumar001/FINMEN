import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AiInSpaceStory = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      emoji: "🚀🤖",
      text: "A robot helps astronauts explore Mars. Who controls what it does?",
      choices: [
        { id: 1, text: "Humans control the robot", emoji: "🧑‍🚀", isCorrect: true },
        { id: 2, text: "The robot controls humans", emoji: "🤖", isCorrect: false },
        { id: 3, text: "No one controls it, it acts alone", emoji: "🌌", isCorrect: false },
      ],
    },
    {
      id: 2,
      emoji: "🛰️🤖",
      text: "Can AI satellites help in space communication?",
      choices: [
        { id: 1, text: "Yes, AI assists humans", emoji: "🧠🛰️", isCorrect: true },
        { id: 2, text: "No, AI cannot assist", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI controls communication alone", emoji: "⚠️", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "🛸🤖",
      text: "Will AI help detect asteroids and space debris?",
      choices: [
        { id: 1, text: "Yes, as a helper", emoji: "🧠🛸", isCorrect: true },
        { id: 2, text: "No, AI cannot help", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI becomes the debris itself", emoji: "⚠️", isCorrect: false },
      ],
    },
    {
      id: 4,
      emoji: "👩‍🚀🤖",
      text: "Can AI robots assist astronauts in performing experiments?",
      choices: [
        { id: 1, text: "Yes, AI helps safely", emoji: "🧠🔬", isCorrect: true },
        { id: 2, text: "No, AI cannot help", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI replaces humans entirely", emoji: "⚠️", isCorrect: false },
      ],
    },
    {
      id: 5,
      emoji: "🌌🤖",
      text: "Will AI help humans explore other planets in the future?",
      choices: [
        { id: 1, text: "Yes, AI will assist", emoji: "🧠🌍", isCorrect: true },
        { id: 2, text: "No, humans do it alone", emoji: "❌", isCorrect: false },
        { id: 3, text: "AI replaces humans completely", emoji: "⚠️", isCorrect: false },
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
      navigate("/student/ai-for-all/kids/good-data-vs-bad-data-game");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="AI in Space Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastQuestion && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-88-${currentQuestion + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={88 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{question.text}</h2>

            <div className="space-y-3 mb-6">
              {question.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.isCorrect ? "🚀" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Not Quite..."}
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

export default AiInSpaceStory;
