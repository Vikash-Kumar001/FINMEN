import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StrangerChatStory = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      stranger: "Hi! What is your name?",
      emoji: "👤",
      options: [
        { id: "reply", text: "Tell them your name", isSafe: false },
        { id: "ignore", text: "Don't reply and close chat", isSafe: true },
        { id: "ask", text: "Ask who they are first", isSafe: false }
      ]
    },
    {
      id: 2,
      stranger: "Where do you go to school?",
      emoji: "🏫",
      options: [
        { id: "tell", text: "Tell them your school name", isSafe: false },
        { id: "block", text: "Don't reply and block them", isSafe: true },
        { id: "lie", text: "Make up a fake school", isSafe: false }
      ]
    },
    {
      id: 3,
      stranger: "Can I have your phone number?",
      emoji: "📱",
      options: [
        { id: "give", text: "Share your phone number", isSafe: false },
        { id: "refuse", text: "Say no and report to adult", isSafe: true },
        { id: "parent", text: "Give parent's number instead", isSafe: false }
      ]
    },
    {
      id: 4,
      stranger: "I have candy! Want to meet in person?",
      emoji: "🍬",
      options: [
        { id: "meet", text: "Agree to meet them", isSafe: false },
        { id: "tell", text: "Don't respond and tell parent immediately", isSafe: true },
        { id: "ask", text: "Ask where to meet", isSafe: false }
      ]
    },
    {
      id: 5,
      stranger: "Send me a photo of yourself!",
      emoji: "📸",
      options: [
        { id: "send", text: "Send a photo", isSafe: false },
        { id: "refuse", text: "Refuse and tell trusted adult", isSafe: true },
        { id: "old", text: "Send an old photo", isSafe: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const scenario = scenarios[currentScenario];
    const option = scenario.options.find(opt => opt.id === optionId);
    
    const newChoices = [...choices, {
      scenarioId: scenario.id,
      choice: optionId,
      isSafe: option.isSafe
    }];
    
    setChoices(newChoices);
    
    if (option.isSafe) {
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, option.isSafe ? 1000 : 800);
    } else {
      const safeCount = newChoices.filter(c => c.isSafe).length;
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
    navigate("/student/dcos/kids/photo-share-quiz");
  };

  const safeCount = choices.filter(c => c.isSafe).length;

  return (
    <GameShell
      title="Stranger Chat Story"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && safeCount >= 4}
      showGameOver={showResult && safeCount >= 4}
      score={coins}
      gameId="dcos-kids-2"
      gameType="educational"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showResult && safeCount >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  ⚠️ Never share personal information with strangers online!
                </p>
              </div>
              
              <div className="text-6xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic text-lg">
                  Stranger says: "{scenarios[currentScenario].stranger}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center font-semibold">What should you do?</p>
              
              <div className="space-y-3">
                {scenarios[currentScenario].options.map(option => (
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
              {safeCount >= 4 ? "You earned the Safe Kid Badge! 🏆" : "Get 4 or more safe choices to earn the badge!"}
            </p>
            <p className="text-white/70 text-sm">
              Remember: NEVER share personal information with strangers online. Always tell a trusted adult!
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

export default StrangerChatStory;

