import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FreeGiftStory = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      popup: "🎁 Free iPhone! Just click this link!",
      options: [
        { id: "click", text: "Click to claim the gift", isSafe: false },
        { id: "close", text: "Close the pop-up immediately", isSafe: true },
        { id: "share", text: "Share link with friends", isSafe: false },
      ],
    },
    {
      id: 2,
      popup: "🤑 You won ₹10,000! Enter your card number to get it!",
      options: [
        { id: "enter", text: "Enter card details", isSafe: false },
        { id: "ignore", text: "Ignore and tell a parent", isSafe: true },
        { id: "try", text: "Try it just once", isSafe: false },
      ],
    },
    {
      id: 3,
      popup: "📦 Your parcel is waiting! Click to track it!",
      options: [
        { id: "click", text: "Click and track", isSafe: false },
        { id: "check", text: "Ask your parents before clicking", isSafe: true },
        { id: "download", text: "Download the tracking app", isSafe: false },
      ],
    },
    {
      id: 4,
      popup: "🎮 Free game coins! Just install this app!",
      options: [
        { id: "install", text: "Install right now", isSafe: false },
        { id: "ignore", text: "Ignore suspicious links", isSafe: true },
        { id: "check", text: "Ask friend if it's real", isSafe: false },
      ],
    },
    {
      id: 5,
      popup: "💻 You are the lucky winner! Click here to claim now!",
      options: [
        { id: "click", text: "Click to claim prize", isSafe: false },
        { id: "close", text: "Close and report it", isSafe: true },
        { id: "reply", text: "Reply to ask more", isSafe: false },
      ],
    },
  ];

  const handleChoice = (optionId) => {
    const scenario = scenarios[currentScenario];
    const option = scenario.options.find((opt) => opt.id === optionId);

    const newChoices = [
      ...choices,
      { scenarioId: scenario.id, choice: optionId, isSafe: option.isSafe },
    ];

    setChoices(newChoices);

    if (option.isSafe) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario((prev) => prev + 1);
      }, option.isSafe ? 1000 : 800);
    } else {
      const safeCount = newChoices.filter((c) => c.isSafe).length;
      if (safeCount >= 4) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setChoices([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/fake-link-reflex");
  };

  const safeCount = choices.filter((c) => c.isSafe).length;

  return (
    <GameShell
      title="Free Gift Story"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && safeCount >= 4}
      showGameOver={showResult && safeCount >= 4}
      score={coins}
      gameId="dcos-kids-41"
      gameType="educational"
      totalLevels={100}
      currentLevel={41}
      showConfetti={showResult && safeCount >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-red-500/20 border-2 border-red-400/50 rounded-lg p-3 mb-4">
                <p className="text-red-200 text-xs font-semibold">
                  ⚠️ Don’t trust pop-ups that promise free gifts or prizes!
                </p>
              </div>

              <div className="text-6xl mb-4 text-center">🎁</div>

              <div className="bg-yellow-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic text-lg text-center">
                  Pop-up says: “{scenarios[currentScenario].popup}”
                </p>
              </div>

              <p className="text-white/90 mb-4 text-center font-semibold">
                What should you do?
              </p>

              <div className="space-y-3">
                {scenarios[currentScenario].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102"
                  >
                    <div className="text-white font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {safeCount >= 4 ? "🎉 Safe Kid Badge!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made {safeCount} out of {scenarios.length} safe choices!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {safeCount >= 4
                ? "You earned the Safe Kid Badge! 🏆"
                : "Get 4 or more safe choices to earn the badge!"}
            </p>
            <p className="text-white/70 text-sm">
              Always close suspicious pop-ups and never click on “too good to be true” offers.
            </p>
            {safeCount < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default FreeGiftStory;
