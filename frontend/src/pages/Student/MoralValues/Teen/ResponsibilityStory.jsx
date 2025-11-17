import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ResponsibilityStory = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Project Leadership",
      emoji: "📊",
      situation: "You’re leading a group project. Do you divide work fairly or dump it on others?",
      choices: [
        { id: 1, text: "Dump work on others", emoji: "😅", isCorrect: false },
        { id: 2, text: "Divide work fairly", emoji: "✅", isCorrect: true },
      ],
    },
    {
      id: 2,
      title: "Team Presentation",
      emoji: "📝",
      situation: "The team has a presentation. Do you take all credit or share it?",
      choices: [
        { id: 1, text: "Take all credit", emoji: "🙄", isCorrect: false },
        { id: 2, text: "Share credit equally", emoji: "👏", isCorrect: true },
      ],
    },
    {
      id: 3,
      title: "Deadline Management",
      emoji: "⏰",
      situation: "Some members are slow. Do you finish everything yourself or help them?",
      choices: [
        { id: 1, text: "Finish everything myself", emoji: "😤", isCorrect: false },
        { id: 2, text: "Help members complete tasks", emoji: "🤝", isCorrect: true },
      ],
    },
    {
      id: 4,
      title: "Conflict Resolution",
      emoji: "⚖️",
      situation: "Two members argue. Do you ignore it or mediate fairly?",
      choices: [
        { id: 1, text: "Ignore the argument", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Mediate fairly", emoji: "🗣️", isCorrect: true },
      ],
    },
    {
      id: 5,
      title: "Extra Task",
      emoji: "📌",
      situation: "An extra task comes. Do you force others to do it or distribute fairly?",
      choices: [
        { id: 1, text: "Force others", emoji: "😠", isCorrect: false },
        { id: 2, text: "Distribute fairly", emoji: "💪", isCorrect: true },
      ],
    },
  ];

  const currentScenario = scenarios[currentScenarioIndex];
  const selectedChoiceData = currentScenario.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;

    const choice = currentScenario.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/quiz-discipline");
    }
  };

  return (
    <GameShell
      title="Responsibility Story"
      subtitle={`Scenario ${currentScenarioIndex + 1} of ${scenarios.length}`}
      onNext={handleNextScenario}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={currentScenarioIndex === scenarios.length - 1 && showFeedback}
      score={coins}
      gameId="moral-teen-31"
      gameType="moral"
      totalLevels={100}
      currentLevel={31}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentScenario.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentScenario.title}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentScenario.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            <div className="space-y-3 mb-6">
              {currentScenario.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✅ Responsible Leader!" : "Think Again..."}
            </h2>

            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.text}
            </p>

            {selectedChoiceData.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextScenario}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Scenario
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That wasn’t the responsible choice. Try again and choose what a fair
                    and caring leader would do.
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default ResponsibilityStory;
