import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartRobotStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Robot Helper",
      emoji: "🤖",
      situation: "You ask your robot for help with your homework. It gives you the full answer instantly.",
      choices: [
        { id: 1, text: "Copy the robot’s answer", emoji: "📋", isCorrect: false },
        { id: 2, text: "Read and understand before writing", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Submit without checking", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Math Magic",
      emoji: "🧮",
      situation: "The robot shows how to solve a math problem. You don’t understand the steps.",
      choices: [
        { id: 1, text: "Ask the robot to explain", emoji: "❓", isCorrect: true },
        { id: 2, text: "Ignore and copy answers", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Complain that it’s too hard", emoji: "😡", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Science Project",
      emoji: "🔬",
      situation: "The robot suggests a cool science project idea. You like it but want to make it unique.",
      choices: [
        { id: 1, text: "Add your own creativity", emoji: "🎨", isCorrect: true },
        { id: 2, text: "Just copy the robot’s project", emoji: "🧾", isCorrect: false },
        { id: 3, text: "Do nothing", emoji: "😴", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Essay Helper",
      emoji: "✍️",
      situation: "The robot writes an essay for you. It looks perfect but doesn’t sound like you.",
      choices: [
        { id: 1, text: "Edit it in your own words", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Submit as it is", emoji: "📄", isCorrect: false },
        { id: 3, text: "Complain about grammar", emoji: "😕", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Robot Feedback",
      emoji: "💬",
      situation: "After finishing your work, the robot gives feedback that you improved a lot!",
      choices: [
        { id: 1, text: "Say thanks and keep learning", emoji: "😊", isCorrect: true },
        { id: 2, text: "Ignore the feedback", emoji: "🙃", isCorrect: false },
        { id: 3, text: "Ask robot to do all work", emoji: "🤷‍♂️", isCorrect: false },
      ],
    },
  ];

  const current = stories[currentStory];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setCoins((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      showCorrectAnswerFeedback(1, true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/reflex-ai-safety1");
  };

  const allDone = currentStory === stories.length - 1 && showFeedback;

  return (
    <GameShell
      title="Smart Robot Story"
      score={coins}
      subtitle="Learn with Robots the Right Way"
      onNext={handleNext}
      nextEnabled={allDone && coins >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={allDone && coins >= 4}
      
      gameId="dcos-kids-71"
      gameType="story-choice"
      totalLevels={100}
      currentLevel={71}
      showConfetti={allDone && coins >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold">{choice.text}</div>
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
            <div className="text-6xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "Smart Thinking! 🤖✨" : "Try Again 🤔"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Awesome! You used the robot wisely — not for copying, but for learning. Keep it up!
                </p>
              </div>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Robots can help you learn, but never copy blindly. Always use your own understanding!
                </p>
              </div>
            )}

            <div className="text-center">
              {selectedChoiceData.isCorrect && <p className="text-yellow-400 text-xl font-bold mb-4">+1 Coin 🪙</p>}
              <button
                onClick={handleNextStory}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentStory < stories.length - 1 ? "Next Story ➡️" : "Finish Game 🎉"}
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartRobotStory;
