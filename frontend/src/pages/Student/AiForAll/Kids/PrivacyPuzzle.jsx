import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PrivacyPuzzle = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      items: [
        { id: 1, text: "Sharing password", correct: "Unsafe" },
        { id: 2, text: "Keeping password secret", correct: "Safe" }
      ]
    },
    {
      id: 2,
      items: [
        { id: 1, text: "Giving personal info to strangers online", correct: "Unsafe" },
        { id: 2, text: "Using strong passwords", correct: "Safe" }
      ]
    },
    {
      id: 3,
      items: [
        { id: 1, text: "Clicking suspicious links", correct: "Unsafe" },
        { id: 2, text: "Updating software regularly", correct: "Safe" }
      ]
    },
    {
      id: 4,
      items: [
        { id: 1, text: "Sharing your location with everyone", correct: "Unsafe" },
        { id: 2, text: "Sharing location only with trusted friends", correct: "Safe" }
      ]
    },
    {
      id: 5,
      items: [
        { id: 1, text: "Using public Wi-Fi for banking without VPN", correct: "Unsafe" },
        { id: 2, text: "Using VPN on public Wi-Fi", correct: "Safe" }
      ]
    }
  ];

  const options = ["Safe", "Unsafe"];
  const [currentScenario, setCurrentScenario] = useState(0);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const scenarioData = scenarios[currentScenario];

  const handleMatch = (itemId, option) => {
    setMatches(prev => ({ ...prev, [itemId]: option }));
  };

  const handleConfirm = () => {
    let tempScore = 0;
    scenarioData.items.forEach(item => {
      if (matches[item.id] === item.correct) tempScore += 1;
    });

    setScore(tempScore);

    if (tempScore === scenarioData.items.length) {
      setCoins(prev => prev + 5);
      showCorrectAnswerFeedback(5, false);
    }

    setShowResult(true);
  };

  const handleNextScenario = () => {
    setMatches({});
    setScore(0);
    setShowResult(false);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    }
  };

  const handleTryAgain = () => {
    setMatches({});
    setScore(0);
    setCoins(0);
    setShowResult(false);
    setCurrentScenario(0);
    resetFeedback();
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/kids/ai-bias-story"); // next game path
  };

  const isLastScenario = currentScenario === scenarios.length - 1;

  return (
    <GameShell
      title="Privacy Puzzle"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleFinish}
      nextEnabled={isLastScenario && showResult && score === scenarioData.items.length}
      showGameOver={isLastScenario && showResult && score === scenarioData.items.length}
      score={coins}
      gameId="ai-kids-78"
      gameType="ai"
      totalLevels={100}
      currentLevel={78}
      showConfetti={isLastScenario && showResult && score === scenarioData.items.length}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Match each action to its safety level
            </h3>

            <div className="space-y-4 mb-6">
              {scenarioData.items.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-blue-500/20 rounded-xl p-4">
                  <span className="text-white font-semibold text-lg">{item.text}</span>
                  <div className="flex gap-2">
                    {options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleMatch(item.id, option)}
                        className={`px-4 py-2 rounded-xl text-white font-bold transition ${
                          matches[item.id] === option
                            ? 'bg-purple-500/50 ring-2 ring-white'
                            : 'bg-white/20 hover:bg-white/30'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={Object.keys(matches).length !== scenarioData.items.length}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                Object.keys(matches).length === scenarioData.items.length
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Matches
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score === scenarioData.items.length ? "🎉 Well Done!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {score} out of {scenarioData.items.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Keeping safe online habits protects your privacy!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              {score === scenarioData.items.length ? `You earned 5 Coins! 🪙` : "Match all correctly to earn coins!"}
            </p>

            {score === scenarioData.items.length ? (
              !isLastScenario && (
                <button
                  onClick={handleNextScenario}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                  Next Scenario
                </button>
              )
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

export default PrivacyPuzzle;
