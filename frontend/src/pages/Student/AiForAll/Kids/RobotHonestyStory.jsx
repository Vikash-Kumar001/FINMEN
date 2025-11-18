import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotHonestyStory = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Robot and Honesty",
      emoji: "🤖",
      situation: "Your robot is told to cheat in a game. What should it do?",
      choices: [
        { id: 1, text: "Cheat", emoji: "📝", isCorrect: false },
        { id: 2, text: "Refuse", emoji: "✋", isCorrect: true }
      ]
    },
    {
      id: 2,
      title: "Robot and Privacy",
      emoji: "🔒",
      situation: "The robot can spy on classmates to get answers. What should it do?",
      choices: [
        { id: 1, text: "Spy secretly", emoji: "👀", isCorrect: false },
        { id: 2, text: "Respect privacy", emoji: "✋", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Robot and Sharing",
      emoji: "📤",
      situation: "Robot finds a way to share answers online without permission. Action?",
      choices: [
        { id: 1, text: "Share answers", emoji: "📄", isCorrect: false },
        { id: 2, text: "Keep info private", emoji: "🔐", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "Robot and Lying",
      emoji: "🤥",
      situation: "Robot can lie to get more rewards. Action?",
      choices: [
        { id: 1, text: "Lie for reward", emoji: "💰", isCorrect: false },
        { id: 2, text: "Be honest", emoji: "✋", isCorrect: true }
      ]
    },
    {
      id: 5,
      title: "Robot and Helping Others",
      emoji: "🤖💖",
      situation: "Robot sees another robot struggling. What should it do?",
      choices: [
        { id: 1, text: "Ignore", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Help them", emoji: "🤝", isCorrect: true }
      ]
    }
  ];

  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const storyData = stories[currentStory];
  const selectedChoiceData = storyData.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(10, false);
      setCoins(prev => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    setShowFeedback(false);
    setSelectedChoice(null);

    if (currentStory < stories.length - 1) {
      setCurrentStory(prev => prev + 1);
    }
  };

  const handleTryAgain = () => {
    setCurrentStory(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/kids/privacy-puzzle"); // next game path
  };

  const isLastStory = currentStory === stories.length - 1;

  return (
    <GameShell
      title="Robot Honesty Stories"
      subtitle={`Scenario ${currentStory + 1} of ${stories.length}`}
      onNext={handleFinish}
      nextEnabled={isLastStory && showFeedback && coins > 0}
      showGameOver={isLastStory && showFeedback && coins > 0}
      score={coins}
      gameId="ai-kids-77"
      gameType="ai"
      totalLevels={100}
      currentLevel={77}
      showConfetti={isLastStory && showFeedback && coins > 0}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{storyData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{storyData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{storyData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should the robot do?</h3>
            <div className="space-y-3 mb-6">
              {storyData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Honest Robot!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! This teaches honesty and ethical behavior in AI.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Not quite. Teaching robots honesty is essential for ethical AI.
                </p>
              </div>
            )}

            {isLastStory ? (
              !selectedChoiceData.isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              )
            ) : (
              <button
                onClick={handleNextStory}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                Next Scenario
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotHonestyStory;
