import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HomeworkStory1 = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const scenarios = [
    {
      id: 1,
      friend: "I found a YouTube channel explaining fractions — should I watch it?",
      emoji: "🧮",
      options: [
        { id: "watch", text: "Yes! It can help you learn.", isUseful: true },
        { id: "skip", text: "No, YouTube is only for fun.", isUseful: false },
        { id: "ignore", text: "Ignore homework and play games instead.", isUseful: false }
      ]
    },
    {
      id: 2,
      friend: "The video has too many ads — what should I do?",
      emoji: "📺",
      options: [
        { id: "ads", text: "Click all ads for prizes!", isUseful: false },
        { id: "focus", text: "Ignore ads and focus on learning part.", isUseful: true },
        { id: "exit", text: "Close YouTube and stop learning.", isUseful: false }
      ]
    },
    {
      id: 3,
      friend: "I found another video teaching with examples — should I save it?",
      emoji: "💡",
      options: [
        { id: "save", text: "Yes, save useful learning videos.", isUseful: true },
        { id: "comment", text: "Comment randomly for fun.", isUseful: false },
        { id: "share", text: "Share it to random people.", isUseful: false }
      ]
    },
    {
      id: 4,
      friend: "Someone in comments said wrong facts — what should I do?",
      emoji: "💬",
      options: [
        { id: "argue", text: "Argue and fight in comments.", isUseful: false },
        { id: "report", text: "Ignore or report wrong info calmly.", isUseful: true },
        { id: "believe", text: "Believe everything you read.", isUseful: false }
      ]
    },
    {
      id: 5,
      friend: "I learned a trick from YouTube — should I tell my teacher?",
      emoji: "🎓",
      options: [
        { id: "tell", text: "Yes! Sharing learning is great.", isUseful: true },
        { id: "hide", text: "No, keep it secret.", isUseful: false },
        { id: "forget", text: "Forget it and watch cartoons.", isUseful: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const scenario = scenarios[currentScenario];
    const option = scenario.options.find((opt) => opt.id === optionId);

    const newChoices = [
      ...choices,
      {
        scenarioId: scenario.id,
        choice: optionId,
        isUseful: option.isUseful
      }
    ];

    setChoices(newChoices);

    if (option.isUseful) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario((prev) => prev + 1);
      }, option.isUseful ? 1000 : 800);
    } else {
      const usefulCount = newChoices.filter((c) => c.isUseful).length;
      if (usefulCount >= 4) {
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
    navigate("/student/dcos/kids/reflex-offline-fun");
  };

  const usefulCount = choices.filter((c) => c.isUseful).length;

  return (
    <GameShell
      title="Homework Story"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && usefulCount >= 4}
      showGameOver={showResult && usefulCount >= 4}
      score={coins}
      gameId="dcos-kids-94"
      gameType="educational"
      totalLevels={100}
      currentLevel={94}
      showConfetti={showResult && usefulCount >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-green-500/20 border-2 border-green-400/50 rounded-lg p-3 mb-4">
                <p className="text-green-200 text-xs font-semibold">
                  💡 Use the internet wisely to LEARN, not waste time!
                </p>
              </div>

              <div className="text-6xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>

              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic text-lg">
                  Friend says: "{scenarios[currentScenario].friend}"
                </p>
              </div>

              <p className="text-white/90 mb-4 text-center font-semibold">
                What should your friend do?
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {usefulCount >= 4 ? "🏆 Smart Learner Badge!" : "💪 Keep Improving!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made {usefulCount} out of {scenarios.length} smart choices!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {usefulCount >= 4
                ? "You earned the Smart Learner Badge! 🎓"
                : "Get 4 or more useful choices to earn the badge!"}
            </p>
            <p className="text-white/70 text-sm">
              Remember: YouTube can be a powerful learning tool — use it wisely for your studies!
            </p>
            {usefulCount < 4 && (
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

export default HomeworkStory1;
